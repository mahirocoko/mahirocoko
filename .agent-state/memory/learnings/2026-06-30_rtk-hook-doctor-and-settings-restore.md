# Learning: RTK hook doctor and missing settings hooks

**Date**: 2026-06-30
**Tags**: letta-code, rtk, hooks, settings, guardrails, doctor

## Lesson

When RTK appears unused across an entire Letta Code session, do not assume RTK itself broke. Check the hook registration layer first.

The high-signal failure pattern from this session:

- `rtk` binary exists and reports a version.
- `~/.letta/hooks/rtk-letta-rewrite.py` still exists.
- `~/.letta/hooks/rtk-letta-rewrite.log` has no new entries after a clear cutoff time.
- `~/.letta/settings.json` is missing top-level `hooks` entirely.

That means Letta never called the hook. The problem is settings wiring, not rewrite logic.

## Recovery checklist

1. Inspect current settings:

   ```bash
   python3 - <<'PY'
   import json
   from pathlib import Path
   data = json.loads((Path.home() / '.letta/settings.json').read_text())
   print(json.dumps(data.get('hooks'), indent=2, ensure_ascii=False))
   PY
   ```

2. If hooks are missing, restore PreToolUse entries for:

   - `python3 ~/.letta/hooks/block-secret-reads.py`
   - `RTK_LETTA_HOOK_DEBUG=1 python3 ~/.letta/hooks/rtk-letta-rewrite.py`
   - `python3 ~/.letta/hooks/block-letta-commit-attribution.py`

3. Create a timestamped backup before editing `~/.letta/settings.json`.

4. Ask the user to `/reload` or restart Letta Code after editing settings.

5. Smoke-test the adapter directly:

   ```bash
   python3 ~/.letta/hooks/rtk-letta-rewrite.py <<'JSON'
   {"tool_name":"exec_command","tool_input":{"cmd":"git status --short && pnpm check"}}
   JSON
   ```

   Expected output contains an updated command beginning with `rtk git status --short`.

## New local utility

I added:

```bash
~/.letta/hooks/doctor-hooks.py
```

Useful commands:

```bash
python3 ~/.letta/hooks/doctor-hooks.py
python3 ~/.letta/hooks/doctor-hooks.py --smoke
python3 ~/.letta/hooks/doctor-hooks.py --json
```

The doctor checks settings parseability, top-level `hooks`, PreToolUse entries, script existence, registration/matchers, RTK binary/version, rewrite log presence, and optional direct RTK rewrite smoke.

## Future behavior

If Mahiro says “RTK didn’t run today,” immediately run:

```bash
python3 ~/.letta/hooks/doctor-hooks.py --smoke
```

Then report whether the issue is registration, missing script, missing RTK binary, or adapter smoke failure. Avoid dumping huge settings files unless the doctor output is insufficient.
