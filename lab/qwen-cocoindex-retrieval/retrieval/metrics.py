"""Cosine similarity, ranking, and IR retrieval metrics."""

import math
from typing import Any, Dict, List, Set, Tuple


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute cosine similarity between two float vectors fail-closed."""
    if len(vec1) != len(vec2):
        raise ValueError(f'Dimension mismatch: {len(vec1)} vs {len(vec2)}')
    if not vec1:
        raise ValueError('Cannot compute cosine similarity of empty vectors')

    dot = 0.0
    norm1_sq = 0.0
    norm2_sq = 0.0

    for a, b in zip(vec1, vec2):
        if not math.isfinite(a) or not math.isfinite(b):
            raise ValueError('Vector contains non-finite values (NaN/Inf)')
        dot += a * b
        norm1_sq += a * a
        norm2_sq += b * b

    if norm1_sq <= 0.0 or norm2_sq <= 0.0:
        raise ValueError('Vector has zero magnitude; cannot compute cosine similarity')

    norm1 = math.sqrt(norm1_sq)
    norm2 = math.sqrt(norm2_sq)
    sim = dot / (norm1 * norm2)

    return max(-1.0, min(1.0, sim))


def rank_documents(
    query_vec: List[float],
    doc_vectors: Dict[str, List[float]],
) -> List[Tuple[str, float]]:
    """Rank documents by cosine similarity with deterministic tie-breaking (-similarity, doc_id)."""
    scored: List[Tuple[str, float]] = []
    for doc_id, doc_vec in doc_vectors.items():
        score = cosine_similarity(query_vec, doc_vec)
        scored.append((doc_id, score))

    # Tie-break: highest score first, then doc_id alphabetically
    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored


def compute_query_retrieval_metrics(
    ranked_docs: List[Tuple[str, float]],
    relevant_doc_ids: List[str],
    top_k: int = 10,
) -> Dict[str, Any]:
    """Compute Hit/Recall@1, @3, @5, MRR@10, and binary nDCG@10."""
    if not relevant_doc_ids:
        raise ValueError('relevant_doc_ids must not be empty')

    relevant_set: Set[str] = set(relevant_doc_ids)
    rankings: List[Dict[str, Any]] = []

    for rank, (doc_id, score) in enumerate(ranked_docs[:top_k], start=1):
        rankings.append({
            'rank': rank,
            'doc_id': doc_id,
            'score': round(score, 6),
            'is_relevant': doc_id in relevant_set,
        })

    # Hit@k asks whether any relevant document appears; Recall@k measures the
    # fraction of all labeled relevant documents retrieved within k.
    hit_1 = 1.0 if any(r['is_relevant'] for r in rankings[:1]) else 0.0
    hit_3 = 1.0 if any(r['is_relevant'] for r in rankings[:3]) else 0.0
    hit_5 = 1.0 if any(r['is_relevant'] for r in rankings[:5]) else 0.0
    recall_1 = len({r['doc_id'] for r in rankings[:1]} & relevant_set) / len(relevant_set)
    recall_3 = len({r['doc_id'] for r in rankings[:3]} & relevant_set) / len(relevant_set)
    recall_5 = len({r['doc_id'] for r in rankings[:5]} & relevant_set) / len(relevant_set)

    # MRR@10 (reciprocal rank of the FIRST relevant document within top 10)
    first_rank: int | None = None
    for r in rankings:
        if r['is_relevant']:
            first_rank = r['rank']
            break

    mrr_10 = (1.0 / first_rank) if first_rank is not None else 0.0

    # Binary nDCG@10
    # DCG = sum_{i=1}^{10} rel_i / log2(i + 1)
    dcg = 0.0
    for r in rankings:
        if r['is_relevant']:
            dcg += 1.0 / math.log2(r['rank'] + 1)

    # Ideal DCG (IDCG) = sum_{i=1}^{min(10, |relevant|)} 1 / log2(i + 1)
    num_ideal = min(top_k, len(relevant_set))
    idcg = sum(1.0 / math.log2(i + 1) for i in range(1, num_ideal + 1))
    ndcg_10 = (dcg / idcg) if idcg > 0.0 else 0.0

    return {
        'hit@1': hit_1,
        'hit@3': hit_3,
        'hit@5': hit_5,
        'recall@1': round(recall_1, 6),
        'recall@3': round(recall_3, 6),
        'recall@5': round(recall_5, 6),
        'mrr@10': round(mrr_10, 6),
        'ndcg@10': round(ndcg_10, 6),
        'rankings': rankings,
    }


def aggregate_metrics(metrics_list: List[Dict[str, Any]]) -> Dict[str, float]:
    """Compute mean metrics across a list of query evaluation dictionaries."""
    if not metrics_list:
        return {
            'hit@1': 0.0,
            'hit@3': 0.0,
            'hit@5': 0.0,
            'recall@1': 0.0,
            'recall@3': 0.0,
            'recall@5': 0.0,
            'mrr@10': 0.0,
            'ndcg@10': 0.0,
            'count': 0.0,
        }

    n = len(metrics_list)
    return {
        'hit@1': round(sum(m['hit@1'] for m in metrics_list) / n, 4),
        'hit@3': round(sum(m['hit@3'] for m in metrics_list) / n, 4),
        'hit@5': round(sum(m['hit@5'] for m in metrics_list) / n, 4),
        'recall@1': round(sum(m['recall@1'] for m in metrics_list) / n, 4),
        'recall@3': round(sum(m['recall@3'] for m in metrics_list) / n, 4),
        'recall@5': round(sum(m['recall@5'] for m in metrics_list) / n, 4),
        'mrr@10': round(sum(m['mrr@10'] for m in metrics_list) / n, 4),
        'ndcg@10': round(sum(m['ndcg@10'] for m in metrics_list) / n, 4),
        'count': float(n),
    }
