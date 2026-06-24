#!/usr/bin/env bash
set -euo pipefail
BASE="source/neutral-base-64x80.png"
mkdir -p layers/full-canvas layers/cropped masks output qa
make_rect_layer() {
  local name="$1" x1="$2" y1="$3" x2="$4" y2="$5"
  magick -size 64x80 xc:black -fill white -draw "rectangle ${x1},${y1} ${x2},${y2}" "masks/${name}-mask.png"
  magick "$BASE" \( "masks/${name}-mask.png" -alpha copy \) -compose DstIn -composite PNG32:"layers/full-canvas/${name}.png"
  magick "layers/full-canvas/${name}.png" -trim +repage PNG32:"layers/cropped/${name}.png"
}
make_poly_layer() {
  local name="$1" points="$2"
  magick -size 64x80 xc:black -fill white -draw "polygon ${points}" "masks/${name}-mask.png"
  magick "$BASE" \( "masks/${name}-mask.png" -alpha copy \) -compose DstIn -composite PNG32:"layers/full-canvas/${name}.png"
  magick "layers/full-canvas/${name}.png" -trim +repage PNG32:"layers/cropped/${name}.png"
}
# Back-to-front animation parts. Masks are intentionally conservative/overlapping for easy hand cleanup.
make_poly_layer "tail" "49,43 60,44 63,55 61,69 51,72 46,66 51,60 55,52"
make_poly_layer "katana-back" "2,31 15,32 19,70 8,73 4,58 0,45"
make_poly_layer "torso-kimono" "16,33 49,34 52,69 43,76 21,76 13,68 13,43"
make_rect_layer "obi-belt" 19 48 47 63
make_rect_layer "left-foot" 17 66 32 79
make_rect_layer "right-foot" 32 66 49 79
make_poly_layer "head" "11,0 53,0 59,18 57,36 45,45 17,43 5,32 6,15"
make_rect_layer "face-features" 13 21 49 37
make_poly_layer "front-sleeve" "39,43 56,44 56,68 43,71 38,58"
# A full neutral base is useful as fallback/reference layer.
cp "$BASE" "layers/full-canvas/neutral-base.png"
cp "$BASE" "layers/cropped/neutral-base.png"
# Assemble neutral preview from rig layers. This is a QA assembly; final art remains output PNG.
magick -size 64x80 xc:none \
  layers/full-canvas/tail.png -composite \
  layers/full-canvas/katana-back.png -composite \
  layers/full-canvas/torso-kimono.png -composite \
  layers/full-canvas/obi-belt.png -composite \
  layers/full-canvas/left-foot.png -composite \
  layers/full-canvas/right-foot.png -composite \
  layers/full-canvas/front-sleeve.png -composite \
  layers/full-canvas/head.png -composite \
  layers/full-canvas/face-features.png -composite \
  PNG32:output/assembled-neutral.png
magick output/assembled-neutral.png -filter point -resize 400% PNG32:qa/assembled-neutral-preview-4x.png
magick "$BASE" -filter point -resize 400% PNG32:qa/source-neutral-preview-4x.png
# Basic sample idle strip made from the neutral base only; real animation should use rig transforms from rig.json.
magick \
  output/assembled-neutral.png output/assembled-neutral.png output/assembled-neutral.png \
  output/assembled-neutral.png output/assembled-neutral.png output/assembled-neutral.png \
  +append PNG32:output/idle-neutral-6f-strip.png
magick output/idle-neutral-6f-strip.png -filter point -resize 400% PNG32:qa/idle-neutral-6f-strip-preview-4x.png
