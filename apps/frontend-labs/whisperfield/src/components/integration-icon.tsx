import type { LucideIcon } from 'lucide-react'
import { CalendarDays, FileText, Mail, MessageCircle, Search } from 'lucide-react'
import figmaIcon from 'simple-icons/icons/figma.svg'
import githubIcon from 'simple-icons/icons/github.svg'
import gmailIcon from 'simple-icons/icons/gmail.svg'
import googleCalendarIcon from 'simple-icons/icons/googlecalendar.svg'
import linearIcon from 'simple-icons/icons/linear.svg'
import notionIcon from 'simple-icons/icons/notion.svg'
import type { IntegrationName } from '../constants/integrations'

interface IIntegrationIconProps {
  name: IntegrationName
  compact?: boolean
}

const BRAND_ICONS: Partial<Record<IntegrationName, { src: string; tone: string }>> = {
  Calendar: { src: googleCalendarIcon, tone: 'calendar' },
  Figma: { src: figmaIcon, tone: 'figma' },
  GitHub: { src: githubIcon, tone: 'github' },
  Gmail: { src: gmailIcon, tone: 'gmail' },
  Linear: { src: linearIcon, tone: 'linear' },
  Notion: { src: notionIcon, tone: 'notion' },
}

const GENERIC_ICONS: Partial<Record<IntegrationName, LucideIcon>> = {
  Mail,
  Messages: MessageCircle,
  Notes: FileText,
  Search,
}

const IntegrationIcon = ({ name, compact = false }: IIntegrationIconProps) => {
  const brand = BRAND_ICONS[name]
  const GenericIcon = GENERIC_ICONS[name] ?? CalendarDays

  return (
    <span className={`integration-icon integration-icon-${name.toLowerCase()} ${compact ? 'is-compact' : ''}`} title={name} aria-label={name}>
      {name === 'Whisperfield' ? <img src="/assets/generated/whisperfield-mark.svg" alt="" /> : brand ? <img src={brand.src} alt="" /> : <GenericIcon aria-hidden="true" />}
    </span>
  )
}

export { IntegrationIcon }
