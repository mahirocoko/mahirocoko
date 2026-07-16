# Procedural GLB needs runtime and visual contracts

Tags: `threejs`, `r3f`, `glb`, `3d`, `assets`, `determinism`, `accessibility`, `performance`, `qa`

## Core lesson

A binary GLB that exports and parses is not yet a production-ready web model. A complete proof needs three contracts:

1. **Asset contract** — deterministic geometry/material/node data.
2. **Runtime contract** — lazy loading, state ownership, fallback, responsive behavior, and accessibility.
3. **Visual contract** — reference-informed silhouette/material readability in actual target configurations.

## Asset contract

- Use one canonical unit and baseline.
- Give every configurable object a stable semantic node name.
- Name materials by runtime ownership instead of incidental color.
- Validate GLB magic/version/length, finite bounds, required nodes/materials, texture/external-resource policy, mesh count, and size ceiling.
- Rebuild twice and compare SHA-256 before reporting deterministic output.
- Keep concept geometry explicitly separate from CAD/manufacturing claims.

## Runtime contract

- Keep heavy Three.js/R3F code in an intersection-triggered lazy chunk.
- Prove the chunk and GLB are absent at first paint and requested only near the 3D surface.
- Clone mutable materials per scene and dispose only owned clones.
- Keep rail scale, finish material, and module visibility as separate state owners.
- Use a hard-zero visibility threshold when removing modules; exponential opacity alone leaves ghosts.
- Bound DPR, pointer parallax, camera movement, and mobile framing.
- Under reduced motion, remove parallax and settle state immediately; static 3D may remain with demand rendering.
- Keep controls semantic outside the canvas and give the decorative preview one dynamic text alternative.
- Label GLB/live state only after readiness. No-WebGL, loading failure, or render failure must retain truthful static/CSS fallback copy.

## Visual contract

- Preserve a rollback asset/hash before a fidelity pass.
- Compare V1/V2 at matched camera, finish, and module state.
- Use single-view renders only for visible silhouette/material evidence; invent hidden geometry honestly.
- Inspect graphite and silver separately. Metal readability depends on color, metalness, roughness, lights, and background together.
- Verify all modules, isolated modules, empty rail, mobile, reduced motion, no WebGL, and model-error states.
- Spend bevel segments on silhouette-critical geometry only; small repeated rounded pieces can multiply GLB size dramatically.
- Model physical contact—not only relative placement—when the product promise depends on mounting, attachment, or an edge.

## Promotion rule

One accepted project proof justifies durable memory and repo documentation. Create a reusable persistent skill only after a second project or repeated operational demand proves shared ownership pressure.

