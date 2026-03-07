# Lesson Learned

`agentbus` is now strong enough to prove that a LAN-first bus for agent coordination is viable, but this session clarified that the decisive boundary is not message delivery. It is conversation continuity.

The first pattern is that `task ownership` is not enough for autonomous agent collaboration. A worker can claim a task, reply, and even delegate subtasks correctly, but if no one owns the thread after that moment, the system silently falls back to human prompting. This means true autonomy needs `thread ownership`, wake policy, and stop conditions. Confidence: high.

The second pattern is that `AgentBus` should stay bus-native and treat runtimes as adapters. The session repeated the same lesson from the Oracle HTTP MCP adapter work: a thin adapter around a stable backend is safer than making each client reimplement orchestration. Join manifests, runtime contracts, and adapter interfaces are the right foundation if the goal is “any agent can join.” Confidence: high.

The third pattern is that UX polish can make infrastructure feel farther along than its semantics really are. The monitor, skill frontend, README, EXAMPLE, and playbook all improved the usability of the system, but they did not remove the core gap. This is not wasted work, but it is a reminder to test the hardest workflow early: no human in the loop, remote workers only, conversation continues until final summary. Confidence: medium-high.

The fourth pattern is that identity separation must happen at the product model, not as a later cleanup. Interactive peers and worker peers need distinct IDs, health, and routing policy from the start. Once those identities collide, every downstream surface becomes ambiguous: presence, automation pickup, user trust, and monitor readability. Confidence: high.

Connection to past Oracle work: this session closely matches the lesson from `oracle-family-http-mcp-adapter`. In both cases, the right move was to keep the backend stable and thin the integration boundary instead of letting each client own too much behavior.

Implication for next work: prioritize `thread.ownerPeerId`, `thread.mode`, `thread.wakeupPolicy`, and `thread.stopCondition` before more CLI sugar. Better `/agentbus start` commands are useful, but they will not solve the actual autonomy break.

Tags: agentbus, runtime, adapters, autonomy, thread-ownership, orchestration, mcp, lan
