export const printBrandSkillHelp = () => {
  console.log(`brand-skill

Usage:
  bun cli/main.ts <mode> --brand <name> [sources...] [options]

Modes:
  inspect
  generate
  refresh
  reconcile

Sources:
  --website <url>
  --website-role <brand-truth|live-product|mood-reference|supporting-reference>
  --docs <path>
  --docs-role <brand-truth|live-product|mood-reference|supporting-reference>
  --screenshots <path>
  --screenshots-role <brand-truth|live-product|mood-reference|supporting-reference>
  --code <path>
  --code-role <brand-truth|live-product|mood-reference|supporting-reference>
  --figma <url>
  --figma-role <brand-truth|live-product|mood-reference|supporting-reference>

Options:
  --brand <name>         Brand name for this run
  --brief <text>         Short product or brand brief for intake preflight
  --write-brief-doc      Convert --brief into a temporary brand doc before execution
  --dest <path>          Output directory (default: .agents/skills/<brand-slug>)
  --json                 Print JSON instead of text
  --dry-run              Skip side effects and print the execution plan
  --help                 Show this help

Examples:
  bun cli/main.ts inspect \\
    --brand "Acme" \\
    --website https://acme.com \\
    --website-role live-product \\
    --screenshots ./captures

  bun cli/main.ts inspect \\
    --brand "Acme" \\
    --website https://acme.com \\
    --website-role brand-truth \\
    --docs ./brand

  bun cli/main.ts generate \\
    --brand "Acme" \\
    --brief "Personal finance app with a white-and-blue visual system" \\
    --write-brief-doc \\
    --screenshots ./captures \\
    --dest .agents/skills/acme-brand

  bun cli/main.ts refresh \\
    --brand "Acme" \\
    --website https://acme.com \\
    --docs ./brand \\
    --screenshots ./captures \\
    --code ./app

Notes:
  - V2 adds intake preflight and reports the next clarifying question when source posture is incomplete
  - Websites should be classified before execution, especially when they are mood references
  - Mood-reference websites are excluded from engine execution in v2 to avoid lexical drift
`)
}
