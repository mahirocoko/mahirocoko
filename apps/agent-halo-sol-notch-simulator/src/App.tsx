import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NotchSimulator } from '@/components/NotchSimulator'
import { FeatureIndex } from '@/components/FeatureIndex'
import { ProofRows } from '@/components/ProofRows'
import { FinalCta } from '@/components/FinalCta'
import { Footer } from '@/components/Footer'

export function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <NotchSimulator />
        <FeatureIndex />
        <ProofRows />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
