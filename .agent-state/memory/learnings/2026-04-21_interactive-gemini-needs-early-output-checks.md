# Lesson Learned: Interactive Gemini handoffs need early output checks and immediate file persistence

**Date**: 2026-04-21
**Tags**: #gemini #tmux #interactive-cli #handoff #verification #delivery

When a user asks to hand work off to an interactive Gemini session, the safest default is to honor that exact mode from the start, then inspect the live output early. Do not substitute headless execution just because it is easier to automate. The interaction model is part of the task, not an implementation detail.

The second rule is to check the first visible model output quickly. If the model drifts into the wrong domain, such as generating unrelated UI or fragmentary CSS, a fresh clean session is usually more effective than repeatedly steering a contaminated one. The third rule is even simpler: if the user wants the HTML file, save the HTML to disk as soon as there is valid markup. A tmux pane is not a deliverable.

This session reinforced a practical sequence: interactive first, inspect early, reset quickly if drift appears, and persist useful output immediately.
