# ai-pixel-snapped-game-sprites learning note

Learned via `/learn --deep https://github.com/chongdashu/ai-pixel-snapped-game-sprites`.

Key takeaways for future sprite work:
- AI pixel art should be treated as raw material; make it runtime-safe through deterministic snap/recovery/normalization.
- Prompt discipline matters upstream: simple low-fidelity silhouettes, exact chroma background, and native-grid recoverability beat decorative detail.
- Avoid fixed-grid cropping when generated sheets/cells drift. Use foreground-component recovery, merge intentional effect components, and normalize each recovered frame.
- Runtime assets should ship with a machine-readable manifest beside the sheet/preview: dimensions, frame count, FPS, cell size, and anchor/foot-baseline metadata.
- QA can be partly automated: validate sheet dimensions, frame counts, manifest consistency, alpha/chroma cleanup, and baseline stability.

Docs: `.agent-state/learn/chongdashu/ai-pixel-snapped-game-sprites/repo.md`.
