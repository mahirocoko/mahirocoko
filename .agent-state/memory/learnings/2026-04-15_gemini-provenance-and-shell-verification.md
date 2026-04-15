# Learning Note

## Title
Gemini provenance needs explicit accounting, and shell execution still requires strict local verification

## Tags
- frontend
- gemini
- orchestration
- verification
- pulselane

## Context
During a Pulselane session, the user cared not just about the final frontend outcome but about whether Gemini was actually the primary execution path. MCP-backed Gemini worker calls failed repeatedly with provider/runtime issues, while shell Gemini was usable but noisy and only partially trustworthy from its own self-report.

## Lesson
When a user cares about model provenance, I need to separate three things very clearly: who planned the change, who executed the change, and who verified the change. “Delegated” is too fuzzy if the user is explicitly tracking whether Gemini actually wrote the code. If MCP-based Gemini execution is unstable, I should say so directly, try the shell Gemini path explicitly, and treat any large shell-Gemini diff as untrusted until I read the changed files and rerun local checks myself.

## Why it matters
This avoids two forms of trust erosion: process ambiguity (“did Gemini really do this?”) and correctness overclaim (“the worker said it finished, so it must be good”). In this session, the safe pattern was: inspect runtime evidence, use shell Gemini where needed, audit the resulting files, and fix any regression or cleanup issue locally before claiming success.

## Reuse rule
For future frontend work where the human specifies Gemini as the primary worker:
1. Treat Gemini routing as a hard constraint.
2. Prefer the working runtime path, not the nominally preferred one.
3. Record provenance precisely: plan vs execute vs verify.
4. Never trust a shell-agent summary without direct file review and local checks.
