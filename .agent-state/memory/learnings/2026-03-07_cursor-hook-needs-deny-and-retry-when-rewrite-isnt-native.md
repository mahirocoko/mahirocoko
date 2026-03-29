# Cursor Hook Needs Deny-And-Retry When Rewrite Isn't Native

When porting a command-rewrite pattern from one AI tool to another, the reusable part is usually the rewrite logic itself, not the hook protocol. In this session the Claude-side RTK integration was a strong reference, but Cursor did not expose the same transparent `updatedInput` style rewrite surface. The stable adaptation was to keep `rtk rewrite` as the decision engine and wrap it in a Cursor-specific `beforeShellExecution` hook that denies the original command and instructs the agent to retry with the exact RTK-prefixed version.

This matters because it prevents a false sense of compatibility. A hook that looks structurally similar can still have a different contract for stdin shape, response fields, and mutation powers. The right engineering move is to preserve the core logic and rebind it to the host tool’s actual control surface, even if the result is slightly less elegant.

Pattern:

- Reuse the transformation engine.
- Rebuild the event wrapper for the host platform.
- Prefer a conservative fallback like deny-and-retry over pretending silent rewrite exists.
- Verify against sample payloads before trusting the integration.
