# A1 centered subtle-3D asset handoff

| filename | role | ratio | format | source strategy | expected QA checks | status |
| --- | --- | --- | --- | --- | --- | --- |
| raw.png | accepted identity source / visual authority | 1:1 | RGB PNG | human-selected native reference edit | preserve bytes, no product-repo edits | accepted source |
| production/agy-clean/subject.png | rejected v1 transparent candidate | 1:1 | RGBA PNG | semantic dicut from raw.png | retained only with report + QA rejection | rejected; evidence only |
| production/agy-clean-v2/subject.png | accepted v2 transparent candidate / promotion source | 1:1 | RGBA PNG | corrected semantic dicut from raw.png, never from v1 | light/dark/checker composites, alpha corners, independent fringe check, book/leaf/face intact | human gate passed; byte-promoted |
| production/agy-clean-v2/preview-light.png, preview-dark.png, preview-checker.png | v2 QA composites | 1:1 | RGB PNG | derived from accepted v2 candidate | readable silhouette, no navy residue, subtle 3D preserved | supporting acceptance evidence |
| production/subject.png | human-approved transparent character master | 1:1 square canvas with intentional identity padding | RGBA PNG | byte-preserving promotion from Agy v2 semantic dicut | light/dark/checker composites, alpha corners, independent fringe check, book/leaf/face intact | promoted |
