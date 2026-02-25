# Learning: Reusable-First Component Workflow in Pencil

## Pattern
When the goal is implementation-ready component systems, treat visuals and reusability as separate milestones.

1) Build or prepare a reusable asset lane (nodes with `reusable: true` and stable naming).  
2) Validate discoverability in editor reusable list.  
3) Replace showcase examples with `ref` instances from those assets.  
4) Only then refine visual arrangement/state documentation.

## Why It Matters
Polished static frames can look complete while still failing the core workflow requirement. The practical signal of success is not “looks right,” but “can be instantiated and reused consistently.”

## Apply Next Time
- Start every component session with an explicit “asset vs showcase” split.  
- Prove one working instance early before scaling variants/states.  
- Use naming conventions that encode variant/size/state directly to reduce ambiguity.
