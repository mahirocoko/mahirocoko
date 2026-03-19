---
title: Vercel accuses Cloudflare of stealing
source: YouTube - Theo - t3.gg (https://www.youtube.com/watch?v=mVKxygo5Sdo)
video_id: mVKxygo5Sdo
channel: Theo - t3.gg
duration: 31:11
gemini_conversation: https://gemini.google.com/app/b91063354b67b811
created: 2026-03-19
tags: [youtube, transcript, vercel, cloudflare, just-bash, open-source, security, agents]
---

# Vercel accuses Cloudflare of stealing

## Source
- YouTube: https://www.youtube.com/watch?v=mVKxygo5Sdo
- Gemini conversation: https://gemini.google.com/app/b91063354b67b811

## Key Takeaways
- The dispute centers on `Just Bash`, a TypeScript virtual Bash environment for AI agents originally built at Vercel.
- Cloudflare forked it into `cloudflare/shell`, which was legal under Apache 2.0, but Vercel argued the fork happened too early and without upstream collaboration.
- Theo's main framing is that the real issue is not the fork itself, but the combination of branding, removed safety messaging, and different runtime assumptions.
- Vercel's security concerns mostly come from Node-style environments, where fake-shell breakouts could reach host resources; Cloudflare's isolate model changes that threat surface.
- Sunil Pai later clarified the fork was an experiment, published too early while he was on vacation, and the public conflict de-escalated after apologies.
- Theo's conclusion is cultural: send the DM first, assume good faith longer, and avoid turning ecosystem disagreements into instant public warfare.

## Gemini Transcript Summary
[00:00] Theo introduces a fresh Vercel vs Cloudflare conflict, this time centered on a package called `Just Bash`.

[00:21] He explains `Just Bash` as a virtual Bash environment with an in-memory filesystem written in TypeScript for AI agents to safely explore codebases.

[01:27] The conflict starts when Cloudflare forks `Just Bash` into `cloudflare/shell`, triggering accusations from Vercel.

[02:21] Sponsor segment about Browserbase and its fetch API for AI agents.

[03:41] Theo reviews Malte Ubl's argument: forking is legally allowed, but good open-source etiquette suggests improving the shared project before creating a fork, especially when the original project is still early and changing fast.

[05:08] He covers the security criticism: Cloudflare's fork reportedly removed beta disclaimers and defense-in-depth protections that matter in Node.js-oriented environments.

[09:05] Guillermo Rauch's aggressive response is discussed, including the now-deleted framing that Cloudflare was undermining open source and pushing developers toward its proprietary runtime.

[10:05] Theo then dives into architecture, comparing Vercel's Docker/Lambda-style execution model with Cloudflare's `workerd` plus isolates model to explain why both companies think about shell emulation differently.

[17:50] He explains why Cloudflare wanted the project at all: Workers cannot run native Bash, so a TypeScript shell simulation helps agents use Bash-like workflows on that platform.

[20:01] Theo defends Sunil Pai's intent, suggesting this looked more like an exploratory experiment than malicious corporate theft.

[24:52] The deeper problem becomes product perception: naming the fork `cloudflare/shell` and stripping warnings could make users choose it without understanding the missing safeguards.

[25:57] Sunil apologizes and says he planned to talk to Malte after experimenting, but published the package too early.

[27:00] Theo criticizes the broader culture of instantly escalating technical disagreements into public drama instead of assuming good faith.

[29:27] Malte later apologizes publicly to Sunil for causing unnecessary pain, and Theo treats that as the healthier ending.

[30:25] Theo closes with simple advice: text first, post later.

## Raw Captions
Fetched during the local `/watch` run on 2026-03-19. Full CC was available in the session, but not embedded here to keep this retained learning concise.

---
Added via /watch skill
