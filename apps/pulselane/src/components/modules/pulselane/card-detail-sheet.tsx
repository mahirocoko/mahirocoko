import { useEffect, type CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
} from '../../ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { cn } from '../../../utils/cn'

import type { BoardCard, BoardColumn } from '../../../features/pulselane/types'
import type { IDraftCardEditor } from './ui-types'

const cardSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  owner: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string(),
})

interface ICardDetailProps {
  card: BoardCard
  column: BoardColumn | null
  draft: IDraftCardEditor
  onClose: () => void
  onSave: (draft: IDraftCardEditor) => void
  onDelete: () => void
}

const formatRelativeTime = (timestamp: number) => {
  const deltaSeconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000))
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`
  if (deltaSeconds < 3600) return `${Math.round(deltaSeconds / 60)}m ago`
  return `${Math.round(deltaSeconds / 3600)}h ago`
}

export const CardDetailSheet = ({
  card,
  column,
  draft,
  onClose,
  onSave,
  onDelete,
}: ICardDetailProps) => {
  const form = useForm<IDraftCardEditor>({
    resolver: zodResolver(cardSchema),
    defaultValues: draft,
  })

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset(draft)
    }
  }, [card.id, card.updatedAt, draft, form])

  const onSubmit = (data: IDraftCardEditor) => {
    onSave(data)
  }

  return (
    <>
      <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-md" onClick={onClose} />
      <aside className="fixed right-4 top-4 z-30 h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-surface/90 p-5 animate-[drawer-enter_0.2s_ease-out] backdrop-blur-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Card detail</p>
            <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
            {column ? (
              <span
                className="mt-2 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--column-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--column-accent)_14%,transparent)] px-2.5 py-0.5 text-xs font-medium text-foreground"
                style={{ '--column-accent': column.accent } as CSSProperties}
              >
                {column.title}
              </span>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FieldGroup>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <Field>
                    <FieldContent>
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FieldDescription>Keep it short and action-oriented.</FieldDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <Field>
                    <FieldContent>
                      <FormItem>
                        <FormLabel>Owner</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Lina" />
                        </FormControl>
                        <FieldDescription>Leave blank if the next owner is still unclear.</FieldDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Field>
                    <FieldContent>
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldDescription>Use priority to clarify urgency for the next handoff.</FieldDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Field>
                    <FieldContent>
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            {...field}
                            placeholder="Add context, links, or handoff notes."
                          />
                        </FormControl>
                        <FieldDescription>Capture references, blockers, or the exact next move.</FieldDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="my-6 flex items-center justify-between text-[13px] text-muted">
              <span>Updated {formatRelativeTime(card.updatedAt)}</span>
              <span
                className={cn('inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium', {
                  'text-foreground': card.priority === 'high',
                  'text-muted-foreground': card.priority === 'medium',
                  'text-muted': card.priority === 'low',
                })}
              >
                {card.priority}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="destructive" type="button" className="flex-1" onClick={onDelete}>
                Delete card
              </Button>
              <Button variant="default" type="submit" className="flex-1">
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </aside>
    </>
  )
}
