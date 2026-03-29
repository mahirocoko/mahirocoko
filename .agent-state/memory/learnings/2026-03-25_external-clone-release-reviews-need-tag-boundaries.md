# External clone release reviews need tag boundaries

When reviewing upstream changes from a local learn clone, separate the tagged release boundary from the current branch head before summarizing. A repo can already be ahead of the newest tag, so reliable changelog work means distinguishing `vX.Y.Z..vX.Y.Z+1` from whatever landed on `dev` after the release.

Even a very short session is worth preserving when the meaningful state change happens outside the current repository. The retrospective and learning note become the durable artifact that explains why an external clone was refreshed and what mattered in the upstream update.
