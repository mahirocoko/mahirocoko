"""Fail-closed standard-library-only Ollama /api/embed client restricted to loopback HTTP."""

import json
import math
import time
from typing import Any, Dict, List, Set, Tuple
import urllib.error
import urllib.parse
import urllib.request

ALLOWED_LOOPBACK_HOSTS: Set[str] = {
    'localhost',
    '127.0.0.1',
    '::1',
    '[::1]',
}


def validate_loopback_url(endpoint: str) -> str:
    """Validate that endpoint URL is loopback HTTP only."""
    if not endpoint or not isinstance(endpoint, str):
        raise ValueError(f'Invalid Ollama endpoint: {endpoint!r}')

    parsed = urllib.parse.urlparse(endpoint.strip())
    if parsed.scheme != 'http':
        raise ValueError(
            f"Security violation: Ollama endpoint must use 'http' scheme on loopback, got {parsed.scheme!r}"
        )

    hostname = (parsed.hostname or '').lower()
    if hostname not in ALLOWED_LOOPBACK_HOSTS:
        raise ValueError(
            f'Security violation: Ollama endpoint must resolve to loopback (localhost, 127.0.0.1, ::1). '
            f'Received non-loopback host: {hostname!r}'
        )

    port = parsed.port or 11434
    if ':' in hostname and not hostname.startswith('['):
        host_str = f'[{hostname}]'
    else:
        host_str = hostname
    return f'http://{host_str}:{port}'


class OllamaClient:
    """Loopback-only HTTP client for Ollama /api/embed."""

    def __init__(self, base_url: str = 'http://127.0.0.1:11434', timeout_seconds: float = 60.0) -> None:
        self.base_url = validate_loopback_url(base_url)
        self.timeout_seconds = timeout_seconds

    def _request_json(self, path: str) -> Dict[str, Any]:
        """Fetch and decode one loopback Ollama JSON endpoint."""
        req = urllib.request.Request(
            f'{self.base_url}{path}',
            headers={'Accept': 'application/json'},
            method='GET',
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as resp:
                status = resp.status
                raw_body = resp.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='replace')
            raise RuntimeError(
                f'Ollama metadata endpoint {path} returned HTTP {e.code}: {err_body}'
            ) from e
        except urllib.error.URLError as e:
            raise ConnectionError(
                f'Failed to connect to loopback Ollama endpoint {path}: {e.reason}'
            ) from e

        if status != 200:
            raise RuntimeError(
                f'Ollama metadata endpoint {path} returned status {status}: {raw_body}'
            )
        try:
            parsed = json.loads(raw_body)
        except json.JSONDecodeError as e:
            raise ValueError(f'Ollama metadata endpoint {path} returned invalid JSON: {e}') from e
        if not isinstance(parsed, dict):
            raise ValueError(
                f'Ollama metadata endpoint {path} must return a JSON object'
            )
        return parsed

    @staticmethod
    def parse_runtime_metadata(
        version_data: Dict[str, Any],
        tags_data: Dict[str, Any],
        running_data: Dict[str, Any],
        required_models: Set[str],
    ) -> Dict[str, Any]:
        """Keep bounded reproducibility fields from Ollama metadata responses."""
        version = version_data.get('version')
        if not isinstance(version, str) or not version.strip():
            raise ValueError('Ollama /api/version response is missing a valid version')

        installed: Dict[str, Dict[str, Any]] = {}
        models = tags_data.get('models')
        if not isinstance(models, list):
            raise ValueError("Ollama /api/tags response is missing a 'models' list")
        for item in models:
            if not isinstance(item, dict):
                continue
            name = item.get('name') or item.get('model')
            if name not in required_models:
                continue
            digest = item.get('digest')
            size = item.get('size')
            if not isinstance(digest, str) or not digest:
                raise ValueError(f'Ollama model {name!r} is missing a digest')
            if isinstance(size, bool) or not isinstance(size, int) or size <= 0:
                raise ValueError(f'Ollama model {name!r} has invalid size: {size!r}')
            details = item.get('details') if isinstance(item.get('details'), dict) else {}
            installed[name] = {
                'name': name,
                'digest': digest,
                'size_bytes': size,
                'modified_at': item.get('modified_at'),
                'details': {
                    key: details.get(key)
                    for key in (
                        'format',
                        'family',
                        'families',
                        'parameter_size',
                        'quantization_level',
                    )
                    if key in details
                },
            }

        missing = sorted(required_models - set(installed))
        if missing:
            raise ValueError(f'Required Ollama model tags are not installed: {missing}')

        loaded: Dict[str, Dict[str, Any]] = {}
        running_models = running_data.get('models')
        if not isinstance(running_models, list):
            raise ValueError("Ollama /api/ps response is missing a 'models' list")
        for item in running_models:
            if not isinstance(item, dict):
                continue
            name = item.get('name') or item.get('model')
            if name not in required_models:
                continue
            loaded[name] = {
                'name': name,
                'digest': item.get('digest'),
                'size_bytes': item.get('size'),
                'size_vram_bytes': item.get('size_vram'),
                'context_length': item.get('context_length'),
                'expires_at': item.get('expires_at'),
            }

        return {
            'version': version,
            'installed_models': installed,
            'loaded_models_after_run': loaded,
        }

    def get_runtime_metadata(self, required_models: Set[str]) -> Dict[str, Any]:
        """Capture version, exact installed model digests, and loaded footprints."""
        return self.parse_runtime_metadata(
            self._request_json('/api/version'),
            self._request_json('/api/tags'),
            self._request_json('/api/ps'),
            required_models,
        )

    def parse_embed_response(self, response_data: Any, expected_count: int) -> List[List[float]]:
        """Strictly parse and validate Ollama /api/embed JSON payload fail-closed."""
        if not isinstance(response_data, dict):
            raise ValueError(f'Malformed Ollama response: expected JSON object, got {type(response_data).__name__}')

        if 'embeddings' not in response_data:
            err = response_data.get('error', 'unknown error')
            raise ValueError(f"Malformed Ollama response: missing 'embeddings' field (error={err!r})")

        embeddings = response_data['embeddings']
        if not isinstance(embeddings, list):
            raise ValueError(
                f"Malformed Ollama response: 'embeddings' must be a list, got {type(embeddings).__name__}"
            )

        if len(embeddings) != expected_count:
            raise ValueError(
                f'Ollama embeddings count mismatch: expected {expected_count} vectors, received {len(embeddings)}'
            )

        dim: int | None = None
        for i, vec in enumerate(embeddings):
            if not isinstance(vec, list) or not vec:
                raise ValueError(f'Vector at index {i} is empty or not a list')

            if dim is None:
                dim = len(vec)
            elif len(vec) != dim:
                raise ValueError(
                    f'Inconsistent vector dimension in batch: vector {i} has dim {len(vec)}, expected {dim}'
                )

            for j, val in enumerate(vec):
                if isinstance(val, bool) or not isinstance(val, (int, float)) or not math.isfinite(val):
                    raise ValueError(f'Vector {i} contains non-finite or invalid float at index {j}: {val!r}')

        return embeddings

    def embed_batch(
        self,
        model: str,
        texts: List[str],
        batch_size: int = 16,
    ) -> Tuple[List[List[float]], float]:
        """Embed a list of texts in batches using POST /api/embed. Returns (embeddings, latency_ms)."""
        if not texts:
            return [], 0.0
        if batch_size <= 0:
            raise ValueError(f'batch_size must be positive, got {batch_size}')

        embed_url = f'{self.base_url}/api/embed'
        all_embeddings: List[List[float]] = []
        total_latency_ms = 0.0
        expected_dim: int | None = None

        for start_idx in range(0, len(texts), batch_size):
            batch = texts[start_idx : start_idx + batch_size]
            payload = json.dumps({'model': model, 'input': batch}).encode('utf-8')

            req = urllib.request.Request(
                embed_url,
                data=payload,
                headers={
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method='POST',
            )

            t0 = time.perf_counter()
            try:
                with urllib.request.urlopen(req, timeout=self.timeout_seconds) as resp:
                    status = resp.status
                    raw_body = resp.read().decode('utf-8')
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8', errors='replace')
                raise RuntimeError(
                    f'Ollama API returned HTTP {e.code} for model {model!r}: {err_body}'
                ) from e
            except urllib.error.URLError as e:
                raise ConnectionError(
                    f'Failed to connect to loopback Ollama endpoint {embed_url}: {e.reason}'
                ) from e

            elapsed_ms = (time.perf_counter() - t0) * 1000.0
            total_latency_ms += elapsed_ms

            if status != 200:
                raise RuntimeError(f'Ollama API unexpected status {status}: {raw_body}')

            try:
                parsed = json.loads(raw_body)
            except json.JSONDecodeError as e:
                raise ValueError(f'Ollama returned invalid JSON: {e}') from e

            batch_vectors = self.parse_embed_response(parsed, len(batch))

            if batch_vectors:
                batch_dim = len(batch_vectors[0])
                if expected_dim is None:
                    expected_dim = batch_dim
                elif batch_dim != expected_dim:
                    raise ValueError(
                        f'Batch dimension drift: expected {expected_dim}, got {batch_dim}'
                    )

            all_embeddings.extend(batch_vectors)

        return all_embeddings, total_latency_ms
