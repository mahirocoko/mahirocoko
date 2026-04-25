# Direct Cursor prompts need explicit output file scope

Tags: direct-cli, cursor, composer-2, frontend-design, lab03, prompt-scope

When using a direct Cursor lane to create an alternate design artifact, name the exact output file and explicitly protect the reference file. In the lab03 run, the safest prompt shape was: continue from the current worktree only, create `apps/design-prompts/lab03/composer-index.html`, use `prompt.txt` as primary truth, read the handoff and existing `index.html` only as references, and do not overwrite `index.html`.

This also clarified when not to run the `frontend-design compose` command. The lab03 README exposes a compose path, but the requested deliverable was one plain HTML file with embedded CSS. The standalone prompt and handoff matched that better than the composed baseline, which can imply a different output contract. Direct lanes should preserve that distinction in the prompt instead of blindly invoking every related tool.

Practical reminder: verify the pane and then verify git status. In dirty worktrees, distinguish files the lane actually changed from pre-existing modified files before reporting back.
