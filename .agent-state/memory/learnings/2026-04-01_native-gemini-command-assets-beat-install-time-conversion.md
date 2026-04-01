# Learning: native Gemini command assets beat install-time conversion

**Date**: 2026-04-01
**Tags**: mahiro-skills, gemini, installer, commands, release, architecture

## Context

While extending `mahiro-skills` to support Gemini custom commands, the core design question was whether to keep markdown command sources and convert them to TOML during install, or to model Gemini as a native command artifact lane.

## What Happened

After checking the official Gemini CLI docs and the current `mahiro-skills` planner/install architecture, I chose native Gemini assets under `commands-gemini/*.toml` instead of md→toml conversion. The implementation stayed small: add an adapter-specific command artifact resolver, teach planning/install/doctor about the Gemini lane, and keep the non-Gemini markdown behavior unchanged. The main cleanup after implementation was not algorithmic. It was contract cleanup: fallback prompt paths and bundle wording had to be updated so the docs and installed command text matched the new Gemini-native behavior.

## Lesson

When a target platform has a real first-class artifact contract, it is usually better to store and install that native artifact directly than to translate from a different authoring format during install. Conversion looks flexible, but it moves ambiguity into the installer and makes docs, tests, and runtime language easier to drift out of sync. A narrow native lane is often the more maintainable choice.

## Why It Matters

This keeps `mahiro-skills` honest. Gemini now installs real `.toml` commands into `.gemini/commands/`, receipts and doctor checks reflect reality, and future maintainers can reason about the behavior from the repo layout itself instead of reverse-engineering a transformation step.

## Reuse

- Prefer adapter-native artifacts when an external tool defines a real install contract.
- Use conversion only when the source format is truly canonical and the transform is deterministic and low-risk.
- After changing an artifact model, review not only code and tests but also bundle descriptions, README language, and fallback prompt text.
