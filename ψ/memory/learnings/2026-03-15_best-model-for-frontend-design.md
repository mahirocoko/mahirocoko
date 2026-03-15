---
title: "The Best Model For Frontend Design Is..."
source: YouTube - Theo - t3.gg (https://www.youtube.com/watch?v=f2FnYRP5kC4)
gemini_conversation: "tab:1474956626"
date: 2026-03-15
duration: "31:36"
tags: [frontend, design, ai-models, opus, gemini, gpt, claude-code, agent-skills]
---

# The Best Model For Frontend Design Is...

Theo compares frontier AI models (Gemini 3 Pro, Opus 4.5, GPT 5.2, Kimi k2.5) for frontend design quality — specifically whether they can produce UIs that don't look like "AI slop" with purple gradients.

## Key Takeaways

1. **Opus 4.5 + Frontend Design Skill = Best Results** — The combination of Opus 4.5 with a specific markdown "Frontend Design Skill" produces dramatically better designs than any model alone. Without the skill, Opus defaults to generic purple-gradient aesthetics.

2. **The "Frontend Design Skill" is a markdown file** from the Claude Code GitHub (`skills.sh`). It acts as reusable context that guides models to avoid generic aesthetics, purple gradients, and cookie-cutter layouts. It's installable globally or per-project.

3. **Hack: Generate 5 designs on separate routes** (`/1`, `/2`, etc.) in a single prompt. This forces the model to produce unique variations within the same context window, rather than rolling dice separately.

4. **Model rankings for frontend design:**
   - **Opus 4.5 + skill**: Best overall — minimal, animated, UX-aware, iterates well
   - **Gemini 3 Pro**: Best "by default" without skill — solid range, good templates, but technical hallucinations and poor iteration
   - **GPT 5.2**: Okay conceptually but terrible contrast, repetitive structures
   - **Kimi k2.5**: Cool aesthetics (neo-retro/vaporwave) but broken code structure

5. **Iteration is the real differentiator** — Opus listens to preferences and refines based on what you liked. Gemini ignores iteration instructions and just produces random new templates. The ability to iterate is more valuable than first-shot quality.

6. **Agent Skills directory** (`skills.sh`) is the distribution mechanism — install globally for Claude Code or per-project for Cursor.

## Transcript

[00:00] The Frontier models right now are all really good, whether you're using Gemini 3 Pro, Opus 4.5, or GPT 5.2. They all have their strengths and weaknesses, but what about frontend and good design? If you want things that don't look like AI slop with purple gradients, which model is best?

[01:02] It's unbelievable to me that I could create these designs without writing code. My secret is actually Opus 4.5 combined with a specific markdown file. It sounds insane, but it's a discovery I made that I wanted to show you.

[01:33] Before we dive in, a quick word about today's sponsor: Railway. It's the modern Heroku and the easiest way to deploy real servers. It's often 10 times faster than alternatives and you only pay for the CPU as you use it.

[03:45] I have six agents running to demonstrate this. I'm testing Gemini, Claude, and GPT 5.2 to showcase their design sensibilities. I'm using a prompt to build a marketing homepage for an image gen studio called T4 Canvas.

[04:43] Hack tip number one: I tell the model to create five different designs on separate routes (/1, /2, etc.). This forces the model to make them unique within the same context, rather than just rolling the dice five separate times.

[05:58] The "Frontend Design Skill" is the key. It's a markdown file from the Claude Code GitHub that acts as a reusable bit of context. It guides the model to avoid generic aesthetics, purple gradients, and "cookie-cutter" designs.

[08:21] Let's look at the "worst case"—default Opus 4.5 without the skill. The designs are fine, but they use those awful purple-blue gradients and have repetitive shapes. I used to think Opus just couldn't do design.

[09:43] Moving to GPT 5.2. Even when told not to use the skill, it often defaults to it. The results are okay conceptually but have terrible contrast issues and very similar structures across all five versions.

[11:48] Now for Gemini 3 Pro's base experience. It's actually the coolest so far as a starting point, with a solid range of designs. However, it suffers from technical hallucinations and broken CLI experiences.

[14:48] Checking Gemini 3 Pro with the design skill. It can make things that look like high-quality Tailwind templates. It's arguably the best "by default" model, but it still needs a lot of tuning.

[17:26] Back to Opus 4.5, but this time WITH the skill. The difference is insane. It's minimal, uses blurred background animations, and actually cares about UX, even adding a switcher to navigate between the five designs.

[19:42] What about Kimi k2.5? People say it's the best open-weight model for frontend. While the aesthetics are cool (neo-retro/vaporwave), I had to fix the code myself because it couldn't structure the project correctly.

[22:56] I ran a poll in my chat to see which designs people preferred between Gemini and Opus. While Gemini puts out some good "one-off" templates, the chat overwhelmingly preferred the Opus results.

[24:00] My next step is iteration. I take the designs I like and tell the model to make five more based on those. Gemini fails at this—it doesn't follow instructions to iterate and just gives more random templates.

[25:35] Opus, however, is much better at iteration. It takes the specific elements we liked and applies them to new layouts. It feels like it's actually "designing" and listening to preferences rather than just pattern-matching templates.

[29:44] To set this up yourself, use the "Agent Skills" directory (skills.sh). You can find the Frontend Design Skill there, copy the command, and install it globally or per project for tools like Cursor or Claude Code.

[31:10] Even though I prefer other apps for coding, I still use Claude Code for design because this markdown file unlocks capabilities in Opus that seem hidden otherwise. Let me know what you think in the comments!
