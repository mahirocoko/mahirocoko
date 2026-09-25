# Semantic Dicut Candidate Report: A1 Centered Subtle-3D Master

- **Status**: Historical v1 candidate report. Main visual QA later rejected this candidate for visible navy residue; `qa-review.md` is the verdict owner. It was not promoted and was not used as the v2 source.
- **Sole Source**: `mascot-explore/A1-adapt-centered-3d/raw.png` (Preserved intact)
- **Target Location**: `mascot-explore/A1-adapt-centered-3d/production/agy-clean/`
- **Output Mode**: RGBA (1254x1254 square canvas)

---

## 1. Identity & Anatomy Verification

The human-selected A1 centered subtle-3D master identity was preserved exactly without redrawing, regeneration, recoloring, filtering, or composition alteration:
- **Silhouette & Placement**: Perfectly centered full silhouette on the original 1254x1254 canvas.
- **Body & Head**: Warm cream body with subtle matte 3D shading and volume intact.
- **Sage Leaf / Hood**: Muted sage green hood and leaf structure with preserved curvature and lighting.
- **Facial Features**:
  - Oval navy eyes preserved at exact coordinates.
  - Curved navy mouth preserved intact.
  - Soft blush cheek marks preserved without color alteration.
- **Props & Anatomy**: Green book held by both cream hands; book spine, pages, and hands completely intact.
- **Color Palette & Volume**: Muted sage/warm cream palette maintained; no smoothing or flattening of 3D volume.

---

## 2. Extraction & Matting Methodology

### A. 2D Background Modeling
The deep navy background was modeled across the 1254x1254 canvas using a 2D polynomial surface fit to the outer border pixels:
$$B_R(y, x) = 10.7865 - 1.0500 \times 10^{-4} y - 9.6601 \times 10^{-5} x$$
$$B_G(y, x) = 34.9493 - 6.2950 \times 10^{-4} y - 1.8827 \times 10^{-4} x$$
$$B_B(y, x) = 77.9222 - 1.0160 \times 10^{-3} y - 3.6181 \times 10^{-4} x$$
Mean residual on pure background: $1.35$ L2 distance; maximum border residual: $6.66$.

### B. Border-Connected Silhouette Extraction & Enclosed Gap Inspection
- **Border Connectivity**: 4-border flood fill isolated the outer background up to threshold $T = 12.0$.
- **Enclosed Gap Inspection**:
  - The interior of the silhouette was inspected for background through-holes.
  - The only internal regions sharing background-like navy color values are the mascot's eyes (left: 4,402 px, right: 4,048 px) and mouth (1,317 px).
  - Because extraction is border-connected, facial features were 100% protected and preserved.
  - No background voids exist through the torso, hands, or book.

### C. Continuous Edge Matting & Color Unmixing
To avoid navy fringe on light backgrounds while preserving antialiasing:
1. A 2-layer ribbon (~5,800 pixels) around the silhouette perimeter was designated as the transition zone.
2. Local foreground colors $F$ were propagated from the solid mascot boundary.
3. For each transition pixel $C$:
   $$\alpha = \text{clip}\left(\frac{(C - B) \cdot (F - B)}{\|F - B\|^2}, 0.0, 1.0\right)$$
4. The defringed foreground color was computed by unmixing the navy background:
   $$F_{\text{unmixed}} = B + \frac{C - B}{\alpha}$$
   This explicitly subtracts the background navy contribution $(1 - \alpha) B$, eliminating color contamination.

---

## 3. Verification Metrics

| Metric | Value | Target / Check |
| :--- | :--- | :--- |
| **Canvas Dimensions** | 1254 x 1254 | Exact match with raw.png |
| **Canvas Mode** | RGBA | 4-channel with alpha |
| **Corners Alpha (TL, TR, BL, BR)** | 0, 0, 0, 0 | 100% transparent corners |
| **Alpha Extrema** | [0, 255] | Complete dynamic range |
| **Total Non-Zero Alpha Pixels** | 517,187 | Exact mascot coverage |
| **Solid Core Pixels ($\alpha = 255$)** | 514,652 | Solid character body |
| **Fractional Alpha Transition Pixels** | 2,535 | Smooth antialiased boundary |
| **Navy Fringe on #f6f4ef** | 0 px residual (v1 self-assessment; superseded and disproven by `qa-review.md`) | Historical metric only; not acceptance evidence |

---

## 4. Output Artifacts

All files are written strictly to `mascot-explore/A1-adapt-centered-3d/production/agy-clean/`:

- **`subject.png`** (RGBA, 1254x1254)
  - SHA256: `4dfb148e88f561ccf803e3bf6743ddfcdb8289a2b936fde90bf2fad4ffc7b561`
- **`preview-light.png`** (RGB on `#f6f4ef`, 1254x1254)
  - SHA256: `07e317575766b4a35a3cf4f8002b092acddf06e9bf1058cbff2996a7871603b2`
- **`preview-dark.png`** (RGB on `#0d0d0d`, 1254x1254)
  - SHA256: `ceb466d70ba714adf807270c04e5d7f6fba35f93e7d9beef9470bcd922f5e270`
- **`preview-checker.png`** (RGB on 32px checkerboard `#ffffff`/`#e0e0e0`, 1254x1254)
  - SHA256: `8207623f5e0e38738315499ef79bce5ff35f7f0132dabf8ba4cdf2515e1a0cb9`
- **`receipt.txt`**
  - SHA256 metadata, source hash, output hashes, dimensions, mode, and method.
- **`report.md`**
  - This document.
