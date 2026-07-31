import { useEffect, useRef, useState } from 'react'
import { REPO_URL } from '@/content'
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from '@/components/icons'

const navLinks = [
  { href: '#preview', label: 'Preview' },
  { href: '#features', label: 'Features' },
  { href: '#rituals', label: 'Focus rituals' },
  { href: '#privacy', label: 'Local-first' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <img
            src="/assets/agent-halo-app-icon-256.png"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-lg"
          />
          <span className="text-[17px] font-semibold tracking-tight text-neutral-900">
            Agent Halo
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            View source
            <ArrowUpRightIcon className="size-4" />
          </a>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:hidden"
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="mx-4 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-neutral-900/10 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-neutral-100 pt-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-base font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                View source
                <ArrowUpRightIcon className="size-4" />
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
