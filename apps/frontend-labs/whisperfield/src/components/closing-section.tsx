import { MessageCircle, Search, Sparkles } from 'lucide-react'

const ClosingSection = () => (
  <section className="wf-closing">
    <div className="wf-closing-card">
      <img src="/assets/generated/closing-sky.webp" alt="" />
      <span className="wf-closing-wash" aria-hidden="true" />
      <div className="wf-closing-content">
        <h2>Could voice fit the way you already work?</h2>
        <p>Ask the tools you already use, or download the fictional preview pack and inspect the study yourself.</p>
        <span className="wf-closing-actions">
          <a href="https://chat.openai.com/?q=Review+Whisperfield+as+a+fictional+voice+workflow+frontend+study" target="_blank" rel="noopener noreferrer nofollow"><MessageCircle aria-hidden="true" />Ask ChatGPT</a>
          <a href="https://claude.ai/new?q=Review+Whisperfield+as+a+fictional+voice+workflow+frontend+study" target="_blank" rel="noopener noreferrer nofollow"><Sparkles aria-hidden="true" />Ask Claude</a>
          <a href="https://www.perplexity.ai/search?q=Review+Whisperfield+as+a+fictional+voice+workflow+frontend+study" target="_blank" rel="noopener noreferrer nofollow"><Search aria-hidden="true" />Ask Perplexity</a>
        </span>
      </div>
    </div>
  </section>
)

export { ClosingSection }
