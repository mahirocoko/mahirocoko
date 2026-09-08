Complete the persistent lease queue in `src/persistent-lease-queue.js`.

Required behavior:
- `PersistentLeaseQueue.open(filePath, { clock = Date.now, leaseMs = 30000 } = {})` loads existing JSON state or creates an empty version-1 state when the file is absent. Reject malformed or unsupported persisted state without overwriting it.
- `enqueue({ id, payload })` requires a non-empty string ID. IDs are permanently unique, including after acknowledgement. Duplicate IDs throw `DuplicateIdError` without mutating disk.
- `claim(owner)` requires a non-empty owner. Before selecting work, expire every claim whose `leaseUntil <= clock()`. Claim the oldest queued item, increment its attempt, and return `{ id, payload, attempt, leaseUntil }`; return `null` if none exists.
- `ack(owner, id)` succeeds only for a currently claimed, unexpired item owned by `owner`, marks it done, persists, and returns `true`. Otherwise return `false`; expiry reconciliation must still persist.
- `fail(owner, id)` has the same ownership/expiry checks, but returns a valid claim to queued state and returns `true`; otherwise return `false`.
- Every successful mutation and every expiry reconciliation is persisted before the method resolves.
- Persist atomically with a same-directory temporary file followed by rename. Clean up an owned temporary file after a failed write.
- Serialize concurrent method calls within one queue instance so two simultaneous claims cannot acquire the same item.
- `snapshot()` returns a detached copy of the current state.

Constraints:
- Use only Node.js built-ins.
- Modify only `src/persistent-lease-queue.js`.
- Do not modify tests or package metadata.
- Run the public tests and report the result truthfully.
