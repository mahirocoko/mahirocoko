#!/usr/bin/env bun

import { existsSync, readFileSync, statSync } from "node:fs"
import { isAbsolute, join, relative, resolve } from "node:path"

type ValidationCase = {
  id: string
  args: string[]
  requiredFiles?: string[]
  expectExitCode: number
  expectContains: string[]
  expectInOrder: string[]
  rejectContains: string[]
}

const SKILL_ROOT = resolve(import.meta.dir, "..")
const WORKSPACE_ROOT = resolve(SKILL_ROOT, "..", "..", "..")
const FIXTURE_PATH = join(SKILL_ROOT, "fixtures", "frontend-design.json")
const FRONTEND_DESIGN_SCRIPT = join(SKILL_ROOT, "scripts", "main.ts")

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
}

function ensureSkillLocalPath(pathValue: string, label: string): string {
  const resolvedPath = isAbsolute(pathValue) ? pathValue : resolve(SKILL_ROOT, pathValue)
  const relativePath = relative(SKILL_ROOT, resolvedPath)

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`${label} must stay inside the skill: ${pathValue}`)
  }

  return resolvedPath
}

function readJsonFile(path: string): unknown {
  if (!existsSync(path)) {
    throw new Error(`JSON file not found: ${path}`)
  }

  return JSON.parse(readFileSync(path, "utf8")) as unknown
}

function validateCases(value: unknown): ValidationCase[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${FIXTURE_PATH} to contain a JSON array.`)
  }

  const seenIds = new Set<string>()

  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`Expected fixture entry ${index} to be an object.`)
    }

    const { id, args, requiredFiles, expectExitCode, expectContains, expectInOrder, rejectContains } = entry

    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error(`Expected fixture entry ${index} to have a non-empty id.`)
    }

    if (seenIds.has(id)) {
      throw new Error(`Duplicate fixture id '${id}'.`)
    }

    if (!isStringArray(args) || args.length === 0) {
      throw new Error(`Expected fixture '${id}' to provide a non-empty args array.`)
    }

    if (requiredFiles !== undefined && !isStringArray(requiredFiles)) {
      throw new Error(`Expected fixture '${id}' requiredFiles to be a string array.`)
    }

    if (typeof expectExitCode !== "number") {
      throw new Error(`Expected fixture '${id}' to provide a numeric expectExitCode.`)
    }

    if (!isStringArray(expectContains)) {
      throw new Error(`Expected fixture '${id}' expectContains to be a string array.`)
    }

    if (!isStringArray(expectInOrder)) {
      throw new Error(`Expected fixture '${id}' expectInOrder to be a string array.`)
    }

    if (!isStringArray(rejectContains)) {
      throw new Error(`Expected fixture '${id}' rejectContains to be a string array.`)
    }

    seenIds.add(id)

    return {
      id,
      args,
      requiredFiles,
      expectExitCode,
      expectContains,
      expectInOrder,
      rejectContains,
    }
  })
}

function assertFileExists(pathValue: string, label: string): void {
  const resolvedPath = ensureSkillLocalPath(pathValue, label)

  if (!existsSync(resolvedPath)) {
    throw new Error(`${label} not found: ${pathValue}`)
  }

  if (!statSync(resolvedPath).isFile()) {
    throw new Error(`${label} must be a file: ${pathValue}`)
  }
}

function assertContainsAll(output: string, expected: string[], caseId: string): void {
  for (const snippet of expected) {
    if (!output.includes(snippet)) {
      throw new Error(`[${caseId}] Missing expected output snippet: ${snippet}`)
    }
  }
}

function assertRejects(output: string, rejected: string[], caseId: string): void {
  for (const snippet of rejected) {
    if (output.includes(snippet)) {
      throw new Error(`[${caseId}] Found rejected output snippet: ${snippet}`)
    }
  }
}

function assertInOrder(output: string, orderedSnippets: string[], caseId: string): void {
  let lastIndex = -1

  for (const snippet of orderedSnippets) {
    const nextIndex = output.indexOf(snippet, lastIndex + 1)
    if (nextIndex === -1) {
      throw new Error(`[${caseId}] Ordered snippet not found: ${snippet}`)
    }

    if (nextIndex < lastIndex) {
      throw new Error(`[${caseId}] Ordered snippet appeared out of order: ${snippet}`)
    }

    lastIndex = nextIndex
  }
}

function runCase(validationCase: ValidationCase): void {
  for (const requiredFile of validationCase.requiredFiles ?? []) {
    assertFileExists(requiredFile, `Fixture file for ${validationCase.id}`)
  }

  const command = ["bun", FRONTEND_DESIGN_SCRIPT, ...validationCase.args]
  const result = Bun.spawnSync(command, {
    cwd: WORKSPACE_ROOT,
    stdout: "pipe",
    stderr: "pipe",
    env: process.env,
  })

  const stdout = new TextDecoder().decode(result.stdout)
  const stderr = new TextDecoder().decode(result.stderr)
  const output = [stdout.trimEnd(), stderr.trimEnd()].filter(Boolean).join("\n")

  if (result.exitCode !== validationCase.expectExitCode) {
    throw new Error(
      `[${validationCase.id}] Expected exit code ${validationCase.expectExitCode} but received ${result.exitCode}.`,
    )
  }

  assertContainsAll(output, validationCase.expectContains, validationCase.id)
  assertRejects(output, validationCase.rejectContains, validationCase.id)
  assertInOrder(output, validationCase.expectInOrder, validationCase.id)

  console.log(`- PASS ${validationCase.id}`)
}

function main(): void {
  assertFileExists(FIXTURE_PATH, "Fixture manifest")
  assertFileExists(FRONTEND_DESIGN_SCRIPT, "frontend-design script")

  const validationCases = validateCases(readJsonFile(FIXTURE_PATH))

  console.log("# validate-frontend-design")
  console.log("")
  console.log(`Skill root: ${SKILL_ROOT}`)
  console.log(`Workspace root: ${WORKSPACE_ROOT}`)
  console.log(`Cases: ${validationCases.length}`)
  console.log("")

  for (const validationCase of validationCases) {
    runCase(validationCase)
  }

  console.log("")
  console.log(`Validated ${validationCases.length} frontend-design cases.`)
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
