# W1 Light-Variant Semantic Cleanup Candidate

## Overview
This directory contains a semantic cleanup candidate derived solely from `../raw.png`. The source asset was an RGB PNG with baked checkerboard background artifacts resulting from an image generation tool without native alpha.

The cleanup extracts the logo mark and wordmark with edge-aware alpha matting and defringing, cropping to visible bounds with modest padding, while preserving the raw source asset and all previous files unchanged.

## Inputs & Outputs
- **Source**: `../raw.png` (2172×724 RGB, SHA256: `aac280abbd811b7a38d7e0dba8322935d947e5ef758dd129644943c2541d76a8`)
- **Clean RGBA**: `clean.png` (1649×300 RGBA, SHA256: `e0e612305e2263d53c40df1dee7c390493208f875a4714fbaed845a962fbf455`)
- **Light Preview**: `preview-light.png` (1649×300 RGB on `#f6f4ef`, SHA256: `f1d275f8168afc123b7bd30fc3a718c2f065a48b14f9d12597a9addc5570803d`)
- **Dark Preview**: `preview-dark.png` (1649×300 RGB on `#0d0d0d`, SHA256: `ba682457d858f5cc66f5e4292ae1f05a0bbb5a5141bdc15c27d5c016b6d4aefd`)
- **Receipt**: `receipt.txt`

## Methodology & Evidence

### 1. Segmentation
- **Core Foreground**: Identified solid dark graphite/navy surfaces (`brightness < 78`, `B >= R`) and the orange accent (`R > 160`, `R - B > 50`, `R > G`).
- **Definite Background**: Identified the baked neutral gray checkerboard pattern (`chroma <= 6`, `110 <= brightness <= 235`) both outside the mark/wordmark and within interior counters/cavities (e.g. loops in 'a', 'b', and mark openings).
- **Transition Band**: Narrow 1–3 pixel boundary regions containing antialiased blend pixels.

### 2. Edge-Aware Matting & Defringing
- For each transition pixel, local foreground and background color fields were computed from neighboring core pixels.
- The pixel's color vector was projected onto the local contrast vector to recover antialiased alpha coverage $\alpha \in [0, 1]$.
- Edge RGB was defringed to local foreground chromaticity, eliminating light and dark checkerboard halo artifacts on contrasting backdrops.
- Alpha values below threshold ($\alpha \le 0.02$) were clamped to zero with zeroed RGB.

### 3. Cropping & Bounds
- Measured visible alpha bounds: $y \in [223, 458]$, $x \in [295, 1879]$ (width: 1585 px, height: 236 px).
- Applied 32px modest padding: crop box `[263, 191, 1912, 491]`, yielding canvas dimensions of 1649×300.
- All four canvas corners are verified at RGBA `[0, 0, 0, 0]`.

## Evidence Breakdown

- **Observed**:
  - `clean.png` has mode `RGBA`, dimensions 1649×300, alpha extrema `[0, 255]`, and all 4 corners at alpha 0.
  - Wording is verbatim "Laya MLX Lab": capital L, lowercase aya, space, capital MLX with orange accent on 'X', space, capital L, lowercase ab.
  - Horizontal lockup and icon geometry match `../raw.png` directly.
  - Interior letter loops (e.g. 'a', 'b') and icon cavities are cleanly transparent.
  - Dark preview on `#0d0d0d` and light preview on `#f6f4ef` show smooth antialiasing without checkerboard fringing.
  - Source `../raw.png` and all pre-existing files in `../` and `../../` remain untouched.
- **Inferred**:
  - The matte candidate provides clean presentation across dark and light UI surfaces.
- **Unverified**:
  - Final human aesthetic acceptance for production promotion remains Mahiro-owned.
