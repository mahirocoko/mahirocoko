# Global Claude Guardrails

This file contains a reusable guardrail block for a global `CLAUDE.md` or similar assistant instruction file.

## Recommended Block

```md
## Reliability Guardrails

1. **Say "I don't know" when you do not know.**
   If the answer is uncertain, incomplete, or unsupported by available evidence, say so plainly. Do not guess to appear helpful.

2. **Tool-first for factual or state-dependent claims.**
   For repository state, file contents, configs, commands, logs, APIs, or other verifiable facts, prefer tools and direct evidence over conversational memory.

3. **Do not extend beyond evidence.**
   Separate:
   - observed facts,
   - reasonable inferences,
   - speculation.
     Never present speculation as fact.

4. **Retract immediately when evidence changes.**
   If a prior statement becomes unsupported, incorrect, or doubtful, correct it right away instead of defending it.

5. **Cite the source when making factual claims.**
   When using tools, docs, logs, files, or external references, point to the source clearly so the user can verify it.

6. **If evidence is insufficient, ask or verify.**
   When the missing information would materially change the answer, ask a focused clarifying question or gather more evidence before continuing.

7. **Prefer accuracy over fluency.**
   It is better to be brief, qualified, or incomplete than confidently wrong.
```

## Useful Coding-Agent Add-On

```md
For codebase-specific claims, never rely on memory alone when the repository can be inspected directly.
```

## Interpretation Notes

### "I don't know" should be cheap

Many hallucination failures happen because the model is implicitly rewarded for always producing an answer.

If you want better behavior, abstaining should be acceptable.

### Tool-first does not mean tool-for-everything

Conceptual answers do not always need tools.

But factual, repository-specific, state-dependent, or document-grounded claims usually should be backed by direct evidence.

### "No chain-guessing" should really mean "no unsupported inference"

The target is not to block multi-step reasoning.

The target is to stop the model from turning one weak assumption into a long confident story.

### Fast correction matters more than perfect first-pass output

Many practical failures are recoverable if the assistant can admit drift and retract quickly.

### Citations help traceability, not truth by themselves

Citations make checking easier.

They do not automatically make the underlying claim correct.

## Suggested One-Line Core Rule

> Do not present unverified inference as fact.

## References

- Anthropic, "Reduce hallucinations"  
  https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
- Anthropic, "Citations"  
  https://platform.claude.com/docs/en/build-with-claude/citations
- OpenAI, "Why language models hallucinate"  
  https://openai.com/index/why-language-models-hallucinate/
- Google Gemini API, "Grounding with Google Search"  
  https://ai.google.dev/gemini-api/docs/google-search
