# Lesson Learned: PulseLane Shell And Document Boundaries

## Tags
- pulselane
- shadcn
- realtime
- ux
- shell

## Summary
When a product shell starts mixing custom overlays, half-adopted design system patterns, and ad hoc state wiring, the cleanup cost compounds fast. The most effective path in this session was to pick a narrow architecture stance and finish it properly: keep members in the existing board document, move destructive actions onto confirm dialogs, move manager surfaces onto shared sheets, and migrate the shell toward a real sidebar block instead of another visual approximation.

## Durable Learnings
- “Close enough to shadcn” is not the same as “aligned with upstream structure,” and users who care about the distinction will keep finding the seams.
- Single-document realtime designs stay productive longer when the scope is intentionally constrained and you avoid introducing new documents too early.
- Transition bugs often come from missing utility support rather than component logic alone; confirm the CSS pipeline before over-debugging behavior.
- Shell UX should be finished as a connected system: sidebar, sheets, confirms, header, and keyboard flow all reinforce each other.

## Reuse Trigger
Use this lesson whenever a small realtime app starts growing manager surfaces, assignment flows, or admin-like controls but still wants to stay simple. Default to finishing one coherent shell rather than adding more isolated panels.
