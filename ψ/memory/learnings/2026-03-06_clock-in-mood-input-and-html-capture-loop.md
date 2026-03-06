# Lesson Learned

Mood input belongs in the work ritual that creates it, while dashboards should summarize it. In this HRM flow, asking employees to record mood directly on the dashboard made the page feel like a form instead of a command surface. Moving the input into the `Clock-in + Mood` flow and turning the dashboard into `today` and `this month` mood summaries produced a cleaner product structure and a more believable daily workflow.

The tooling lesson paired with that product lesson. When Figma MCP could not directly author the design file the way a human editor would, the fastest honest path was to build editable local HTML/CSS mockups and capture them into the existing Figma file. That kept iteration alive without pretending the node-reading workflow was enough for screen creation. It also made structural redesign easier: I could change the placement of mood entry, refine the dashboard into a summary surface, and re-capture the updated result immediately.

The repeatable pattern is simple: put input where the real action happens, keep dashboards for reflection and prioritization, and use local prototype capture as the bridge when Figma tooling is better at importing than drawing.

Tags: hrm, figma-mcp, design-workflow, dashboard, clock-in, mood-tracker
