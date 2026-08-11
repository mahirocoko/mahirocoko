# Visual lock contract

Use this contract only after Mahiro accepts a visual candidate. It records identity and ownership; it must not restate the design in the main agent's aesthetic language.

## Minimal artifact

```yaml
version: 1
job:
  id: <stable-slug>
  target: <repo-relative-path>
  scope: <exact-human-approved-scope>

authority:
  kind: code-and-renders | raster-only
  git_ref: <commit-or-null>
  source_files:
    - path: <authoritative-source-path>
      sha256: <hash>
  raw_references:
    - path: <raw-reference-path>
      sha256: <hash>
  rejected_sources: []

human_gate:
  status: pending | accepted | rejected
  owner: Mahiro
  evidence_ref: <conversation-or-artifact-reference>
  accepted_at: <timestamp-or-null>

roles:
  visual_owner: <selected-model-or-human>
  production_owner: <selected-model-or-human>
  coordinator: <main-agent>
  separation: required | human-waived
  waiver_evidence_ref: <human-reference-or-null>

capture_contract:
  browser: <browser-and-version>
  font_ready: true
  media_ready: true
  reduced_motion: <reduce-or-no-preference>
  data_fixture: <stable-state-reference>
  viewports:
    - name: desktop
      width: 1440
      height: 900
    - name: mobile
      width: 390
      height: 844

accepted_renders:
  - name: <viewport-and-state>
    path: <repo-or-evidence-path>
    sha256: <hash>
    full_page: true
    state: <stable-runtime-state>

protected_contracts:
  source_paths: []
  visual_files: []
  copy_owners: []
  asset_hashes: []
  fonts: []
  layout_states: []

production_scope:
  allowed: []
  forbidden: []

verification:
  baseline_repeat_variance: <measurement-or-pending>
  full_page_diff: <measurement-or-pending>
  state_diffs: []
  functional_checks: []
  residual_differences: []
  human_final_gate: pending | accepted | rejected
```

## Contract rules

- Prefer a Git ref for committed source; otherwise hash every authoritative source file.
- Bind each raw reference and accepted render to its own path and SHA-256. Filenames or a generic aggregate hash do not prove identity.
- Record rejected candidates so they cannot silently become authority later.
- Keep human acceptance `pending` until Mahiro explicitly accepts. Agents cannot infer it from silence or technical success.
- Require distinct visual and production owners. The same actor may hold both roles only when Mahiro explicitly waives separation after the direction is locked; record that evidence and do not describe the result as validation of the K3-to-Sol role split.
- List allowed production edits narrowly. “Improve/polish/modernize” is not an allowed scope.
- Put visible copy under protection when the visual owner authored copy fit as part of the accepted composition.
- Record each required interaction state separately; a default-state screenshot does not lock the whole component.
- Measure baseline repeated-capture variance before interpreting a tiny production diff.
- A changed render may be accepted only by Mahiro; never rewrite the baseline to make verification pass.

## Authority order

Use the order Mahiro explicitly selects. Without another instruction, prefer:

1. accepted source code plus accepted renders
2. accepted renders tied to source hashes
3. raw raster reference after a successful direct vision preflight
4. prose only for technical scope, never as a substitute for visual authority

If two authoritative images or source/render states conflict, stop for Mahiro's selection.
