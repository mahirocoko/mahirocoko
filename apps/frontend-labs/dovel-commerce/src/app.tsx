import { useCallback, useState } from 'react'
import { PRODUCTS } from './data'
import type { Finish, ModuleId, SystemConfiguration } from './types'
import { useCommerce } from './hooks/use-commerce'
import { runViewTransition } from './utils/view-transition'
import { ArrowIcon } from './components/icons'
import { CartDrawer } from './components/cart-drawer'
import { ProductCard } from './components/product-card'
import { ProductDetailDialog } from './components/product-detail-dialog'
import { MotionHeading } from './components/motion-heading'
import { SystemHero } from './components/system-hero'
import { SearchDialog } from './components/search-dialog'
import { SiteFooter } from './components/site-footer'
import { SiteHeader } from './components/site-header'
import { SystemBuilder } from './components/system-builder'
import { useHeroIntro } from './hooks/use-hero-intro'
import { useSectionIntro } from './hooks/use-section-intro'

const scrollTo = (selector: string) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.querySelector(selector)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

const App = () => {
  const commerce = useCommerce()
  const [finish, setFinish] = useState<Finish>('graphite')
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[number] | null>(null)
  const [transitionProductId, setTransitionProductId] = useState<ModuleId | null>(null)
  const heroRef = useHeroIntro()
  const principleRef = useSectionIntro<HTMLElement>()
  const starterRef = useSectionIntro<HTMLElement>()
  const shopRef = useSectionIntro<HTMLElement>()
  const materialsRef = useSectionIntro<HTMLElement>()
  const journalRef = useSectionIntro<HTMLElement>()

  const closeCart = useCallback(() => setCartOpen(false), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeProduct = useCallback(() => {
    if (!selectedProduct) return

    runViewTransition(
      () => setSelectedProduct(null),
      {
        prepare: () => setTransitionProductId(selectedProduct.id),
        complete: () => setTransitionProductId(null),
      },
    )
  }, [selectedProduct])

  const openSearch = () => {
    setCartOpen(false)
    setSelectedProduct(null)
    setSearchOpen(true)
  }

  const openCart = () => {
    setSearchOpen(false)
    setSelectedProduct(null)
    setCartOpen(true)
  }

  const openProduct = (product: (typeof PRODUCTS)[number]) => {
    runViewTransition(
      () => {
        setSearchOpen(false)
        setCartOpen(false)
        setSelectedProduct(product)
      },
      {
        prepare: () => setTransitionProductId(product.id),
        complete: () => setTransitionProductId(null),
      },
    )
  }

  const openProductFromSearch = (product: (typeof PRODUCTS)[number]) => {
    setSearchOpen(false)
    setCartOpen(false)
    setSelectedProduct(product)
  }

  const addProduct = (product: (typeof PRODUCTS)[number], selectedFinish: Finish) => {
    commerce.addProduct(product, selectedFinish)
    setSelectedProduct(null)
    openCart()
  }

  const addConfiguration = (configuration: SystemConfiguration) => {
    commerce.addConfiguration(configuration)
    openCart()
  }

  return (
    <div id="top">
      <SiteHeader itemCount={commerce.itemCount} onOpenSearch={openSearch} onOpenCart={openCart} />
      <main>
        <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
          <div className="hero-copy">
            <p className="overline" data-motion-overline>System 01 · Modular desk rail</p>
            <MotionHeading as="h1" id="hero-title" lines={['One edge.', 'A clearer desk.']} />
            <p className="hero-lede" data-motion-copy>A slim mechanical rail that gives every object a place to land—and lets the work surface stay open.</p>
            <div className="hero-actions" data-motion-frame>
              <button type="button" className="primary-button" onClick={() => scrollTo('#system')}>Configure System 01 <ArrowIcon /></button>
              <button type="button" className="secondary-button" onClick={() => scrollTo('#shop')}>Shop modules</button>
            </div>
            <div className="hero-spec" data-motion-frame>
              <span><small>Configuration shown</small><strong>120 cm · 3 modules</strong></span>
              <span><small>Concept price</small><strong>$616</strong></span>
            </div>
          </div>
          <div className="hero-media">
            <SystemHero />
            <div className="hero-media__note"><span>01</span><p>Rail-mounted. Reconfigurable. Serviceable by design.</p></div>
          </div>
        </section>

        <section className="system-principle" aria-label="System principle" ref={principleRef}>
          <span data-motion-overline>THE DOVEL EDGE</span>
          <div className="principle-rail" data-motion-rule><i /><i /><i /></div>
          <p data-motion-copy>Slide. Seat. Click.</p>
        </section>

        <section className="starter-section" aria-labelledby="starter-title" ref={starterRef}>
          <div className="starter-copy">
            <span data-motion-overline>System 01 starter / Buying path</span>
            <MotionHeading id="starter-title" lines={['Start with the rail.', 'Add only what stays.']} />
            <p data-motion-copy>The everyday configuration pairs a 120 cm rail with Arc Dock and Pocket Tray. Every module fits every System 01 span.</p>
          </div>
          <div className="starter-offer" data-motion-frame data-motion-group data-motion-group-delay="0.24">
            <div className="starter-offer__heading" data-motion-item><span>Starter 01</span><strong>Everyday rail set</strong></div>
            <dl>
              <div data-motion-item><dt>Rail</dt><dd>120 cm graphite</dd></div>
              <div data-motion-item><dt>Modules</dt><dd>Arc Dock + Pocket Tray</dd></div>
              <div data-motion-item><dt>Desk fit</dt><dd>18–42 mm edge · concept guide</dd></div>
              <div data-motion-item><dt>Compatibility</dt><dd>All System 01 modules</dd></div>
            </dl>
            <div className="starter-offer__action" data-motion-item><span><small>Concept total</small><strong>$427</strong></span><button type="button" onClick={() => scrollTo('#system')}>Configure this set <ArrowIcon /></button></div>
          </div>
        </section>

        <section className="shop-section" id="shop" aria-labelledby="shop-title" ref={shopRef}>
          <div className="section-heading">
            <div><span data-motion-overline>01 / Objects</span><MotionHeading id="shop-title" lines={['Attach only', 'what earns space.']} /></div>
            <div className="shop-tools">
              <p data-motion-copy>Three focused tools share one attachment grammar. Start with a finish; every module works on every rail span.</p>
              <fieldset className="finish-filter" data-motion-frame>
                <legend>Selected order finish</legend>
                <label><input type="radio" name="shop-finish" checked={finish === 'graphite'} onChange={() => setFinish('graphite')} /><i className="finish-swatch finish-swatch--graphite" />Graphite</label>
                <label><input type="radio" name="shop-finish" checked={finish === 'silver'} onChange={() => setFinish('silver')} /><i className="finish-swatch finish-swatch--silver" />Warm silver</label>
              </fieldset>
            </div>
          </div>
          <div className="product-grid" data-motion-group>
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                finish={finish}
                detailOpen={selectedProduct?.id === product.id}
                transitionActive={transitionProductId === product.id}
                onAdd={addProduct}
                onOpen={openProduct}
              />
            ))}
          </div>
        </section>

        <SystemBuilder onAdd={addConfiguration} />

        <section className="materials-section" id="materials" aria-labelledby="materials-title" ref={materialsRef}>
          <div className="materials-copy">
            <span data-motion-overline>02 / Material logic</span>
            <MotionHeading id="materials-title" lines={['Made to be touched.', 'Built to come apart.']} />
            <p data-motion-copy>DOVEL is a fictional material study in bead-blasted aluminum and pale ash. The attachment foot remains visible, so the system reads as assembled—not sealed shut.</p>
            <dl data-motion-group>
              <div data-motion-item><dt>01</dt><dd><strong>Anodized shell</strong><span>Graphite or warm silver aluminum</span></dd></div>
              <div data-motion-item><dt>02</dt><dd><strong>Mechanical seat</strong><span>Module foot locks into one shared rail slot</span></dd></div>
              <div data-motion-item><dt>03</dt><dd><strong>Ash insert</strong><span>Used only where a warmer touch surface helps</span></dd></div>
            </dl>
          </div>
          <div className="material-study" data-motion-frame data-motion-group data-motion-group-delay="0.16">
            <article className="material-proof material-proof--silver" data-motion-item><i /><span>Finish 01</span><strong>Warm silver aluminum</strong><p>Soft satin surface for lower visual contrast.</p></article>
            <article className="material-proof material-proof--graphite" data-motion-item><i /><span>Finish 02</span><strong>Graphite aluminum</strong><p>Quiet, low-reflection finish around screens.</p></article>
            <article className="material-proof material-proof--joint" data-motion-item>
              <div className="joint-detail" aria-hidden="true"><i /><b /></div>
              <span>Mechanical detail</span><strong>One visible seat.</strong><p>The vermilion latch marks where a module leaves the rail for service or rearrangement.</p>
            </article>
          </div>
        </section>

        <section className="journal-section" id="journal" aria-labelledby="journal-title" ref={journalRef}>
          <div className="journal-heading"><span data-motion-overline>03 / Field notes</span><MotionHeading id="journal-title" lines={['Why the edge', 'changes the middle.']} /></div>
          <div className="journal-list" data-motion-rule data-motion-group>
            <article data-motion-item><span>Note 01 · 6 min</span><h3>Designing a desk from its least-used line</h3><p>The front edge is close enough to reach and quiet enough to become infrastructure.</p><a href="#system">Open the system study <ArrowIcon /></a></article>
            <article data-motion-item><span>Note 02 · 4 min</span><h3>Three modules, one mechanical sentence</h3><p>Shared attachment geometry keeps new objects from becoming new clutter.</p><a href="#materials">Read the material logic <ArrowIcon /></a></article>
          </div>
        </section>
      </main>
      <SiteFooter />

      <SearchDialog open={searchOpen} onClose={closeSearch} onSelectProduct={openProductFromSearch} />
      <ProductDetailDialog
        product={selectedProduct}
        finish={finish}
        transitionActive={transitionProductId === selectedProduct?.id}
        onFinishChange={setFinish}
        onClose={closeProduct}
        onAdd={addProduct}
      />
      <CartDrawer
        open={cartOpen}
        items={commerce.cart}
        subtotal={commerce.subtotal}
        onClose={closeCart}
        onSetQuantity={commerce.setQuantity}
        onRemove={commerce.removeItem}
      />
    </div>
  )
}

export default App
