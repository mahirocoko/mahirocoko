import { useState } from 'react'
import { Check, Settings2, Trash2, UserPlus, Users } from 'lucide-react'

import { Button } from '../../ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '../../ui/field'
import { Input } from '../../ui/input'
import type { BoardDocument } from '../../../features/pulselane/types'
import { ConfirmActionButton } from './confirm-action-button'

interface IMemberManagerSheetProps {
  board: BoardDocument
  onClose: () => void
  onAddMember: (name: string) => void
  onUpdateMember: (memberId: string, name: string) => void
  onRemoveMember: (memberId: string) => void
}

export const MemberManagerSheet = ({
  board,
  onClose,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}: IMemberManagerSheetProps) => {
  const [newMemberName, setNewMemberName] = useState('')

  return (
    <>
      <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-md" onClick={onClose} />
      <aside className="fixed right-4 top-4 z-30 h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-surface/90 p-5 backdrop-blur-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Members</p>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="size-4 text-brand" />
              Manage assignees
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
                  <FieldLabel htmlFor="new-member-name">Add member</FieldLabel>
                  <Input
                    id="new-member-name"
                    value={newMemberName}
                    onChange={(event) => setNewMemberName(event.target.value)}
                    placeholder="Lina"
                  />
                  <FieldDescription>Members appear in the assign combobox instantly.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  if (!newMemberName.trim()) return
                  onAddMember(newMemberName)
                  setNewMemberName('')
                }}
              >
                <UserPlus className="size-4" />
                Add member
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            {board.members.map((member) => {
              const assignmentCount = board.cards.filter((card) => card.owner === member.name).length

              return (
                <form
                  key={member.id}
                  className="grid gap-2 rounded-lg border border-border bg-popover p-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    const name = String(formData.get('name') ?? '')
                    onUpdateMember(member.id, name)
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted">{assignmentCount} assigned card{assignmentCount === 1 ? '' : 's'}</p>
                    </div>
                    <Settings2 className="size-4 text-muted" />
                  </div>
                  <Input name="name" defaultValue={member.name} />
                  <div className="flex justify-end gap-2">
                    <ConfirmActionButton
                      trigger={
                        <>
                          <Trash2 className="size-4" />
                          Remove
                        </>
                      }
                      title="Remove member"
                      description={`This removes ${member.name} from the member list and clears that member from any assigned cards.`}
                      actionLabel="Remove"
                      onConfirm={() => onRemoveMember(member.id)}
                      triggerVariant="destructive"
                      triggerSize="sm"
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
