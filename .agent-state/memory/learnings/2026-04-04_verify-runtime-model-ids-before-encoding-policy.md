# Verify runtime model IDs before encoding policy

**Date**: 2026-04-04
**Tags**: #cursor #models #routing #policy #orchestration

## Lesson

When a CLI exposes both marketing-facing model names and real runtime IDs, policy should be written against the runtime IDs, not the display labels.

## Why it mattered today

Cursor docs clearly described Composer, Sonnet, and Opus as product models, but that was not enough to safely set default worker behavior. The important step was asking the actual CLI (`agent --list-models`) which identifiers it accepts. That changed the discussion from vague labels like “Sonnet” and “Opus” into concrete values like `composer-2`, `claude-4.6-sonnet-medium`, and `claude-4.6-opus-high`.

Once those IDs were verified, the model policy became safe to encode: `composer-2` by default, Sonnet as the middle tier, and Opus for plan mode. Without that runtime check, the policy would have looked correct on paper while still being brittle or wrong in practice.

## Durable takeaway

For worker/model policy:

1. read the docs to understand the product-level model lineup
2. verify the actual runtime identifiers from the CLI
3. encode policy using the verified IDs
4. then update doctrine and tests to match

Do not freeze a policy around names you have not confirmed from the real runtime.
