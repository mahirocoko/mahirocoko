export const SiteHero = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__eyebrow">Local preflight study — PNG · JPEG · PDF</p>
      <h1 className="hero__title" id="hero-title">
        <span className="hero__title-line">Preflight the file.</span>
        <span className="hero__title-line hero__title-line--serif">Keep the original.</span>
      </h1>
      <p className="hero__lede">
        Vessel is a local-first preflight study for images and documents. Inspect metadata, plan a
        derivative, and keep the source untouched — all before anything leaves your Mac.
      </p>
      <div className="hero__actions">
        <a className="btn btn--primary" href="/app/">
          Open the app study
        </a>
        <a className="btn btn--quiet" href="#workflow">
          Read the workflow
        </a>
      </div>
    </section>
  )
}
