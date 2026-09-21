import { SiteFooter, SiteHeader } from './site-chrome'
import { SiteHero } from './site-hero'
import { AuditSection, BladeProof, ColorSection } from './site-story'
import { BoundarySection, FaqSection, FinalCta, LifecycleSection, RecipeSection } from './site-plan'
import './website.css'

export const WebsitePage = () => {
  return (
    <div className="site">
      <SiteHeader />
      <main className="site__main">
        <SiteHero />
        <BladeProof />
        <AuditSection />
        <ColorSection />
        <RecipeSection />
        <LifecycleSection />
        <BoundarySection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
