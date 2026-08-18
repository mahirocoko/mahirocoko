import { Closing } from './components/closing'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { Hero } from './components/hero'
import { Journey } from './components/journey'

const App = () => (
  <>
    <a className="skip-link" href="#main">ข้ามไปยังเนื้อหาหลัก</a>
    <Header />
    <main id="main">
      <Hero />
      <Journey />
      <Closing />
    </main>
    <Footer />
  </>
)

export { App }
