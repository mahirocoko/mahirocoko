# Semantic Dicut Candidate Report: A1 Centered Subtle-3D Master (v2)

- **Status**: Historical pre-promotion candidate report. This v2 candidate later passed Mahiro's human gate and was byte-promoted; `../promotion-receipt.txt` and `../../asset-manifest.md` own current status.
- **Sole Source**: `mascot-explore/A1-adapt-centered-3d/raw.png` (v1 output was not used as input)
- **Target Location**: `mascot-explore/A1-adapt-centered-3d/production/agy-clean-v2/`
- **Output Mode**: RGBA (1254x1254 square canvas)

---

## 1. Root Cause of v1 Rejection

Main rejected v1 after visual inspection of `preview-light.png` and `preview-checker.png` revealed visible dark navy specks and halos around the upper leaf tip and along the outer silhouette transitions:

1. **Premature Flood-Fill Termination**: In v1, the 4-border flood fill applied a strict Euclidean threshold $T = 12.0$ against a canvas-wide background polynomial fit ($\sim [10.2, 35.0, 75.7]$).
2. **Ambient Drop Shadow & Diffusion Ringing**: Immediately adjacent to the mascot perimeter and leaf tip in `raw.png`, the background navy drops significantly into dark shadow / ringing where RGB values fall to $[0..10, 10..25, 45..65]$ (Euclidean distance $28..38 > 12.0$).
3. **Fringe Misclassification**: Because distance exceeded $12.0$, v1 treated these ambient shadow pixels as foreground mascot pixels (e.g. $y=72, x=817$ with RGB $[7, 30, 67]$ given $\alpha = 255$, and $y=77, x=802..803$ with RGB $[2, 19, 54]$ and $[0, 11, 51]$ given $\alpha = 255$).
4. **Visibility on Light / Checker**: When composited onto light background `#f6f4ef` or white checker tiles, these navy pixels appeared as obvious dark residue and specks.

---

## 2. v2 Extraction & Defringe Methodology

### A. 2D Background Polynomial Fitting
The canvas-wide background plane was fitted to outer canvas border pixels:
- $B_R(y, x) = 10.0892 - 5.9936 \times 10^{-5} y + 2.3710 \times 10^{-4} x$
- $B_G(y, x) = 35.7032 - 1.0078 \times 10^{-3} y - 9.7757 \times 10^{-5} x$
- $B_B(y, x) = 77.1481 - 1.7957 \times 10^{-3} y - 4.5398 \times 10^{-4} x$

Border residuals: minimum $0.07$, maximum $5.08$, mean $1.25$ L2 distance.

### B. Facial Feature Protective Masking
The dark navy facial features (eyes and mouth) are located in the deep interior of the mascot face:
- Left eye: $y \in [559, 651], x \in [510, 572]$ ($4,603$ px)
- Right eye: $y \in [511, 600], x \in [738, 797]$ ($4,215$ px)
- Mouth: $y \in [598, 638], x \in [632, 702]$ ($1,448$ px)
- Total protected facial pixels: $10,266$ px.
These features are enclosed inside the solid cream face ($> 70$ px from any outer edge). They are protected from background classification and preserved at 100% opacity ($\alpha = 255$) without modification.

### C. Border-Connected Background & Ambient Shadow Isolation
Background detection encompasses both the canvas-wide navy gradient and the contiguous ambient shadow ringing outside the mascot:
1. Pure background: $\|C - B_{\text{plane}}\| < 15.0$
2. Ambient shadow: $R < 35$, $G < 55$, $B > G + 3$, $B > R + 20$ (outside protected facial features)
3. 4-border flood fill isolates all connected background and shadow regions, eliminating isolated false foreground islands (such as the floating speck at $y=72, x=817$ and shadow at $y=74$).

### D. Solid Core vs. Outer Ribbon Separation
- Solid core: $512,464$ pixels assigned $\alpha = 255$, preserving 100% of original character pixels, 3D matte volume, face, book, hands, and leaf texture.
- Outer perimeter ribbon: $4,016$ transition pixels adjacent to background.

### E. Local Adaptive Matting & Conservative Defringing
For each ribbon pixel $C$:
1. Local background $B_{\text{local}}$ is sampled from adjacent background pixels within a $5 \times 5$ window.
2. Local foreground $F_{\text{local}}$ is sampled from adjacent solid core pixels.
3. Alpha is projected along the local foreground-background color vector:
   $$\alpha = \text{clip}\left(\frac{(C - B_{\text{local}}) \cdot (F_{\text{local}} - B_{\text{local}})}{\|F_{\text{local}} - B_{\text{local}}\|^2}, 0.0, 1.0\right)$$
4. A cutoff threshold $\alpha < 0.08$ discards pure background blur.
5. For active transition pixels, the navy background contribution is unmixed:
   $$F_{\text{unmixed}} = B_{\text{local}} + \frac{C - B_{\text{local}}}{\max(\alpha, 0.2)}$$
   with conservative adaptive weighting towards local foreground to suppress edge noise while eliminating navy tint.

---

## 3. Verification Metrics

| Metric | v2 Value | v1 Value | Target / Check |
| :--- | :--- | :--- | :--- |
| **Canvas Dimensions** | 1254 x 1254 | 1254 x 1254 | Exact match with raw.png |
| **Canvas Mode** | RGBA | RGBA | 4-channel with alpha |
| **Corners Alpha (TL, TR, BL, BR)** | 0, 0, 0, 0 | 0, 0, 0, 0 | 100% transparent corners |
| **Alpha Extrema** | [0, 255] | [0, 255] | Complete dynamic range |
| **Total Non-Zero Alpha Pixels** | 516,480 | 517,187 | Clean character mask |
| **Solid Core Pixels ($\alpha = 255$)** | 512,464 | 514,652 | Solid character body |
| **Fractional Alpha Ribbon Pixels** | 4,016 | 2,535 | Smooth antialiased boundary |
| **Navy Perimeter Residue on #f6f4ef** | 0 px | ~500 px | Zero fringe |
| **Character Bounding Box** | y=[75, 1155], x=[268, 939] | y=[72, 1155], x=[268, 940] | Floating specks eliminated |

---

## 4. Visual Inspection Findings

Visual inspection of all three generated preview images was conducted:

1. **Light Preview (`preview-light.png` on `#f6f4ef`)**:
   - The leaf tip ($y=75..85$) is completely free of floating specks or dark halos. Rows 72–74 are clean background `#f6f4ef`.
   - The outer contour blends smoothly into `#f6f4ef` with warm cream and sage tones; no navy edge ringing.
   - Body/leaf transitions ($y=400..450$) show clean boundary definition without dark specks.
2. **Dark Preview (`preview-dark.png` on `#0d0d0d`)**:
   - The silhouette is sharp and continuous without white halos, staircasing, or eroded details.
   - Subtle matte 3D shading, paper texture on book, and warm cream body lighting remain intact.
3. **Checkerboard Preview (`preview-checker.png` on 32px `#ffffff`/`#e0e0e0`)**:
   - The boundary antialiasing is clean against both white and gray tiles.
   - Facial features (oval navy eyes, curved mouth, blush cheeks) are crisp and fully opaque.

---

## 5. Artifact Manifest & SHA256 Hashes

All files are strictly written to `mascot-explore/A1-adapt-centered-3d/production/agy-clean-v2/`:

- **Source Image**: `mascot-explore/A1-adapt-centered-3d/raw.png`
  - SHA256: `8746d37db47802ed2ed4ce84d2654231384e760e455bc6df83fb65a520ceb594`
- **Candidate Master**: `subject.png` (RGBA, 1254x1254)
  - SHA256: `7c106ffb76cf28af8d85dc50d360bd251b6111f5a454960c83c80b44e1aa3758`
- **Light Preview**: `preview-light.png` (RGB on `#f6f4ef`, 1254x1254)
  - SHA256: `b47334485ce5cdc1f646c150831e60a82b7a6fefbe88ea0ae1f3e682cda9250f`
- **Dark Preview**: `preview-dark.png` (RGB on `#0d0d0d`, 1254x1254)
  - SHA256: `1d6fd531c863be31cfb4e6db62e3c1ce4bb58791ae623a2e88c6c1faabb70bfa`
- **Checker Preview**: `preview-checker.png` (RGB on 32px checkerboard, 1254x1254)
  - SHA256: `0af0756b8cc16f6e7820b9b7fa7a765201a63c3ea4c2e747788bedd550ae49b4`
- **Receipt Metadata**: `receipt.txt`
- **Report Document**: `report.md` (this file)
