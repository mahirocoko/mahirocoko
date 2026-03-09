# Review Checklist

## Intent

Use this page as a practical review lens for AI-written code and refactors.

Its job is to catch two kinds of drift on a diff:

- repo-rule drift: the change ignores local doctrine or stable repo patterns
- Mahiro-shape drift: the change technically works but becomes thicker, vaguer, or less deliberate than the repo needs

Review this page against the actual diff. Do not treat it as a philosophy summary.

## Review Order

Always review in this winner order before making style judgments:

1. `AGENTS.md`
2. Other repo-local instruction files such as `CLAUDE.md`
3. Established repo patterns
4. Mahiro fallback doctrine

If a diff feels wrong, first identify which layer it violates. Do not jump straight to Mahiro taste when the repo already decided the rule.

## Non-negotiable

- Check the diff against the exact four-level precedence order: `AGENTS.md` -> other repo-local instruction files -> established repo patterns -> Mahiro fallback doctrine.
- Reject reviews that treat Mahiro fallback doctrine as stronger than explicit local doctrine or repeated repo shape.
- Flag route or screen files that grow into mixed ownership modules containing orchestration, domain contracts, config, helper maps, mock data, and rendering in one place.
- Flag extracted constants or config if the move weakens translation posture, especially in repos that already use Lingui or another explicit i18n flow.
- Flag naming that hides domain meaning behind vague buckets such as `data`, `items`, `list`, `meta`, or `config` when the business concept can be named directly.
- Flag shared UI changes that absorb page-specific business rules just to reduce line count in a route or feature file.

## Preference

- Start review comments with the winning rule source: local doc, repeated repo pattern, or Mahiro fallback.
- Prefer comments that name the ownership problem directly, such as route thickness, naming drift, contract leakage, or i18n-boundary breakage.
- Prefer refactors that make the next edit location more obvious, not just files that are smaller.
- Prefer domain-owned constants, services, hooks, and components over convenience extractions into generic shared buckets.
- Prefer owner-local data when the extracted constants or compose props do not buy meaningful reuse or clarity.
- Prefer review comments that compare the diff against repeated repo examples instead of isolated one-off files.

## Contextual

Apply the same review order everywhere, but let the local repo decide the winning shape.

### Repo-rule drift prompts

- What does `AGENTS.md` say about this exact concern?
- If `AGENTS.md` is silent, do other repo-local instruction files narrow the choice?
- If local docs are partial, does the active codebase repeat one stable pattern three or more times?
- Is this diff following a migration leftover or an actually repeated current pattern?
- Am I about to request a Mahiro-style cleanup before proving that the repo has not already chosen a different rule?

### Mahiro-shape drift prompts

- Did the route or screen get thinner and more orchestration-focused after the refactor, or did it just move code around?
- Did the change separate ownership cleanly between routes, components, hooks, services, stores, and constants?
- Did naming become more domain-specific and contract-aware, or more generic?
- If contracts or config moved, do they now live in a clearer domain home?
- Did the diff extract constants or parent-owned props only to reduce line count, even though the child component was the real owner?
- If copy moved into constants, is the result still aligned with the repo's Lingui or translation posture?
- Did reusable UI stay generic, or did business logic leak into shared components?

### Real review themes to keep active

- Route thickness: route files should orchestrate, not become giant domain dumps.
- Lingui and constants posture: extraction is only a win if translation-safe behavior stays intact.
- Naming and contracts: names should reveal business meaning, and contracts should live with clear owners.
- Repo-local doctrine first: check local rules before asking for fallback Mahiro cleanup.
- Owner-local versus shared extraction: if a layout child or feature child is the only consumer, prefer keeping the data and translation close to that owner.

## Examples

- "`AGENTS.md` says routes stay thin, but this diff moves view config, route metadata, and rendering back into the route entry file. Keep orchestration in the route and move owned data back to a domain file." 
- "The repo already repeats `useLingui` and render-boundary translation. This constants extraction introduces plain string blobs without preserving that posture. Keep the extraction, but preserve the repo's i18n boundary." 
- "`UserList` and `employeeRows` are clearer than `data` and `items` here because the diff is shaping domain contracts, not generic collections." 
- "This shared component now knows page-specific approval rules. Keep the reusable shell generic and move the approval logic back to the feature-owned layer." 
- "No local doc covers this exact hook split, but the repo repeatedly keeps query hooks near feature services. Review against that repeated pattern before applying Mahiro fallback taste." 

## Anti-Examples

- "Mahiro usually prefers this" without first checking `AGENTS.md`, other local docs, or repeated repo patterns.
- Approving a refactor because the biggest file got shorter even though ownership became more confusing.
- Praising constants extraction while ignoring that the diff broke Lingui-safe or translation-safe flow.
- Asking for generic reuse when the extracted component now carries route-specific business rules.
- Accepting vague names such as `config`, `items`, or `data` when the domain contract is already known.
- Treating anti-pattern guidance as a separate source to go read later instead of catching the drift directly in this review.
