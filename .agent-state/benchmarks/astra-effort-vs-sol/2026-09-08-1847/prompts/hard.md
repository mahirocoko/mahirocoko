Finish the v1-to-v2 result-envelope migration across `src/` while preserving persisted and live compatibility.

Canonical v2 envelope:
```js
{
  schemaVersion: 2,
  requestId: 'non-empty',
  outcome: { status: 'ok', data: any }
    // or { status: 'error', error: { code: 'non-empty', message: 'non-empty' } },
  transport: {
    attempt: 1,                 // positive integer
    receivedAt: null            // null or non-empty string
    // optional lease: { owner: 'non-empty', until: finite number }
  }
}
```

Compatibility inputs:
- Legacy success: `{ requestId, ok: true, data }`
- Legacy failure: `{ requestId, ok: false, error: { code, message } }`
- A long-lived transport may wrap either legacy or v2 input as `{ payload, attempt?, receivedAt?, lease? }`. Wrapper metadata overrides payload transport metadata only when supplied.

Required behavior:
- `normalizeEnvelope(input)` accepts direct v1, direct v2, or one transport wrapper and returns a fresh canonical v2 object without mutating input. Validate every contract above and throw `EnvelopeValidationError` for invalid data.
- Legacy/direct inputs default to `attempt: 1` and `receivedAt: null`. Preserve a valid optional lease. Ignore unrelated unknown fields.
- `dispatch(requestId, handler, metadata)` awaits the handler and returns canonical success. Handler failures must become canonical error outcomes, using a non-empty string `error.code` when present or `HANDLER_ERROR`, and a non-empty message or `Unknown handler error`.
- `consume(input)` must normalize first, then return `{ ok: true, value }` or `{ ok: false, error }` from the nested canonical outcome. A stray top-level `ok` on v2 input must not override `outcome.status`.
- `ResultStore.open(filePath)` loads version-1 JSON state or creates an empty store when absent. Malformed state must fail without being overwritten.
- `ResultStore.record(input)` normalizes input. First write wins by `requestId`; an exact canonical duplicate returns `{ inserted: false, envelope }`, while a conflicting duplicate throws `ResultConflictError`. New records persist atomically through a same-directory temporary file and rename, returning `{ inserted: true, envelope }`.
- `ResultStore.get(requestId)` returns a detached canonical envelope or `null`. Stored legacy records must be normalized on load.

Constraints:
- Use only Node.js built-ins.
- Modify only files under `src/`.
- Do not modify tests or package metadata.
- Run the public tests and report the result truthfully.
