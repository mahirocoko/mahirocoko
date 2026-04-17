import { Activity, Columns3, FileText, RotateCcw, Users } from 'lucide-react'

import { Button } from '../../ui/button'
import type { BoardDocument, ConnectionStatus } from '../../../features/pulselane/types'
import { cn } from '../../../utils/cn'
import { ConfirmActionButton } from './confirm-action-button'

interface IBoardSidebarProps {
  board: BoardDocument
  connectionStatus: ConnectionStatus
  lastSyncedAt: number | null
  documentPath: string
  onOpenMembers: () => void
  onOpenColumns: () => void
  onResetBoard: () => void
}

export const BoardSidebar = ({
  board,
  connectionStatus,
  lastSyncedAt,
  documentPath,
  onOpenMembers,
  onOpenColumns,
  onResetBoard,
}: IBoardSidebarProps) => {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:gap-4 lg:rounded-xl lg:border lg:border-border lg:bg-surface/80 lg:p-4">
      <div className="space-y-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Workspace</p>
        <h2 className="text-base font-semibold text-foreground">{board.title}</h2>
        <div className="flex items-center gap-2 text-xs text-muted">
          <FileText className="size-3.5" />
          <span className="font-mono">{documentPath}</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-popover p-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Activity className="size-3.5" />
            Status
          </span>
          <span className={cn('font-medium', {
            'text-brand': connectionStatus === 'live',
            'text-warning': ['connecting', 'reconnecting'].includes(connectionStatus),
            'text-error': connectionStatus === 'error',
            'text-muted': connectionStatus === 'idle',
          })}>
            {formatSidebarStatus(connectionStatus)}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border bg-background px-3 py-2">
            <div className="text-muted">Cards</div>
            <div className="mt-1 text-sm font-medium text-foreground">{board.cards.length}</div>
          </div>
          <div className="rounded-md border border-border bg-background px-3 py-2">
            <div className="text-muted">Columns</div>
            <div className="mt-1 text-sm font-medium text-foreground">{board.columns.length}</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">Synced {formatSidebarSyncTime(lastSyncedAt)}</p>
      </div>

      <div className="grid gap-2">
        <Button variant="outline" className="justify-start" onClick={onOpenMembers}>
          <Users className="size-4" />
          Manage members
        </Button>
        <Button variant="outline" className="justify-start" onClick={onOpenColumns}>
          <Columns3 className="size-4" />
          Manage columns
        </Button>
        <ConfirmActionButton
          trigger={
            <>
              <RotateCcw className="size-4" />
              Reset board
            </>
          }
          title="Reset board"
          description="This replaces the current board with a fresh starter board and removes your in-progress layout changes."
          actionLabel="Reset"
          onConfirm={onResetBoard}
          triggerVariant="ghost"
          triggerSize="default"
          className="justify-start"
          actionVariant="destructive"
        />
      </div>
    </aside>
  )
}

function formatSidebarStatus(status: ConnectionStatus) {
  switch (status) {
    case 'live':
      return 'Live'
    case 'connecting':
      return 'Connecting'
    case 'reconnecting':
      return 'Retrying'
    case 'error':
      return 'Error'
    default:
      return 'Idle'
  }
}

function formatSidebarSyncTime(timestamp: number | null) {
  if (!timestamp) return 'No sync yet'
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
