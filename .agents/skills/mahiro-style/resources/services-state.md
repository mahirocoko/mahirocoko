# Services and State

## Service boundaries

- API intent belongs in services
- Screens should consume service outputs, not build transport details inline
- Reuse base transport patterns when the repo already has them

## State boundaries

- Server state belongs in query layers
- Client state belongs in stores or local component state
- Avoid mixing long-lived app state with transient screen rendering concerns

## Provider placement

- Global providers belong at app shell level
- Feature-level providers should exist only when the scope is truly local to that feature

## Review cues

- Did screen code start owning transport logic?
- Did a store become a dumping ground for unrelated UI details?
- Did service logic leak into reusable components?
