# MCP adapters must invoke, not merely advertise

Tags: `mcp`, `browser-control`, `capability`, `security`, `privacy`, `proxy`, `cli`

## Decision rule

Do not build an MCP server solely to announce that a CLI exists.

- If agents only need command documentation, use a skill or project docs.
- Build MCP when agents need lazy machine-readable discovery, typed arguments, permission-gated invocation, and structured results across projects.

## Correct ownership stack

```text
domain protocol + bridge = capability source of truth
CLI                     = human/shell adapter
MCP server              = structured agent invocation adapter
MCP Proxy               = lazy metadata cache + live permission gate
```

The MCP server should call a shared client directly. It should not shell out to the CLI and should not duplicate protocol, browser, domain-adapter, or consequential-approval logic.

## Narrow surface first

For Browser Control, one `browser_control_read` tool was enough:

- status
- controlled-tab identity
- page state
- bounded visible text
- visible screenshot with declared focus/artifact side effect
- allow-listed rendered-DOM adapter state

Do not expose unrelated-tab listing, generic command passthrough, claim/open/navigation, selectors/click/fill/eval, or mutating adapter actions without separate evidence and approval contracts.

## “Read-only” still needs threat analysis

Observational capabilities may leak or mutate local state:

- tab titles/URLs can contain private queries, fragments, OAuth callbacks, or signed links
- screenshots can contain authenticated content and create persistent local artifacts
- visible capture may focus or interrupt the foreground window
- error messages can echo secrets unless explicitly redacted

Treat privacy scope and local/visible side effects as first-class tool semantics.

## Inherited-boundary audit

When adding a new façade, audit every lower-level safety claim it depends on. A required `targetUrl` is not a real assertion if the lower layer uses raw string-prefix matching.

Robust URL evidence matching should require:

- parsed http(s) URLs without userinfo
- exact normalized origin
- exact path or segment-boundary prefix
- every target query pair present in the actual URL
- exact hash when the target specifies one

Test lookalike origins, userinfo URLs, partial path confusion, mismatched queries, and hashes. Then prove at least one hostile target in the native runtime after rebuilding/reloading the extension.

## Evidence from 2026-07-16

- MCP Proxy cached one Browser Control tool and no token.
- Status, controlled tab, page state, bounded text, and screenshot succeeded natively.
- Unclaimed-tab state failed closed.
- Lookalike-origin and partial-path assertions failed closed.
- Format/check/typecheck/build, 46 tests, and independent no-medium review passed.

