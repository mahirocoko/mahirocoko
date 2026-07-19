import { AgentMode } from './components/agent-mode'
import { ClosingSection } from './components/closing-section'
import { FieldNotes } from './components/field-notes'
import { GlassHeader } from './components/glass-header'
import { HeroSection } from './components/hero-section'
import { HotkeySection } from './components/hotkey-section'
import { PricingSection } from './components/pricing-section'
import { PrivacySection } from './components/privacy-section'
import { SiteFooter } from './components/site-footer'
import { TimeSavings } from './components/time-savings'
import { WritingSection } from './components/writing-section'

const App = () => (
  <div className="app-shell">
    <GlassHeader />
    <div className="page-content">
      <main>
        <HeroSection />
        <TimeSavings />
        <AgentMode />
        <WritingSection />
        <PrivacySection />
        <FieldNotes />
        <PricingSection />
        <HotkeySection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </div>
  </div>
)

export { App }
