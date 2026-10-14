# UI improvement lab

Task: T140. Status: runnable foundation candidate; live review and human acceptance
pending. No improvement result, injected defects, or treatment arms yet.

## Run the foundation locally

No dependencies or build step are required. From the repository root, run this in
an authorized visible project-owned Herdr terminal:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/frontend-labs/ui-improvement-lab
```

Open `http://127.0.0.1:4173`. Stop the server with Ctrl-C. The implementation worker
did not start a server or browser. The page is an in-memory configuration study,
not checkout: span and module selection update its concept USD total; finish changes
its descriptive note; Details disclosures and Reset are functional.

The candidate adapts DOVEL's configurator taxonomy, prices, initial selection,
warm-paper/graphite materials, numbered sections, and compact module-row structure.
It does not reproduce the source's media, motion, or commerce flow. The long Pocket
Tray label is deliberately expanded for wrapping review, not a new product claim.
Controller-only provenance and experiment limits live in `controller-evidence.txt`,
which is not linked or rendered in the visitor interface. Like all files in this
static folder, it is reachable by URL; this is procedural separation, not security.

Before freezing anything, review desktop and narrow layouts, long labels, native
select menus, keyboard focus/activation, selection/count/total, Details open/closed,
and Reset after edits. Source/static checks are not rendered or visual acceptance.

## Foundation verification checkpoint

Independent headless Chrome QA inspected 1440, 390, and 320px widths. It found no
horizontal overflow or module-row collisions in those states, but discovered a
real Reset failure missed by the implementation's DOM-stub checks: native controls
restored while the derived total and description remained stale.

The reset callback now recalculates in a subsequent task instead of a microtask.
A fresh independent rendered regression report confirms pointer and keyboard Reset
restore controls, total ($427), summary, finish note, and closed disclosures, with
zero console errors/warnings. The QA session saved its report and screenshot before
a provider error prevented its final chat response; Main recovered both artifacts
and inspected the screenshot. This is a foundation bug repair, not a successful
experimental arm or evidence of improvement. Native select popup keyboard behavior
and human visual acceptance remain unverified.

## Question

Can actively applying Mahiro's existing UI lessons reduce recurring mistakes on
new surfaces without requiring Mahiro to repeat those lessons?

The first experiment concerns spacing, alignment, and competing trailing controls.
It is not a whole-product taste benchmark or proof that model weights have learned.

## Foundation first

Reuse a reproducible, human-accepted source where its acceptance can be established.
An adapted or newly assembled surface still needs a live rendered baseline review.
Do not inject defects into an unaccepted generic page and reward the largest redesign.
Preserve existing applications; all experimental writes belong to this directory.

The controller selects the foundation from existing repository evidence. No source
has been frozen yet. Historical acceptance alone does not approve a new composition.

## Small experiment

1. Select three existing correction examples with before/after evidence and clearly
   distinguish human acceptance from technical QA. Missing artifacts remain missing.
2. Prepare one runnable foundation for human inspection of desktop/mobile and actual
   interactions. Freeze its files and hashes only after acceptance is established.
3. Create three bounded repair cases, one defect family per case, and keep the
   diagnosis and reference repair separate from writer inputs.
4. Run fresh baseline and intervention sessions serially with the same model,
   reasoning effort, task prompt, starting files, tool access, and work budget.
   The intervention is a small explicit packet of existing examples plus their
   pre-write application procedure. Do not add an unrelated skill bundle.
5. Have an independent tester check the actual rendered outcomes. Main inspects
   returned images and evidence. Show anonymously labelled results to Mahiro.
6. Test a new small implementation task without an injected bug to distinguish
   preventing mistakes from repairing a known broken surface.

## Honest comparison

Fresh Letta sessions may inherit common memory and skills. This is not a comparison
against an untrained or memory-free model. Record what each session could access;
measure the incremental effect of explicit example application over that baseline.
Do not claim blindness when the writer has read the controller's answer key. Separate
writer roots and briefs are procedural isolation, not a filesystem security boundary.
If input isolation cannot be established, report a non-blind pilot instead.

Freeze the brief, model/effort, input hashes, intervention packet, time budget, and
grading criteria before dispatch. Record actual invocation and edits, not merely
intended routing. Never change a threshold after seeing which arm wins.

Three cases provide exploratory evidence, not statistical proof or durable transfer.
Apply any successful technique to subsequent real work before calling it adopted.

## Evidence that matters

- Recurring defects still visible when handed to Mahiro.
- Repair correctness at desktop and narrow widths, with long labels and open states.
- Unnecessary edits to accepted geometry, content, colors, behavior, or assets.
- Initial and post-interaction console errors and relevant warnings.
- Writer/QA elapsed effort and human correction rounds, recorded separately.
- Mahiro's visual preference; technical checks cannot assign it.

A repair is not successful if it hides or removes the control, truncates essential
information, disables the interaction, or redesigns the accepted surface to avoid
the defect. Use source-specific geometry, not universal gap/radius numbers.

## Boundaries

No production-project edits, global memory/skill changes, model configuration
changes, commits, publication, or image generation. Use one writer and one headless
QA browser at a time. Run any server in a visible project-owned Herdr terminal,
reusing an existing matching service where possible. Keep temporary browser evidence
in an ignored workspace-owned directory.

## Existing lesson source

- `../../../docs/research/2026-10-10-frontend-recurring-mistakes.md`

That research contains useful failure families and a source-review pilot. It does
not establish pre-write prevention or general effectiveness on unseen tasks.
