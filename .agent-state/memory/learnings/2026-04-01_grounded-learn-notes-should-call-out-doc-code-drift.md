# Grounded learn notes should call out doc-code drift

## Tags

- learn
- grounding
- documentation
- source-of-truth
- external-repo

## Lesson

When a `/learn --deep` pass produces a clean synthesis, the most durable value often comes from the grounding pass, not the delegated exploration itself. In this session, the subagents correctly mapped the architecture and rendering pipeline of `kubarskii/text-3d-engine`, but the most important user-facing insight appeared only after checking the repo’s primary files directly: the README advertised a narrow character set while `models.js` implemented broader support, including lowercase English and Cyrillic. That discrepancy changed the quality of the final summary.

The practical rule is simple: if a learned repo is small enough to ground fully, always compare the public docs against the implementation before writing the durable note. When they differ, preserve the mismatch explicitly in the study bundle rather than smoothing it away. That turns the note from a paraphrase into a trustworthy local memory artifact.
