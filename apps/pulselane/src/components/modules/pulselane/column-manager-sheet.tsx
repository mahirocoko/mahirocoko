import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Columns3, Plus, Trash2 } from 'lucide-react'

import { Button } from '../../ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '../../ui/field'
import { Input } from '../../ui/input'
import type { BoardColumn, BoardDocument } from '../../../features/pulselane/types'
import { ConfirmActionButton } from './confirm-action-button'

interface IColumnManagerSheetProps {
  board: BoardDocument
  onClose: () => void
  onAddColumn: (title: string, accent: string) => void
  onUpdateColumn: (columnId: string, updates: Partial<Pick<BoardColumn, 'title' | 'accent'>>) => void
  onMoveColumn: (columnId: string, direction: -1 | 1) => void
  onRemoveColumn: (columnId: string) => void
}

export const ColumnManagerSheet = ({
  board,
  onClose,
  onAddColumn,
  onUpdateColumn,
  onMoveColumn,
  onRemoveColumn,
}: IColumnManagerSheetProps) => {
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [newColumnAccent, setNewColumnAccent] = useState('#7170ff')

  return (
    <>
      <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-md" onClick={onClose} />
      <aside className="fixed right-4 top-4 z-30 h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-surface/90 p-5 backdrop-blur-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Columns</p>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Columns3 className="size-4 text-brand" />
              Manage board lanes
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-popover p-3">
            <FieldGroup>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="new-column-title">Add column</FieldLabel>
                  <Input
                    id="new-column-title"
                    value={newColumnTitle}
                    onChange={(event) => setNewColumnTitle(event.target.value)}
                    placeholder="Blocked"
                  />
                  <FieldDescription>New columns appear at the far right of the board.</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="new-column-accent">Accent</FieldLabel>
                  <input
                    id="new-column-accent"
                    type="color"
                    value={newColumnAccent}
                    onChange={(event) => setNewColumnAccent(event.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-transparent p-1"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  if (!newColumnTitle.trim()) return
                  onAddColumn(newColumnTitle, newColumnAccent)
                  setNewColumnTitle('')
                  setNewColumnAccent('#7170ff')
                }}
              >
                <Plus className="size-4" />
                Add column
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            {board.columns.map((column, index) => {
              const cardCount = board.cards.filter((card) => card.columnId === column.id).length

              return (
                <form
                  key={column.id}
                  className="grid gap-2 rounded-lg border border-border bg-popover p-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    onUpdateColumn(column.id, {
                      title: String(formData.get('title') ?? ''),
                      accent: String(formData.get('accent') ?? column.accent),
                    })
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: column.accent }} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{column.title}</p>
                        <p className="text-xs text-muted">{cardCount} card{cardCount === 1 ? '' : 's'}</p>
                      </div>
                    </div>
                  </div>
                  <FieldGroup>
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor={`column-title-${column.id}`}>Column title</FieldLabel>
                        <Input id={`column-title-${column.id}`} name="title" defaultValue={column.title} />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor={`column-accent-${column.id}`}>Accent</FieldLabel>
                        <input
                          id={`column-accent-${column.id}`}
                          name="accent"
                          type="color"
                          defaultValue={column.accent}
                          className="h-9 w-full rounded-md border border-input bg-transparent p-1"
                        />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => onMoveColumn(column.id, -1)} disabled={index === 0}>
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={() => onMoveColumn(column.id, 1)} disabled={index === board.columns.length - 1}>
                      <ArrowRight className="size-4" />
                    </Button>
                    <ConfirmActionButton
                      trigger={<Trash2 className="size-4" />}
                      title="Remove column"
                      description={`This removes ${column.title} and moves its cards into a neighboring column.`}
                      actionLabel="Remove"
                      onConfirm={() => onRemoveColumn(column.id)}
                      triggerVariant="destructive"
                      triggerSize="sm"
                      disabled={board.columns.length <= 1}
                    />
                    <Button size="sm" type="submit">
                      <Check className="size-4" />
                      Save
                    </Button>
                  </div>
                </form>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}
