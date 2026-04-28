# frontend-design scripts

Local script entrypoint for the `frontend-design` skill.

## Usage

```bash
bun scripts/main.ts list
bun scripts/main.ts search hero
bun scripts/main.ts compose --general hero
bun scripts/main.ts compose --general hero --direction animate --prompt css-border-gradient
bun scripts/main.ts brief --general hero --reference resources/reference-excerpts/velorah-anatomy.md
bun scripts/validate-frontend-design.ts
```

## Notes

- Reads only bundled assets from `resources/prompt-assets/`
- Keeps composition order deterministic and visible in stdout
- Supports one optional workspace-local or skill-local `--handoff` file
- Supports workspace-local or skill-local `--reference` files in `brief` mode for design anatomy evidence
- Treats `resources/reference-excerpts/*` as bundled non-canonical evidence only
- Treats external prompt corpora as reference corpus only; borrow anatomy/specificity, not aesthetics
- Does not write `.agent-state`, fetch remote content, or mutate prompt assets
- Keeps design judgment out of the script; use `../resources/brief-workflow.md` for reference synthesis rules
- Validation fixtures live at `../fixtures/frontend-design.json`
