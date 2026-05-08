---
title: OpenAgent tmux/team-mode pane debugging
tags: [oh-my-openagent, opencode, tmux, team-mode, debugging]
created: 2026-05-08
---

# OpenAgent tmux/team-mode pane debugging

When `oh-my-openagent` tmux/team-mode panes fail to appear correctly, do not assume the user failed to start tmux. First verify the live process state:

```bash
echo $TMUX
echo $TMUX_PANE
tmux display-message -p 'session=#{session_name} window=#{window_index}:#{window_name} pane=#{pane_index} pane_id=#{pane_id}'
```

In the 2026-05-08 session, the user was already inside tmux:

```text
TMUX=/private/tmp/tmux-501/default,84719,0
TMUX_PANE=%0
session=omo window=0:node pane=0 pane_id=%0
```

That means the basic tmux requirement was satisfied. The next diagnostic surface should be:

- whether `oh-my-openagent` config enables `tmux.enabled`, `team_mode.enabled`, and `team_mode.tmux_visualization`
- whether OpenCode was launched with a clear server/port path so spawned panes can run `opencode attach`
- whether `tmux.isolation: "inline"` is hitting layout/defer/race behavior
- whether switching to `tmux.isolation: "window"` or `"session"` makes panes reliable
- whether an upstream OMO pane-spawn issue is involved

Rule of thumb: **config-correct and tmux-correct does not guarantee pane-correct**. Pane display also depends on the attach flow, tmux layout capacity, and OMO runtime behavior.
