import { LANDSCAPE_SRC, SAMPLE_SOURCE } from '../src/shared/facts'
import { OpticBlade } from '../src/shared/optic-blade'

interface IAuditRow {
  field: string
  value: string
  flagged?: boolean
}

const AUDIT_ROWS: IAuditRow[] = [
  { field: 'GPS coordinates', value: '47.3769° N, 8.5417° E', flagged: true },
  { field: 'Camera', value: 'ILCE-7M3 · 35mm f/1.4' },
  { field: 'Captured', value: '2026-09-12 · 06:41:08' },
  { field: 'Software', value: 'Darkroom 9.2.1' },
  { field: 'XMP history', value: '8 edit entries', flagged: true },
  { field: 'Color profile', value: 'Display-P3 · full range' },
]

export const BladeProof = () => {
  return (
    <section className="section blade-proof" id="product" aria-labelledby="blade-proof-title">
      <div className="section__head">
        <p className="section__eyebrow">The proof surface</p>
        <h2 className="section__title" id="blade-proof-title">
          One blade, two truths
        </h2>
        <p className="section__lede">
          The Optic Blade lays the derivative over the source so you can compare before anything is
          written. Drag the divider, or focus it and use the arrow keys.
        </p>
      </div>

      <div className="blade-proof__frame">
        <div className="blade-proof__bar">
          <span className="blade-proof__label">Optic Blade</span>
          <span className="blade-proof__hint">Drag to compare ◂ ▸</span>
        </div>
        <OpticBlade
          imageSrc={LANDSCAPE_SRC}
          imageAlt="Sample landscape photograph used as the preflight source"
          theme="light"
          derivativeFilter="saturate(0.88) contrast(1.05) brightness(0.99)"
          ariaLabel="Compare sample source with simulated derivative"
        />
        <div className="blade-proof__facts">
          <span>
            {SAMPLE_SOURCE.format} · {SAMPLE_SOURCE.width} × {SAMPLE_SOURCE.height}
          </span>
          <span>sRGB · Display-P3 master</span>
        </div>
      </div>

      <p className="section__disclosure">
        Fictional sample. The derivative side is a CSS-simulated preview — no file is rendered,
        converted, or exported by this study.
      </p>
    </section>
  )
}

export const AuditSection = () => {
  return (
    <section className="section audit" id="privacy" aria-labelledby="audit-title">
      <div className="section__head">
        <p className="section__eyebrow">Metadata &amp; privacy audit</p>
        <h2 className="section__title" id="audit-title">
          See what the file carries
        </h2>
        <p className="section__lede">
          Before a copy goes anywhere, Vessel surfaces what is embedded in it — location tags, edit
          history, device serials — so removal is a decision, not a surprise.
        </p>
      </div>

      <div className="audit__readout" role="table" aria-label="Sample metadata readout (fictional)">
        <div className="audit__readout-head" role="row">
          <span role="columnheader">Field</span>
          <span role="columnheader">Sample value</span>
        </div>
        {AUDIT_ROWS.map((row) => (
          <div className="audit__row" role="row" key={row.field}>
            <span className="audit__field" role="rowheader">
              {row.field}
            </span>
            <span className="audit__value" role="cell">
              {row.value}
              {row.flagged ? <span className="audit__flag">Removed in derivative</span> : null}
            </span>
          </div>
        ))}
      </div>

      <p className="section__disclosure">
        Fictional sample readout. This study ships no parser and claims no universal PII detection —
        it demonstrates the audit surface, not a finished engine.
      </p>
    </section>
  )
}

export const ColorSection = () => {
  return (
    <section className="section color" id="color" aria-labelledby="color-title">
      <div className="section__head">
        <p className="section__eyebrow">Color &amp; profile</p>
        <h2 className="section__title" id="color-title">
          Preview the gamut, honestly
        </h2>
        <p className="section__lede">
          A Display-P3 master can be previewed as an sRGB delivery copy before you commit. The
          comparison is there to inform the decision — not to certify the math.
        </p>
      </div>

      <div className="color__strips">
        <figure className="color__strip">
          <div className="color__swatch color__swatch--p3" aria-hidden="true" />
          <figcaption>Display-P3 master — as staged</figcaption>
        </figure>
        <figure className="color__strip">
          <div className="color__swatch color__swatch--srgb" aria-hidden="true" />
          <figcaption>sRGB preview — simulated in CSS</figcaption>
        </figure>
      </div>

      <p className="section__disclosure">
        The preview is a CSS approximation. It is not proof of native color conversion, and no
        profile transform runs in this study.
      </p>
    </section>
  )
}
