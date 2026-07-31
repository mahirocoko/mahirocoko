import { ARCHITECTURE_URL, REPO_URL, SETUP_URL } from '@/content'
import { ArrowUpRightIcon } from '@/components/icons'

const footerLinks = [
  { href: '#features', label: 'Features', external: false },
  { href: REPO_URL, label: 'Source', external: true },
  { href: SETUP_URL, label: 'Setup guide', external: true },
  { href: ARCHITECTURE_URL, label: 'Architecture', external: true },
  { href: '#privacy', label: 'Privacy', external: false },
]

export function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-6 px-5 py-10 md:flex-row md:justify-between md:px-8">
        <p className="text-sm text-neutral-500">
          © 2026 Agent Halo. A personal, local-first project.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="rounded text-sm text-neutral-500 transition-colors hover:text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Follow on GitHub
          <ArrowUpRightIcon className="size-3.5" />
        </a>
      </div>
    </footer>
  )
}
