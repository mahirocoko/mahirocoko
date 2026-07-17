# รอยเมือง — Frontend Design Brief

## Current reality

- This is a greenfield frontend lab under `apps/frontend-labs/chiang-mai-journal/`.
- No runtime stack, font family, components, routes, or generated assets exist yet.
- The working brand, first issue, visual system, opening composition, and first delivery slice are owner-approved.
- All editorial stories and Codex-generated imagery are fictional lab material unless a later source packet explicitly proves otherwise.

## Brand read

- **Working brand:** รอยเมือง
- **Issue 01:** เมืองที่ทำด้วยมือ
- **Place:** contemporary Chiang Mai
- **Audience:** Thai readers interested in city life, design, material culture, and the people who keep making and repairing things.
- **Primary action:** enter the current issue, then open the lead feature story.
- **Desired read:** observant, tactile, current, and specific without becoming nostalgic, promotional, or precious.
- **Signature relationship:** marks made by hands, materials, lettering, use, and time become one persistent issue/chapter spine.
- **Unknown:** final legal/name clearance.

## Taste thesis

รอยเมืองควรรู้สึกเหมือนสิ่งพิมพ์ไทยร่วมสมัยที่มาอยู่บนเว็บ ชวนให้คนมองเชียงใหม่ผ่านรายละเอียดของงานมือ โดยไม่ไหลไปเป็นเว็บท่องเที่ยว งานย้อนยุคสำเร็จรูป หรือ craft catalogue

## Design read

A Thai-first issue and long-form reading surface that uses an open editorial spread, constructed imagery, and one lacquer-red chapter spine to connect cover, index, and article progress.

## Mode and composition

- **Mode:** greenfield
- **Composition:** whole-composition design, not a transplanted landing-page template
- **Opening:** open-issue spread
- **Desktop first viewport:** issue/chapter spine + issue identity + Thai title + constructed cover collage + compact chapter index
- **Mobile first viewport:** issue strip → title → collage → chapter index
- **Generic composition rejected:** centered headline above a full-width image followed by a card grid

## First slice structure

### Home

1. Stable masthead and issue context
2. Open-issue spread for `เมืองที่ทำด้วยมือ`
3. Four-chapter index with only the lead feature presented as a complete article in this slice
4. Lead visual-essay sequence
5. Compact issue note and fictional-provenance disclosure
6. Colophon / next-issue placeholder without invented subscription or commerce behavior

### Feature article

1. Article masthead tied to Chapter 01
2. Serif-led Thai headline and readable deck
3. Wide lead image with explicit conceptual-image caption
4. Long-form body with restrained pull quote and object-study interruption
5. Chapter navigation back to the issue
6. Fictional editorial disclosure and image provenance

## Visual system

### Typography

- Maitree leads issue titles, article headlines, and pull quotes.
- Anuphan Variable owns body, captions, navigation, labels, and metadata.
- The pair was selected from matched 1440px and 390px real-content specimens; Noto remains the safe readability fallback and Pridi remains useful only as a possible special-cover accent.
- Current hierarchy deliberately reserves the largest display tier for the Home issue title. Desktop caps are Home `92px`, article title `60px`, chapter-index title `40px`, article h2 `34px`, pull quote `30px`, article body `18px`, chapter rows `24px`, and figure markers `48px`.
- At 390px, article title/h2/quote/body/figure marker resolve to `36/24/22/17/24px`; at 320px they resolve to `32/22/21/16.5/24px`. Thai long-form clarity should come from line-height and measure rather than scaling body/quote text toward display size.
- Reject fixed-height Thai text boxes, forced uppercase treatment, excessive tracking, and line breaks designed around English.

### Color and material

- Warm uncoated paper is the main reading surface.
- Ink black owns body text and structural rules.
- Lacquer red is functional: issue marker, chapter spine, current state, links, and primary actions.
- Deep indigo is a controlled secondary editorial tone.
- Paper texture may appear inside generated/editorial media; CSS surfaces should remain crisp enough for sustained reading.

### Image system

- Primary family: constructed editorial collage showing fictional city context through deliberate crop, paper edge, print texture, and visible assembly.
- Secondary family: object studies of tools, material, brush marks, sign substrates, surfaces, and evidence of use.
- Avoid legible generated signs, recognizable real businesses, famous landmarks, tourism iconography, fake interviews, and documentary claims.

### Components

- Issue spine / mobile issue strip
- Masthead and chapter index
- Editorial figure with provenance-aware caption
- Article body, pull quote, and material note
- Chapter navigation
- Fictional editorial disclosure

## Interaction and motion

- The chapter spine may remain sticky on desktop only while it improves issue location and reading progress.
- Current slice renders the complete settled composition with no entrance animation. Future motion must explain issue seating or navigation rather than decorate page load.
- Any later image reveal may use bounded crop/registration movement; no scroll hijacking or ambient parallax.
- Chapter transitions should update the red current marker without turning the page into a progress dashboard.
- Reduced motion renders the complete settled composition immediately.
- Missing media retains title, caption, provenance, and layout ownership rather than collapsing the story.

## Responsive contract

- Mobile preserves issue identity, cover proof, chapter choice, and article readability—not the desktop columns.
- Thai title wraps are art-directed separately at narrow widths.
- Editorial images remain inspectable; they must not shrink into background texture.
- The chapter spine becomes a compact issue strip and chapter navigation becomes an in-flow list.
- Body line length and caption hierarchy must remain comfortable at 320, 390, and desktop widths.

## Implementation constraints

- Use pnpm and exact dependency versions after checking current repo patterns.
- Keep the lab independently runnable.
- Do not import DOVEL's design anatomy, typography, tokens, GSAP choreography, or Three.js stack by default.
- No shared frontend-lab package until reuse is proven by a second implementation.
- Keep imagegen source, cleanup, QA, and promoted runtime assets distinct.

## Verification

- Desktop issue opening, mid-page chapter transition, and article reading state
- 390px and 320px Home + article
- Reduced motion
- Missing cover and missing article image
- Realistic Thai title/body stress and mixed Thai/Latin metadata
- Keyboard navigation, focus visibility, skip link, and semantic article landmarks
- Codex asset crops at their actual rendered sizes
- No generated text residue or invented documentary claims

## Next implementation gate

The Home + Chapter 01 slice and its A01/A02/A03/A07/A08 responsive image family are implemented and browser-verified. The user-flagged wide article title is capped and evidence-tested at 1912×856 as well as 1440/390/320. A04-A06 remain deferred because the rendered Home uses a typographic chapter index with no image slots and Chapters 02–04 are not falsely presented as complete.
