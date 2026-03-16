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
  --docs <path>
  --screenshots <path>
  --code <path>
  --figma <url>

Options:
  --brand <name>         Brand name for this run
  --dest <path>          Output directory (default: .agents/skills/<brand-slug>)
  --json                 Print JSON instead of text
  --dry-run              Skip side effects and print the execution plan
  --help                 Show this help

Examples:
  bun cli/main.ts inspect \\
    --brand "Acme" \\
    --website https://acme.com \\
    --docs ./brand

  bun cli/main.ts generate \\
    --brand "Acme" \\
    --website https://acme.com \\
    --docs ./brand \\
    --screenshots ./captures \\
    --dest .agents/skills/acme-brand
`)
}
