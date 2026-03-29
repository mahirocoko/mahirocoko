# Learning: For /watch, validate transcript presence and fallback to captions early

In a `/watch` workflow, a successful Gemini request is not the same as a successful transcript capture. The robust path is:

1. Canonicalize the YouTube URL (strip playlist noise when the target is a single video).
2. Dispatch to Gemini and capture conversation URL for traceability.
3. Explicitly validate transcript-body presence in the response payload or tab text.
4. If transcript is missing, immediately fallback to YouTube captions.
5. Produce the requested language summary from captions and mark the fallback source clearly.

This pattern prevents false positives where the system reports "done" after chat dispatch but does not actually return the transcript text. It also improves user trust: the output remains useful even when Gemini returns partial context cards.

Operationally, intermediate artifacts (like `.srt`) should be treated as optional and disposable, while the final durable note should keep source provenance and stable links. If a user asks to delete intermediates, references in all dependent files must be updated in the same step to avoid stale memory pointers.

Key takeaway: in learning pipelines, reliability comes from explicit validation and deterministic fallback, not from assuming external model output completeness.
