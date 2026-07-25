# ReadLead discovery docs and Raindrop plan-gate lesson

**Date**: 2026-07-25  
**Tags**: `client-discovery`, `ai-translation`, `architecture`, `raindrop`, `taxonomy`, `scope`

## Durable lesson
For an AI reading/translation product, do not lead the client conversation with framework names or a single provider choice. First establish source-site scope, content rights, required language direction, acceptable translation quality, glossary behavior, and whether the service sells managed credits or supports BYOK. Those answers determine extraction architecture, data retention, job queue behavior, model benchmark criteria, payment flow, and unit economics.

Keep client-facing deliverables separated: the proposal owns MVP boundaries, milestones, exclusions, and responsibilities; the technical scope owns workers, segment/revision data, provider adapters, token settlement, and risk controls; a short discovery guide owns conversational questions and plain-language risk framing.

When a Raindrop bookmark action returns a duplicate without collection context, do not guess an ID or abandon organization. Use the authorized read-only recollection snapshot to inspect the sanitized collection tree and bookmark identity, create a narrowly bounded proposal plan, and preserve the human-only apply gate for creates/moves. Also resolve vague follow-ups such as “put it in a category” against the most recent external action, not merely the most recent file edit.
