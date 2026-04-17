# Learning Note

## Title
Execution discipline should live beside reliability guardrails, not inside them.

## Tags
- policy
- claude-md
- reliability
- execution-discipline
- retrospectives

## Summary
When importing Karpathy-style coding guidance into a local Claude instruction file, the right move is to keep it as a separate execution layer rather than folding it into truth-and-evidence rules. Reliability guardrails answer whether a claim is grounded; execution discipline answers how to act, how much to change, and when to stop. Co-locating them in one file is useful, but flattening them into one undifferentiated list weakens both.

## Lesson
Instruction systems benefit from layer clarity. If a rule is about evidence, citations, uncertainty, and verification, it belongs in a reliability layer. If a rule is about scope control, small diffs, local style matching, reversibility, or anti-overengineering, it belongs in an execution layer. This distinction makes policy easier to remember, easier to extend, and less likely to create prompt dilution.

## Reuse Trigger
Use this pattern again when evaluating external prompt packs, skill files, or agent doctrines that seem appealing but overlap with existing instructions. Before merging, sort the candidate rules by function and only import the ones that fill a real gap.
