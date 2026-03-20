---
title: Intro to Large Language Models
source: YouTube - Andrej Karpathy (https://www.youtube.com/watch?v=zjkBMFhNj_g)
video_id: zjkBMFhNj_g
channel: Andrej Karpathy
published: 2023-11-23
duration: 59:48
created: 2026-03-20
transcribed_by: Gemini
gemini_conversation: https://gemini.google.com/app/91b9804dda9d0093
tags:
  - youtube
  - transcript
  - llm
  - ai
  - karpathy
---

# Intro to Large Language Models

## Why this matters

Karpathy frames an LLM as a practical computing artifact, not magic: a weights file plus runtime code, produced by expensive training and later shaped into an assistant through fine-tuning. The talk is especially useful because it connects training, inference, scaling laws, tool use, multimodality, and security risks in one mental model that stays accessible without becoming shallow.

## Key takeaways

- An LLM is easiest to reason about as two things: parameters and the code that runs them.
- Training is a lossy compression process over a large slice of internet text; inference is comparatively cheap.
- The next-token objective looks simple but forces the model to absorb broad world structure and textual form.
- Base models are document completers; assistant behavior comes from later fine-tuning on high-quality human-written conversations.
- RLHF is an optional extra stage that improves behavior by training on ranked outputs instead of only gold answers.
- Current systems increasingly extend beyond pure text by using tools, images, audio, memory, and external context.
- Future progress likely depends not only on bigger models, but also on better deliberate reasoning and system orchestration.
- Security becomes a first-class concern once LLMs act like operating systems that read from tools, files, and the web.

## Timestamped outline

- [00:00] Reframes the talk as a busy person's introduction and starts from the concrete question: what an LLM actually is.
- [00:20] Describes an LLM as two files in a directory: model weights and the code that executes them.
- [01:50] Uses Llama 2 70B to show scale: roughly 140 GB of parameters, yet runnable with surprisingly little code.
- [04:02] Explains training as compressing a large chunk of the internet into model parameters using massive GPU clusters.
- [06:47] Explains the core learning task: predict the next token, repeatedly, until knowledge and structure emerge in the weights.
- [09:02] Shows how the trained model "dreams" internet-like documents, including convincing but potentially fabricated details.
- [11:24] Notes that we understand transformer math, but not the internal semantics of billions of learned parameters.
- [14:16] Introduces fine-tuning: replace generic internet text with high-quality human Q&A so the model behaves like an assistant.
- [18:04] Distills the pipeline into pre-training for knowledge and fine-tuning for behavior.
- [21:14] Adds RLHF as a third stage based on humans ranking outputs rather than only writing ideal ones.
- [23:40] Positions the ecosystem: proprietary frontier models lead, open-weight models trail but improve quickly.
- [25:45] Covers scaling laws: more parameters and more data still produce smooth gains, with no obvious plateau in sight.
- [27:48] Highlights tool use as a capability unlock, enabling browsing, computation, coding, and delegated work.
- [33:35] Covers multimodality: models increasingly see, hear, and speak, not just autocomplete text.
- [35:05] Contrasts fast instinctive answering with slower deliberate reasoning as a future improvement path.
- [42:21] Proposes the "LLM OS" framing: the model becomes a kernel coordinating memory, disk, and tools via language.
- [45:57] Warns about new attack classes such as jailbreaking and prompt injection.
- [56:24] Describes data-poisoning and sleeper-agent style failures embedded during training.
- [59:27] Closes by framing LLMs as a major computing shift with real promise and equally real safety work ahead.

## Memorable framing

Karpathy's most useful simplification is that pre-training teaches a model about the world, while fine-tuning teaches it how to behave around humans. That split makes many later debates easier to parse: capability is not the same thing as alignment, and benchmark intelligence is not the same thing as reliable product behavior.

## Operational notes

- Gemini transcription succeeded and the conversation URL was captured.
- YouTube captions were available during the session and can be re-fetched with the `/watch` helper if needed.
- The current `save-learning.ts` helper appears broken because it references an undefined `SLUGS_FILE`, so this note was saved manually.

## Source links

- YouTube: https://www.youtube.com/watch?v=zjkBMFhNj_g
- Gemini conversation: https://gemini.google.com/app/91b9804dda9d0093
