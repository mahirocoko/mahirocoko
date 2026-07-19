import { Check } from 'lucide-react'
import { useState } from 'react'

const PRO_FEATURES = ['Dictation Mode', 'Agent Mode', 'Unlimited usage', 'Priority support']
const ENTERPRISE_FEATURES = ['Everything in Pro', 'Zero data retention', 'Visible boundaries', 'Local deployment']

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="wf-price-features">
    {items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}
  </ul>
)

const PricingSection = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const price = billing === 'annual' ? '$11.99' : '$29.99'

  return (
    <section className="wf-pricing" id="access">
      <div className="wf-pricing-inner">
        <header className="wf-pricing-header">
          <h2>Pricing</h2>
          <p>7-day fictional preview · no checkout.</p>
          <div className="wf-billing-toggle" role="group" aria-label="Billing period">
            <button type="button" aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Monthly</button>
            <button type="button" aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>Annual</button>
          </div>
        </header>
        <div className="wf-pricing-grid">
          <article className="wf-price-wrap is-highlighted">
            <div className="wf-price-card">
              <div className="wf-price-card-inner">
                <h3>Pro</h3>
                <p className="wf-price"><strong>{price}</strong><span>/per month</span></p>
                <small>{billing === 'annual' ? 'fictional annual rate' : 'fictional monthly rate'}</small>
                <p className="wf-price-description">For power users and professionals.</p>
                <span className="wf-price-limit">7-day free trial included</span>
                <FeatureList items={PRO_FEATURES} />
              </div>
            </div>
          </article>
          <article className="wf-price-wrap">
            <div className="wf-price-card">
              <div className="wf-price-card-inner">
                <h3>Enterprise</h3>
                <p className="wf-price"><strong>Custom</strong></p>
                <small>fictional organization plan</small>
                <p className="wf-price-description">For teams and organizations.</p>
                <span className="wf-price-limit">Tailored to your needs</span>
                <FeatureList items={ENTERPRISE_FEATURES} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export { PricingSection }
