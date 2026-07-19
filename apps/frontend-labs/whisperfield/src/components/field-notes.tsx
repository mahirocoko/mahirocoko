import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { FIELD_NOTES } from '../content'

const NoteSet = ({ duplicate = false }: { duplicate?: boolean }) => (
  <div className="wf-testimonial-set" aria-hidden={duplicate || undefined}>
    {FIELD_NOTES.map((note, index) => (
      <article className="wf-love-card" key={note.name}>
        <div className="wf-love-card-content">
          <div className="wf-love-person">
            <img src={`/assets/generated/avatar-${String(index + 1).padStart(2, '0')}.webp`} alt="" />
            <p><strong>{note.name}</strong><small>{note.role}</small></p>
          </div>
          <blockquote>{note.quote}</blockquote>
        </div>
      </article>
    ))}
  </div>
)

const FieldNotes = () => {
  const [paused, setPaused] = useState(false)

  return (
    <section className="wf-notes" id="notes">
      <div className="wf-notes-inner">
        <header className="wf-notes-header">
          <p>Fictional field notes</p>
          <h2>Wall of Love</h2>
          <span>Original fictional voices used to test the testimonial rhythm without borrowing real customer proof.</span>
        </header>
        <button className="wf-notes-pause" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span>{paused ? 'Play field notes' : 'Pause field notes'}</span>
        </button>
        <div className="wf-testimonial-rail">
          <span className="wf-carousel-fade is-left" aria-hidden="true" />
          <span className="wf-carousel-fade is-right" aria-hidden="true" />
          <div className="wf-testimonial-carousel" aria-label="Fictional Whisperfield field notes carousel">
            <div className={`wf-testimonial-track ${paused ? 'is-paused' : ''}`}>
              <NoteSet />
              <NoteSet duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FieldNotes }
