# DOVEL System 01 Model Contract

## Asset

- File: `public/assets/models/dovel-system-01.glb`
- Format: GLB 2.0 binary
- Generator: `scripts/build-dovel-system-model.mjs`
- Validator: `scripts/check-dovel-system-model.mjs`
- Units: meters
- Baseline: desk-safe bottom at `y = 0`, with a 120cm-class rail width

## Required semantic nodes

The GLB must include these named nodes for runtime targeting:

- `RailAssembly`
- `RailBody`
- `ArcDock`
- `HaloLight`
- `PocketTray`

Hidden runtime modules are still exported. The build script uses GLTFExporter with `onlyVisible: false`, so default-hidden support meshes remain present in the GLB.

## Required materials

The GLB must include these named materials:

- `FinishMetal`
- `VermilionLatch`
- `WarmLED`
- `AshWood`
- `GraphitePad`
- `WoodGrain`

Materials are procedural Three.js standard materials only. The asset must not use textures, images, or external fetches.

## Current validated output

Validated by running:

```sh
node scripts/build-dovel-system-model.mjs
node scripts/check-dovel-system-model.mjs
```

Current check result:

- Bytes: `444336`
- SHA-256: `e82e3673d545eded05108e7de37b6bed448a9d3334738dc7d27598e9295578a3`
- Mesh count: `44`
- Bounds min: `[-0.6159999996125698, 1.4901161207725444e-10, -0.1496359101735134]`
- Bounds max: `[0.6159999996125698, 0.8322350469750488, 0.3000000059604645]`
- Bounds size: `[1.2319999992251396, 0.8322350468260372, 0.4496359161339779]`

Two consecutive generator runs produced the same SHA-256, so the current procedural export is deterministic.

## Runtime contract

- `@react-three/fiber@9.6.1` and `three@0.182.0` are exact-pinned for React 19 compatibility without browser-console deprecation warnings.
- The 3D implementation is lazy-loaded only when the Builder approaches the viewport; the main route does not request the 3D chunk or GLB at first paint.
- Rail span scales the rail while preserving module size and attachment spacing.
- Finish updates every `FinishMetal` material; module toggles seat/remove the named groups.
- `prefers-reduced-motion` removes pointer parallax and settles configuration changes immediately.
- Missing WebGL or a runtime model error keeps the prior CSS concept geometry available.

## V2 fidelity mapping

The current candidate uses the promoted product renders as bounded single-view silhouette/material references:

- Arc Dock: 15-degree landing plate, inset face, lower ledge/notch, rear support mass, and open graphite rail shoe with vermilion latch.
- Halo Light: thin stem, left-reaching light blade, underside diffuser, round hinge, vermilion collar, and open graphite clamp.
- Pocket Tray: shallow ash floor with four raised lips, thin aluminum perimeter frame, rear slide rail, and side vermilion latch.
- System rail: raised dovetail lips, dark slot bed, end caps, and an edge-clamp spine aligned against a visible desk slab edge in the runtime scene.

The references do not prove hidden/back geometry or manufacturing joints. Those surfaces remain original concept decisions and must not be represented as CAD truth.

## Provenance

`DOVEL System 01` is an original procedural mesh assembled in code with `three@0.182.0`, `GLTFExporter`, and primitive geometry. Blender or other DCC tooling was not used. The model contains real binary mesh, material, and node data in the GLB.

## Limitations

- No UV-authored texture detail; all appearance comes from compact materials and geometry.
- The asset is a production-lane contract model, not manufacturing CAD. Its Arc Dock, Halo Light, Pocket Tray, shared feet, and rail follow the current fictional product grammar but remain concept geometry.
- Bounds allow small floating-point drift around the desk baseline; validator rejects meaningful negative baseline values.
