> **Purpose:** Durable lesson for translating opencode command markdown into Letta Code skills safely.
> **Last-Updated:** 2026-05-14

# Learning: opencode command to Letta skill migration

**Tags:** letta-code, opencode, commands, skills, git-commit, workflow-migration

## Context

Mahiro asked whether Letta supports command-style workflows and wanted the opencode `git-commit` command copied over if supported. The source command lived at `~/.config/opencode/command/git-commit.md`. Letta Code did not show direct support for reading that opencode command directory; reusable command-like behavior should be represented as a Letta skill under `~/.letta/skills/<skill-name>/SKILL.md`.

## Durable Lesson

When migrating an opencode command into Letta Code, do not blindly copy the command markdown. Translate it into a skill with proper `name` and `description` frontmatter, preserve trigger language, and adapt unsafe or runtime-specific behavior to Letta's policies.

For git commit commands specifically, opencode may use `git add -A` and custom rules such as “no AI attribution.” Letta Code must instead follow the active git safety protocol: commit only when explicitly requested, inspect status/diff/log first, stage relevant files by explicit path when possible, avoid secrets/generated artifacts, do not amend unless asked, and follow the current system's required attribution policy.

## Checklist

1. Find the exact opencode command file, usually under `~/.config/opencode/command/` or `~/.config/opencode/commands/`.
2. Read the source command and identify intent, trigger phrases, required context, and risky steps.
3. Create or update `~/.letta/skills/<name>/SKILL.md`.
4. Write frontmatter:
   - `name` must match the folder.
   - `description` must include trigger phrases such as `/git-commit`, `git-commit`, or `cmt` when relevant.
5. Keep the skill concise and procedural.
6. Replace runtime-specific or unsafe instructions with Letta-compatible guardrails.
7. Tell Mahiro if a fresh Letta session is needed for the skill list to refresh.

## Applied Example

Migrated:

- Source: `~/.config/opencode/command/git-commit.md`
- Destination: `~/.letta/skills/git-commit/SKILL.md`

Key adaptations:

- Preserved commit type+emoji style.
- Added trigger phrases for `/git-commit`, `git-commit`, and `cmt`.
- Replaced default `git add -A` with explicit-path staging preference.
- Added secret/generated-file checks.
- Kept commit optional and human-request-only.
