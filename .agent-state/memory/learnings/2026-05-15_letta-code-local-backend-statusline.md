# Lesson: Letta Code local backend and statusline boundaries

**Date**: 2026-05-15  
**Tags**: letta-code, local-backend, privacy, statusline, mahiro-workflow

## Durable takeaway

For Letta Code, do not collapse `--backend local` into “nothing goes to cloud.” The accurate distinction is:

- `--backend local` swaps `APIBackend` for `LocalBackend`, so agent/conversation/message/run/local MemFS state is local.
- Model traffic follows the configured provider; cloud providers still receive prompts, local providers do not.
- Telemetry is separate and enabled by default unless `LETTA_CODE_TELEM=0` is set.

When Mahiro says model provider traffic is acceptable, focus the answer on Letta backend state and optionally mention telemetry as the remaining Letta Cloud path.

## Statusline note

Current Letta Code statusline payload exposes the active conversation id as `session_id`, not `conversation_id`. A local statusline script can display it today. Conversation title/name is not currently available in the payload without modifying Letta Code.

Mahiro asked to add conversation display without modifying Letta Code, then clarified folder should remain visible. The resulting user-level script lives at:

- `/Users/mahiro/.letta/statusline-conversation.js`

It is configured globally through `/Users/mahiro/.letta/settings.json` and displays agent, conversation/session id, model, folder, and context percentage.

## Process lesson

When enhancing statusline or similar ergonomic UI, preserve existing useful context by default. Adding one requested field should not accidentally remove folder/project awareness unless the user asks for a simpler line.
