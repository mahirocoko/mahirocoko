import { useState } from 'react'
import { Check, Settings2, Trash2, UserPlus, Users } from 'lucide-react'

import { Button } from '../../ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '../../ui/field'
import { Input } from '../../ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../ui/sheet'
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
    <Sheet open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="gap-0 bg-surface/95 p-0 backdrop-blur-xl sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Members</p>
          <SheetTitle className="flex items-center gap-2 text-lg">
              <Users className="size-4 text-brand" />
              Manage assignees
          </SheetTitle>
          <SheetDescription>Curate reusable assignees for the board and keep assignment fast.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 overflow-y-auto p-5">
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
      </SheetContent>
    </Sheet>
  )
}
