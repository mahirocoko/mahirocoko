# Lesson Learned: direct-cli Gemini must stay interactive

Tags: `direct-cli`, `gemini`, `tmux`, `workflow-provenance`, `skill-source`

When using the `direct-cli` skill with Gemini, never recover by switching to `gemini -p` or `gemini --prompt`. The skill's pane-first model is part of the user-visible contract, not just an implementation preference. If Gemini stalls, the safe sequence is: inspect tmux pane, send `C-c` if needed, submit a shorter follow-up in the same interactive pane, or start a fresh interactive tmux lane with `gemini -m "gemini-3.1-pro-preview" --approval-mode yolo -i "..."`.

If the user explicitly says Gemini should do the work, provenance matters. The main agent should not author the artifact and should not silently extract or reconstruct partial output unless the user approves that fallback. For skill maintenance, edit the canonical `mahiro-skills` repository first; installed copies under `.config/opencode/skills` may not be symlinks and can drift from source.
