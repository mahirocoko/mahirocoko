#!/usr/bin/env bun
import { $ } from "bun"

const args = process.argv.slice(2)

const result = await $`bun .agents/skills/brand-skill-generator/cli/main.ts ${args}`.quiet()

if (result.stdout.length > 0) {
  process.stdout.write(result.stdout)
}

if (result.stderr.length > 0) {
  process.stderr.write(result.stderr)
}

process.exit(result.exitCode)
