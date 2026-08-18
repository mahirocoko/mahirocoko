import { HISTORY_EVENTS } from '../content'

const Journey = () => (
  <section className="history section-shell" id="history" aria-labelledby="history-title">
    <header className="history__heading">
      <p>เรียงตามลำดับเวลา</p>
      <h2 id="history-title">เรื่องที่เกิดขึ้นจริง</h2>
      <p>แต่ละช่วงเล่าว่าเกิดอะไรขึ้น มีข้อความจากตอนนั้นเมื่อหาเจอ และหลังจากนั้นวิธีทำงานเปลี่ยนไปอย่างไร</p>
    </header>

    <div className="history__entries">
      {HISTORY_EVENTS.map((event, index) => (
        <article className="history-entry" id={event.id} key={event.id}>
          <div className="history-entry__aside">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <time>{event.date}</time>
          </div>

          <div className="history-entry__body">
            <span className="source-label">{event.source}</span>
            <h3>{event.title}</h3>
            <p className="history-entry__summary">{event.summary}</p>

            <div className="history-entry__details">
              {event.details.map((detail) => <p key={detail}>{detail}</p>)}
            </div>

            {event.quote ? (
              <figure className="history-quote">
                <blockquote>“{event.quote}”</blockquote>
                {event.quoteContext ? <figcaption>{event.quoteContext}</figcaption> : null}
              </figure>
            ) : null}

            <div className="history-entry__after">
              <span>หลังจากนั้น</span>
              <p>{event.after}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export { Journey }
