import { useId, useMemo, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { cn } from '../../../utils/cn'
import type { IBoardMember } from '../../../features/pulselane/types'

interface IMemberComboboxProps {
  value: string
  members: IBoardMember[]
  placeholder?: string
  onChange: (value: string) => void
}

export const MemberCombobox = ({ value, members, placeholder, onChange }: IMemberComboboxProps) => {
  const listboxId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filteredMembers = useMemo(() => {
    const query = searchValue.trim().toLocaleLowerCase()
    if (!query) {
      return members
    }

    return members.filter((member) => member.name.toLocaleLowerCase().includes(query))
  }, [members, searchValue])

  const hasExactMatch = members.some((member) => member.name.toLocaleLowerCase() === value.trim().toLocaleLowerCase())

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={isOpen ? searchValue : value}
          onFocus={() => {
            setIsOpen(true)
            setSearchValue('')
            setActiveIndex(0)
          }}
          onChange={(event) => {
            setIsOpen(true)
            setSearchValue(event.target.value)
            setActiveIndex(0)
            onChange(event.target.value)
          }}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
              return
            }

            if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
              setIsOpen(true)
              setSearchValue('')
              setActiveIndex(0)
              return
            }

            if (!filteredMembers.length) {
              return
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActiveIndex((current) => (current + 1) % filteredMembers.length)
              return
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((current) => (current - 1 + filteredMembers.length) % filteredMembers.length)
              return
            }

            if (event.key === 'Enter' && isOpen) {
              const activeMember = filteredMembers[activeIndex]
              if (activeMember) {
                event.preventDefault()
                onChange(activeMember.name)
                setSearchValue('')
                setIsOpen(false)
              }
            }
          }}
          placeholder={placeholder}
          aria-label="Owner"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={isOpen && filteredMembers[activeIndex] ? `${listboxId}-${filteredMembers[activeIndex].id}` : undefined}
          className="pr-16 pl-9"
        />
        <div className="absolute inset-y-0 right-2 z-10 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            type="button"
            aria-label="Clear owner"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange('')
              setSearchValue('')
              setIsOpen(true)
              setActiveIndex(0)
            }}
          >
            <X className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            type="button"
            aria-label="Toggle owner suggestions"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setIsOpen((current) => !current)
              setSearchValue('')
              setActiveIndex(0)
            }}
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          {filteredMembers.length > 0 ? (
            <div className="max-h-56 overflow-y-auto p-1">
              {filteredMembers.map((member) => {
                const isSelected = member.name === value
                const isActive = filteredMembers[activeIndex]?.id === member.id

                return (
                  <button
                    id={`${listboxId}-${member.id}`}
                    key={member.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'relative flex w-full items-center gap-2 rounded-sm px-2 py-1.5 pr-8 text-left text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground',
                      (isSelected || isActive) && 'bg-accent text-accent-foreground',
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(filteredMembers.findIndex((entry) => entry.id === member.id))}
                    onClick={() => {
                      onChange(member.name)
                      setSearchValue('')
                      setIsOpen(false)
                    }}
                  >
                    <span>{member.name}</span>
                    {isSelected ? <Check className="absolute right-2 size-4 text-brand" /> : null}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted">No matching members yet.</div>
          )}

          {!hasExactMatch && value.trim() ? (
            <button
              type="button"
              className="flex w-full items-center justify-between border-t border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(value.trim())
                setSearchValue('')
                setIsOpen(false)
              }}
            >
              <span>
                Use <span className="font-medium text-foreground">{value.trim()}</span>
              </span>
              <Check className="size-4 text-brand" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
