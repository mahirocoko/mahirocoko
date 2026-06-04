---
title: "Letta Office Hours: Local Mode and the New Pro Plan"
tags: [youtube, watch, letta, letta-code, local-mode, memory-ui, pro-plan, byok, credits, slash-skills, goal-command, agent-services]
source: "YouTube - Letta (https://www.youtube.com/watch?v=F50DN3GlzB0)"
youtube_url: "https://www.youtube.com/watch?v=F50DN3GlzB0"
video_id: "F50DN3GlzB0"
channel: "Letta"
duration: "1:18:29"
created: "2026-05-27"
gemini_conversation: "https://gemini.google.com/app/d723218e57f2b9b0"
gemini_status: "Gemini denied direct video transcription; saved official/auto captions via /watch fallback."
caption_artifact: ".agent-artifacts/watch/F50DN3GlzB0.en.srt"
---

# Letta Office Hours: Local Mode and the New Pro Plan

## Source

- **YouTube**: https://www.youtube.com/watch?v=F50DN3GlzB0
- **Channel**: Letta
- **Duration**: 1:18:29
- **Gemini conversation**: https://gemini.google.com/app/d723218e57f2b9b0
- **Capture note**: Gemini refused direct YouTube transcription, so this note uses the `/watch` fallback captions from YouTube CC.

## Key takeaways

1. **Letta app is moving toward a memory-first UI.** Memory is more visible through enhanced memory view, graph/commit history, built-in Markdown/WYSIWYG editing, and agent profile cards/avatar surfaces.
2. **Avoid manually editing system memory unless needed.** If a `system/` memory file is manually changed, the recompile box matters; otherwise the agent may not see the change. Recompile can invalidate cache and increase cost.
3. **Local mode is the headline update.** `letta --backend local` lets users run Letta Code without connecting to Letta Cloud or running a separate Docker server. It stores agent state/memory on disk and is optimized for fast local use, not large production deployment.
4. **Local mode still supports multiple model providers.** Users can connect OpenAI, Anthropic, OpenRouter, etc. through `/connect` similarly to normal Letta Code.
5. **Skills can now be invoked directly with slash commands.** Instead of asking an agent to use a skill, users can type `/skill-name` with autocomplete.
6. **`/goal` is a primitive for long-running objectives.** It replaces/clarifies earlier YOLO-style semantics and lets users set an objective plus token budget for longer autonomous work.
7. **Max and Max Light plans are being sunset.** The new Pro plan is positioned around Letta-tier/open-weight/router models; frontier/external model quota is no longer bundled the same way.
8. **Frontier/external models move to BYOK, credits, or provider plans.** For models like Opus or premium OpenAI models, users should expect BYOK, Letta credits, or direct provider subscriptions.
9. **The pricing shift is driven by economics and policy constraints.** Bundling frontier inference was not sustainable, and third-party harness access/policy changes affected the old Max-plan assumptions.
10. **Letta Auto is a router, not merely a model list.** It is intended to route by mode/intent/infrastructure rather than expose a simple user-controlled fallback list.
11. **Do not use Auto blindly for sensitive data.** If data-residency/zero-retention matters, choose provider/model paths explicitly or keep the setup local with an appropriate provider.
12. **Agent services are becoming a major theme.** Ezra, Overlord, Sensemaker, and “Pillars” point toward specialized, persistent agents with job-like responsibilities and their own memory/service boundaries.

## Rough timeline

- **00:00–05:10 — App updates & memory UI**: Memory view, Markdown editor, graph/commit history, agent cards/avatar.
- **05:10–08:25 — Local Letta Code, slash skills, `/goal`**: Local backend, provider connections, direct skill invocation, long-running goals.
- **08:25–12:55 — Plan changes**: Sunset Max/Max Light, Pro $20, Letta-tier models, no bundled frontier/external quota.
- **12:55–23:30 — Pricing Q&A + Anthropic/Codex discussion**: Opus/Max clarification, credits vs quota, BYOK, Anthropic policy, Codex/OpenAI economics.
- **23:30–30:10 — Cache, local hosting, Obsidian workflows**: Cache-friendliness, local mode caveats, app vs Obsidian plugin, AI-managed vaults.
- **30:10–36:30 — Remote environments, conditioning, BYOK demo**: Remote env status, mood/fatigue as user-buildable memory signals, `/connect` provider setup.
- **36:30–45:35 — Letta Auto, sensitive data, model quality**: Auto as router, sensitive data caveat, AI quality variability, open-weight future + memory stance.
- **45:35–51:35 — Research, Kimmy, Pillars**: Research papers, Kimmy coding plan, Pillars as persistent long-term objectives/job titles.
- **51:35–60:35 — Hermes/OpenClaw comparison**: Hermes praised for integrations/velocity/vibes, criticized for bugs/polish/weak memory; Letta bet is harness-level memory.
- **60:35–66:55 — Why Letta is paid, OpenRouter, agent services**: Product economics, OpenRouter caveats, services like Ezra/Overlord.
- **66:55–74:20 — Ezra, model switching, credits, agent caps**: Ezra maturity, model switching behavior, BYOK/credits, Pro/developer plan agent counts.
- **74:20–78:29 — Wrap-up**: Max migration follow-up, Discord support, community close.

## Notable Q&A / caveats

- **Opus and Max/Max Light**: old bundled usage will not continue in the same form after Max/Max Light are sunset.
- **Credits vs BYOK**: credits are useful for centralized billing and avoiding many provider keys; BYOK is useful when you already have provider access or need specific controls.
- **Local mode caveat**: good for local/single-device/quick start; not automatically a replacement for cloud/server deployment.
- **Local model caveat**: local embedded mode makes local inference more plausible, but cloud-to-local inference has architectural and security concerns.
- **Auto caveat**: Auto is not designed as a fully user-curated list of allowed/excluded models yet; feedback about constraints/fallbacks is acknowledged.
- **Sensitive data**: avoid letting router/provider choices become implicit if privacy/compliance matters.
- **OpenRouter**: useful for exploring many models, but can add routing/quality/pricing variability; if you know the model family, direct provider can be cleaner.
- **Persona not sticking**: Cameron’s practical advice is to ask the agent why it did not follow its persona and how to reconfigure memory; many Letta issues should be debugged with the agent itself.
- **Many details were still pending**: exact migration timing, Pro/basic model details, Windows release timing, agent-services article, and Pillars skill follow-ups.

## Apply to Mahiro Code

- Local mode is now the practical default context for this machine; when discussing memory sync, distinguish **local MemFS commit** from **remote sync**.
- The memory UI guidance reinforces my current operating rule: user-visible memory edits should normally be performed by the agent, not silently edited by hand.
- Direct slash-skill invocation explains why Mahiro can paste `<watch>` / skill blocks and expect me to execute the already-loaded instructions directly.
- For sensitive project work, do not treat model routing as invisible. If a task involves private code/secrets, be explicit about provider/model path and avoid broad Auto assumptions.
- For Letta agent behavior issues, use the “ask the agent to inspect itself and update memory” loop rather than only patching instructions externally.

## Retrieval hints

`#letta` `#letta-code` `#office-hours` `#local-mode` `#backend-local` `#memory-ui` `#system-memory` `#recompile-cache` `#slash-skills` `#goal-command` `#pro-plan` `#max-light-sunset` `#pricing` `#byok` `#credits` `#codex-plan` `#anthropic-policy` `#openrouter` `#letta-auto` `#sensitive-data` `#open-weight-models` `#agent-services` `#ezra` `#overlord` `#pillars` `#hermes-agent`

## Raw YouTube captions

<details>
<summary>Original CC (SRT)</summary>

```srt
1
00:00:04,000 --> 00:00:08,240
Hello everybody. Uh, welcome to Leta's

2
00:00:06,400 --> 00:00:11,040
office hours. My name is Cameron. I work

3
00:00:08,240 --> 00:00:13,200
here at Leta. And today I'm just going

4
00:00:11,040 --> 00:00:14,639
to walk you through kind of uh some

5
00:00:13,200 --> 00:00:17,279
slides on what's been going on in the

6
00:00:14,639 --> 00:00:19,199
Letter world. Um, and uh, I'll give you

7
00:00:17,279 --> 00:00:20,880
an overview of what's going on and then

8
00:00:19,199 --> 00:00:22,000
towards the end we'll open it up to just

9
00:00:20,880 --> 00:00:23,920
kind of general questions and

10
00:00:22,000 --> 00:00:27,840
discussion. And so if you have questions

11
00:00:23,920 --> 00:00:29,199
or um you have feedback or you know you

12
00:00:27,840 --> 00:00:31,039
need help or anything like that, this is

13
00:00:29,199 --> 00:00:33,040
a great time to do it after this little

14
00:00:31,039 --> 00:00:34,719
like slide presentation that uh I have

15
00:00:33,040 --> 00:00:36,719
for you. Some of the changes that you're

16
00:00:34,719 --> 00:00:38,719
about to see uh are about the let it

17
00:00:36,719 --> 00:00:42,559
code app and uh I believe the team is

18
00:00:38,719 --> 00:00:44,719
rolling out a release uh last I saw it

19
00:00:42,559 --> 00:00:47,120
was like happening uh they were working

20
00:00:44,719 --> 00:00:49,120
on it nowish. It's a good candidates or

21
00:00:47,120 --> 00:00:50,559
it's a good release candidate. So uh a

22
00:00:49,120 --> 00:00:52,000
lot of the pictures are from the release

23
00:00:50,559 --> 00:00:55,120
candidate that I have been working with

24
00:00:52,000 --> 00:00:56,960
personally. So the lettera app is now

25
00:00:55,120 --> 00:00:58,960
much more memory forward in terms of the

26
00:00:56,960 --> 00:01:01,440
UI because we've heard like some

27
00:00:58,960 --> 00:01:04,239
feedback where

28
00:01:01,440 --> 00:01:06,320
uh we have this issue where

29
00:01:04,239 --> 00:01:08,799
we have this issue where our memory is

30
00:01:06,320 --> 00:01:10,720
too good and that you kind of don't

31
00:01:08,799 --> 00:01:12,320
notice it that much. So we're trying to

32
00:01:10,720 --> 00:01:14,080
make the memory a little more obvious to

33
00:01:12,320 --> 00:01:16,479
users to understand the value that it

34
00:01:14,080 --> 00:01:19,680
brings to working with agents, right?

35
00:01:16,479 --> 00:01:22,240
And so there is uh you will see an

36
00:01:19,680 --> 00:01:25,119
enhanced memory view. Um and there's

37
00:01:22,240 --> 00:01:27,520
also a built-in markdown editor inside

38
00:01:25,119 --> 00:01:29,680
of every memory. So you can actually

39
00:01:27,520 --> 00:01:31,280
start using memories like an Obsidian

40
00:01:29,680 --> 00:01:34,720
vault.

41
00:01:31,280 --> 00:01:35,920
So um if you go when you first uh spin

42
00:01:34,720 --> 00:01:37,759
your agent up, you should see this

43
00:01:35,920 --> 00:01:39,920
memory tab on the right hand side. Some

44
00:01:37,759 --> 00:01:41,920
people should be this shouldn't look too

45
00:01:39,920 --> 00:01:43,520
dissimilar from what you've seen. We've

46
00:01:41,920 --> 00:01:44,880
uh enhanced a few things up here and

47
00:01:43,520 --> 00:01:46,320
made it a little little easier to use

48
00:01:44,880 --> 00:01:48,880
and giving you some ease of use on the

49
00:01:46,320 --> 00:01:51,119
right hand side.

50
00:01:48,880 --> 00:01:52,640
But you can click um you can click any

51
00:01:51,119 --> 00:01:55,280
of these notes and you'll get like a

52
00:01:52,640 --> 00:01:57,759
much uh kind of an enhanced memory view.

53
00:01:55,280 --> 00:01:59,680
And if you look at the bottom right, you

54
00:01:57,759 --> 00:02:01,759
can mouse over the edit button. There's

55
00:01:59,680 --> 00:02:04,000
a little pencil and that'll allow you to

56
00:02:01,759 --> 00:02:05,759
edit this thing in here. And it's a

57
00:02:04,000 --> 00:02:07,439
witty wizzywig editor. So you can do

58
00:02:05,759 --> 00:02:09,440
like headers, all kinds of like markdown

59
00:02:07,439 --> 00:02:11,039
formatting. Um, it's a live view, so

60
00:02:09,440 --> 00:02:12,400
it's very similar to Obsidian or Notion

61
00:02:11,039 --> 00:02:15,040
if you've ever used it. It's very high

62
00:02:12,400 --> 00:02:19,040
quality editor. Um,

63
00:02:15,040 --> 00:02:21,920
and, uh, so you can edit stuff. Um,

64
00:02:19,040 --> 00:02:24,000
before you save, um, note that there's a

65
00:02:21,920 --> 00:02:28,080
little recompile box here on the bottom

66
00:02:24,000 --> 00:02:30,160
left of the editor. Um, that is there in

67
00:02:28,080 --> 00:02:32,640
the event that your agent that you are

68
00:02:30,160 --> 00:02:34,400
editing an agent's system memory. So

69
00:02:32,640 --> 00:02:38,160
that means any markdown file that is

70
00:02:34,400 --> 00:02:40,800
inside of system inside of your agents

71
00:02:38,160 --> 00:02:43,280
um uh context repository.

72
00:02:40,800 --> 00:02:44,720
I recommend against manually editing the

73
00:02:43,280 --> 00:02:48,000
stuff that's inside of your system

74
00:02:44,720 --> 00:02:49,920
memory directly. Um normally we

75
00:02:48,000 --> 00:02:51,519
recommend that you ask your agent to

76
00:02:49,920 --> 00:02:53,360
update its own system memory so that

77
00:02:51,519 --> 00:02:55,760
it's aware and that it can use update

78
00:02:53,360 --> 00:02:58,400
its memory in a way that uh is most

79
00:02:55,760 --> 00:03:00,000
beneficial to it. Um but if you do need

80
00:02:58,400 --> 00:03:01,840
to make manual edits, make sure that you

81
00:03:00,000 --> 00:03:03,599
check the recompile box. Otherwise, your

82
00:03:01,840 --> 00:03:06,159
agent will not be aware of the changes

83
00:03:03,599 --> 00:03:09,360
that were made in that memory. Um, and

84
00:03:06,159 --> 00:03:11,920
be uh, you know, take note that uh,

85
00:03:09,360 --> 00:03:13,440
recompiling will invalidate the cache

86
00:03:11,920 --> 00:03:15,280
and that means that you may incur

87
00:03:13,440 --> 00:03:17,120
additional costs. It can be uh, more

88
00:03:15,280 --> 00:03:19,120
expensive. So, we don't recommend

89
00:03:17,120 --> 00:03:20,879
manually editing system memories. But

90
00:03:19,120 --> 00:03:22,800
anything else external memory that is

91
00:03:20,879 --> 00:03:26,159
outside of the system folder, you can

92
00:03:22,800 --> 00:03:29,040
edit that stuff uh, at will.

93
00:03:26,159 --> 00:03:31,280
Okay. Um, there's also like kind of the

94
00:03:29,040 --> 00:03:32,560
expanded graph view. um that's still

95
00:03:31,280 --> 00:03:36,000
there and we're making some improvements

96
00:03:32,560 --> 00:03:37,280
to that that haven't rolled out yet. Um

97
00:03:36,000 --> 00:03:39,200
but on the right hand side you'll see

98
00:03:37,280 --> 00:03:40,959
the global commit history for everything

99
00:03:39,200 --> 00:03:42,959
inside of your memory. So we recommend

100
00:03:40,959 --> 00:03:44,560
checking that out every once in a while.

101
00:03:42,959 --> 00:03:45,840
Um and [clears throat] you can get to

102
00:03:44,560 --> 00:03:48,720
this screen by the way by checking the

103
00:03:45,840 --> 00:03:50,480
little full screen uh button on the top

104
00:03:48,720 --> 00:03:52,319
right here.

105
00:03:50,480 --> 00:03:55,120
But you can go check this out uh and

106
00:03:52,319 --> 00:03:56,799
read uh what's happening basically

107
00:03:55,120 --> 00:03:58,640
inside of the memory under the hood. Uh

108
00:03:56,799 --> 00:04:01,280
so here's a few here's like a little bit

109
00:03:58,640 --> 00:04:05,439
of an example of what my agent loop is

110
00:04:01,280 --> 00:04:06,879
remembering uh while I am operating it.

111
00:04:05,439 --> 00:04:10,159
You'll also start seeing these like cool

112
00:04:06,879 --> 00:04:12,159
little agent cards. So our design uh

113
00:04:10,159 --> 00:04:14,959
partner Tonic

114
00:04:12,159 --> 00:04:17,280
um made these very cool like agent

115
00:04:14,959 --> 00:04:19,280
cards. So what you should do is go right

116
00:04:17,280 --> 00:04:22,079
click on your agent and then hit view

117
00:04:19,280 --> 00:04:25,040
profile and you'll see this. So, this is

118
00:04:22,079 --> 00:04:27,919
a um this is like there are these cool

119
00:04:25,040 --> 00:04:31,520
like playing cards. Um and you can even

120
00:04:27,919 --> 00:04:33,360
set a profile image uh for your agent.

121
00:04:31,520 --> 00:04:36,400
Now, there's a little like set an image

122
00:04:33,360 --> 00:04:39,360
button, upload an image button. Um your

123
00:04:36,400 --> 00:04:40,800
agent can even do this itself. Um I

124
00:04:39,360 --> 00:04:42,400
asked my agents to figure out how to do

125
00:04:40,800 --> 00:04:44,560
it. There's a pretty simple like command

126
00:04:42,400 --> 00:04:46,479
to to to do it and I will distribute

127
00:04:44,560 --> 00:04:48,400
that a little prompt that you can send

128
00:04:46,479 --> 00:04:50,479
to your agent to have them just manage

129
00:04:48,400 --> 00:04:52,240
their own profile image. Um, and you'll

130
00:04:50,479 --> 00:04:55,360
even note that it meant it shows up

131
00:04:52,240 --> 00:04:57,360
inside of the agent view. Um, like

132
00:04:55,360 --> 00:04:58,800
instead of the like little colored ball.

133
00:04:57,360 --> 00:05:00,320
So if you set something, you can see

134
00:04:58,800 --> 00:05:02,240
these little little circles with your

135
00:05:00,320 --> 00:05:03,680
agents avatar. So I actually really like

136
00:05:02,240 --> 00:05:04,800
these cards and I hope we can like print

137
00:05:03,680 --> 00:05:06,639
them out or something cuz they look

138
00:05:04,800 --> 00:05:09,120
really cool.

139
00:05:06,639 --> 00:05:11,199
Um,

140
00:05:09,120 --> 00:05:13,600
let's see. Um the next big thing is

141
00:05:11,199 --> 00:05:16,240
we're doing this huge push to uh support

142
00:05:13,600 --> 00:05:19,360
local leta code which does not require

143
00:05:16,240 --> 00:05:23,600
that you run or connect to any uh

144
00:05:19,360 --> 00:05:26,960
separate uh leta server. So for example

145
00:05:23,600 --> 00:05:29,039
um in order to use leta code before we

146
00:05:26,960 --> 00:05:31,199
had local mode

147
00:05:29,039 --> 00:05:34,320
you either had to connect to our cloud

148
00:05:31,199 --> 00:05:35,680
server app.leta.com or api.leta.com or

149
00:05:34,320 --> 00:05:37,840
you had to run your own docker

150
00:05:35,680 --> 00:05:39,520
container. Um, and that was like kind of

151
00:05:37,840 --> 00:05:41,840
slow and it was preventing or it wasn't

152
00:05:39,520 --> 00:05:43,759
slow but it was preventing um users who

153
00:05:41,840 --> 00:05:45,600
just wanted to get started immediately

154
00:05:43,759 --> 00:05:48,560
with a leta agent because they had to

155
00:05:45,600 --> 00:05:50,720
run docker separately. Um, and so

156
00:05:48,560 --> 00:05:52,240
Charles

157
00:05:50,720 --> 00:05:54,080
uh implemented a bunch of stuff inside

158
00:05:52,240 --> 00:05:55,840
of leta code where you actually don't

159
00:05:54,080 --> 00:05:58,560
even need a remote server anymore. All

160
00:05:55,840 --> 00:06:01,120
you have to do is type leta- backend

161
00:05:58,560 --> 00:06:04,479
local. All that means is you give it an

162
00:06:01,120 --> 00:06:05,840
API key and your agent all of its

163
00:06:04,479 --> 00:06:07,919
memories and everything are stored on

164
00:06:05,840 --> 00:06:09,360
disk. You don't have to log in. You

165
00:06:07,919 --> 00:06:10,880
don't have to do any of those things. It

166
00:06:09,360 --> 00:06:12,639
just is for people who just want to like

167
00:06:10,880 --> 00:06:14,880
stand something up and run very quickly.

168
00:06:12,639 --> 00:06:17,680
Um it's not meant for be to be like kind

169
00:06:14,880 --> 00:06:19,199
of like a production uh kind of agent,

170
00:06:17,680 --> 00:06:20,720
but it is meant to be like super quick

171
00:06:19,199 --> 00:06:22,160
and deployable so that you don't have to

172
00:06:20,720 --> 00:06:24,880
mess with a Docker container if you

173
00:06:22,160 --> 00:06:27,919
don't want to. Um,

174
00:06:24,880 --> 00:06:29,680
so, uh, Charles rolled out support for

175
00:06:27,919 --> 00:06:31,520
all of the other providers in there. So,

176
00:06:29,680 --> 00:06:34,000
you can use like slashconnect the same

177
00:06:31,520 --> 00:06:36,000
way that you could in any, uh, let code

178
00:06:34,000 --> 00:06:37,520
instance, you know, prior. Um, but it

179
00:06:36,000 --> 00:06:39,039
supports like OpenAI and Enthropic and

180
00:06:37,520 --> 00:06:41,039
Open Router and all of those things. So,

181
00:06:39,039 --> 00:06:44,160
you configure your your providers as

182
00:06:41,039 --> 00:06:45,520
needed for local mode. Um, so it's

183
00:06:44,160 --> 00:06:46,960
really nice working with local mode. You

184
00:06:45,520 --> 00:06:48,800
should try it out. Uh, particularly if

185
00:06:46,960 --> 00:06:51,919
you are a person who is currently using

186
00:06:48,800 --> 00:06:55,039
Docker. Um, it's much much much lighter

187
00:06:51,919 --> 00:06:56,960
weight. Um, and for I think a lot of

188
00:06:55,039 --> 00:07:00,560
users who are like who are currently

189
00:06:56,960 --> 00:07:04,000
using Docker uh this may be kind of uh

190
00:07:00,560 --> 00:07:06,880
kind of more of what you want. So

191
00:07:04,000 --> 00:07:09,440
um you can now invoke skills directly

192
00:07:06,880 --> 00:07:11,280
with slash. So previously like you had

193
00:07:09,440 --> 00:07:13,360
to ask your agent to invoke skills. Now

194
00:07:11,280 --> 00:07:14,720
you can just type like slash AI news is

195
00:07:13,360 --> 00:07:16,479
a skill that I have and then I actually

196
00:07:14,720 --> 00:07:18,639
have a duplicate for some reason. I have

197
00:07:16,479 --> 00:07:22,880
to fix that. But it'll pop up in the uh

198
00:07:18,639 --> 00:07:26,240
the auto suggestion um for skills.

199
00:07:22,880 --> 00:07:29,680
Um you can also set a goal. So we

200
00:07:26,240 --> 00:07:31,680
implemented slashgoal. This was like um

201
00:07:29,680 --> 00:07:34,639
we had something similar for this before

202
00:07:31,680 --> 00:07:35,919
which was /y yolo. Um but we've like

203
00:07:34,639 --> 00:07:37,919
kind of simplified the semantics and

204
00:07:35,919 --> 00:07:39,520
made it a little tidier to use. But you

205
00:07:37,919 --> 00:07:41,840
can set a longunning objective for a

206
00:07:39,520 --> 00:07:44,240
conversation using /goal. And you can

207
00:07:41,840 --> 00:07:46,080
even set a token budget. So for example

208
00:07:44,240 --> 00:07:48,479
you can write / goal improve benchmark

209
00:07:46,080 --> 00:07:51,039
coverage. Um then you can set a token

210
00:07:48,479 --> 00:07:52,800
budget. So you have 50,000 tokens to

211
00:07:51,039 --> 00:07:55,280
improve benchmark coverage. And you can

212
00:07:52,800 --> 00:07:57,680
even change the goal if you want to uh

213
00:07:55,280 --> 00:07:59,360
in line while you're working on uh while

214
00:07:57,680 --> 00:08:00,879
your agent is working on things. So this

215
00:07:59,360 --> 00:08:02,879
is how you can help your agent just like

216
00:08:00,879 --> 00:08:04,960
work on very very very long running

217
00:08:02,879 --> 00:08:08,479
tasks that can be on the order of like

218
00:08:04,960 --> 00:08:10,400
uh dozens of hours um and possibly

219
00:08:08,479 --> 00:08:14,560
longer. So we do highly recommend using

220
00:08:10,400 --> 00:08:16,000
/goal. Um um this is also probably

221
00:08:14,560 --> 00:08:17,360
really good to use with like a model

222
00:08:16,000 --> 00:08:20,400
like leta auto because you can kind of

223
00:08:17,360 --> 00:08:24,080
just let it run for a very long time.

224
00:08:20,400 --> 00:08:26,639
Um which leads to kind of a much a big

225
00:08:24,080 --> 00:08:30,080
change to the uh some people should be

226
00:08:26,639 --> 00:08:33,760
aware of. We are changing how our plans

227
00:08:30,080 --> 00:08:36,880
work. So we are sunsetting the max and

228
00:08:33,760 --> 00:08:38,399
max light plans. We do not currently

229
00:08:36,880 --> 00:08:42,080
have a timeline. We will follow up with

230
00:08:38,399 --> 00:08:44,080
everybody. Um we have uh a small enough

231
00:08:42,080 --> 00:08:46,080
amount of users on the max and max light

232
00:08:44,080 --> 00:08:47,839
plans where we can work with you

233
00:08:46,080 --> 00:08:50,320
directly to figure out alternative

234
00:08:47,839 --> 00:08:52,320
setups for you that will work uh if you

235
00:08:50,320 --> 00:08:54,399
are currently using uh some of the

236
00:08:52,320 --> 00:08:58,880
models available on max and max light

237
00:08:54,399 --> 00:09:00,800
plans. So um the models that are going

238
00:08:58,880 --> 00:09:03,839
to be included we we're going to have a

239
00:09:00,800 --> 00:09:06,399
pro plan but the pro plan is only going

240
00:09:03,839 --> 00:09:08,640
to include usage for the lettera tier of

241
00:09:06,399 --> 00:09:11,040
models. So that's auto auto chat,

242
00:09:08,640 --> 00:09:13,279
automemory, and autofast. And I think

243
00:09:11,040 --> 00:09:16,240
basic models actually need to I need to

244
00:09:13,279 --> 00:09:18,240
confirm that. So that's like uh like uh

245
00:09:16,240 --> 00:09:19,920
some openweight models, but I I'm

246
00:09:18,240 --> 00:09:21,519
actually need to confirm that. So I'll

247
00:09:19,920 --> 00:09:23,120
follow up with that in discord. So I'll

248
00:09:21,519 --> 00:09:24,399
post this I'll post like an announcement

249
00:09:23,120 --> 00:09:28,560
and I think people should be receiving

250
00:09:24,399 --> 00:09:31,120
an email soon as well. Um no plans are

251
00:09:28,560 --> 00:09:32,959
going to include like no usage based

252
00:09:31,120 --> 00:09:35,200
plans are going to include frontier and

253
00:09:32,959 --> 00:09:36,959
external model usage. So previously on

254
00:09:35,200 --> 00:09:38,640
Max and Max light, you got some amount

255
00:09:36,959 --> 00:09:40,959
of usage on like a premium tier of

256
00:09:38,640 --> 00:09:44,800
models. And so that's stuff like Opus

257
00:09:40,959 --> 00:09:48,000
and GBT 5.5. Um we spent a very long

258
00:09:44,800 --> 00:09:51,920
time trying to find a configuration of

259
00:09:48,000 --> 00:09:54,640
usage limits and models and quotas that

260
00:09:51,920 --> 00:09:58,800
would actually be economically viable

261
00:09:54,640 --> 00:10:01,040
for us as a company. And uh you know I

262
00:09:58,800 --> 00:10:06,800
don't it's not clear that there is there

263
00:10:01,040 --> 00:10:11,440
is a a way to do that currently. So um

264
00:10:06,800 --> 00:10:14,320
uh we are also uh removing automated use

265
00:10:11,440 --> 00:10:18,880
restrictions from quota plans. So, one

266
00:10:14,320 --> 00:10:21,680
of the reasons that we were very um

267
00:10:18,880 --> 00:10:24,079
uh we were strict about what you can

268
00:10:21,680 --> 00:10:25,760
schedule your agents to do was because

269
00:10:24,079 --> 00:10:27,440
people were scheduling on like a lot of

270
00:10:25,760 --> 00:10:29,920
these like premium plans and kind of

271
00:10:27,440 --> 00:10:32,720
doing a lot of like quota abuse and we

272
00:10:29,920 --> 00:10:34,240
were on on like very expensive models

273
00:10:32,720 --> 00:10:36,160
and and it wasn't necessarily quota

274
00:10:34,240 --> 00:10:39,360
abuse, but it was like um it was

275
00:10:36,160 --> 00:10:41,600
definitely an unsustainable outcome. for

276
00:10:39,360 --> 00:10:43,680
pro plans and let a tier models, it's

277
00:10:41,600 --> 00:10:45,440
much more sustainable for us to offer

278
00:10:43,680 --> 00:10:46,959
like kind of like scheduled use. And so

279
00:10:45,440 --> 00:10:49,519
we actually want agents to be much more

280
00:10:46,959 --> 00:10:51,040
automated um particularly for the letter

281
00:10:49,519 --> 00:10:53,600
tier of models because we can control

282
00:10:51,040 --> 00:10:56,640
and plan those costs a lot better. Um so

283
00:10:53,600 --> 00:11:01,279
people should be be expecting to have uh

284
00:10:56,640 --> 00:11:03,600
much uh much more inference um than uh

285
00:11:01,279 --> 00:11:06,800
you know on like a a token scale rather

286
00:11:03,600 --> 00:11:10,240
than use like larger external models. Um

287
00:11:06,800 --> 00:11:12,000
so the thing that we recommend and this

288
00:11:10,240 --> 00:11:15,279
is going to become become a much more

289
00:11:12,000 --> 00:11:17,200
common pattern I think is if you have a

290
00:11:15,279 --> 00:11:20,959
need for a particular model family so

291
00:11:17,200 --> 00:11:23,120
for example uh GPT 5.5 we highly

292
00:11:20,959 --> 00:11:26,000
recommend that you go get either the $20

293
00:11:23,120 --> 00:11:28,560
a month plan with open eye or the $100 a

294
00:11:26,000 --> 00:11:30,640
month plan and connect that to let code

295
00:11:28,560 --> 00:11:32,240
and use that to power your agent. So my

296
00:11:30,640 --> 00:11:34,800
personal we're we're switching to this

297
00:11:32,240 --> 00:11:37,040
internally. Um, we're starting to use uh

298
00:11:34,800 --> 00:11:38,560
codeex plans for our agents. I

299
00:11:37,040 --> 00:11:40,720
personally switched to the $100 a month

300
00:11:38,560 --> 00:11:42,640
plan yesterday for my personal agent.

301
00:11:40,720 --> 00:11:45,040
Um,

302
00:11:42,640 --> 00:11:48,560
and uh, so I'm that's typically how I

303
00:11:45,040 --> 00:11:52,079
power my models as now GBT 5.5 and 5.4.

304
00:11:48,560 --> 00:11:54,240
Um, and uh, Miniax, ZAI, and Kimmy plans

305
00:11:52,079 --> 00:11:56,320
are also good options for you. If you

306
00:11:54,240 --> 00:11:59,120
are a person who wants to use openweight

307
00:11:56,320 --> 00:12:00,880
models, um, then I would also just

308
00:11:59,120 --> 00:12:04,560
recommend using Leta Pro, which is our

309
00:12:00,880 --> 00:12:06,720
$20 $20 a month plan. Um, but they also

310
00:12:04,560 --> 00:12:09,519
offer really good plans as well in case

311
00:12:06,720 --> 00:12:11,200
you need a lot of usage. We also also

312
00:12:09,519 --> 00:12:13,760
recommend using bring your own key. So

313
00:12:11,200 --> 00:12:16,320
for people who need enthropic models um

314
00:12:13,760 --> 00:12:18,160
you should consider using um anthrop

315
00:12:16,320 --> 00:12:20,720
like bring your own key to power your

316
00:12:18,160 --> 00:12:22,399
model if you are an opus user or

317
00:12:20,720 --> 00:12:24,480
something like that because opus will no

318
00:12:22,399 --> 00:12:26,720
longer be available on quota plans like

319
00:12:24,480 --> 00:12:29,120
your quota cannot count towards opus you

320
00:12:26,720 --> 00:12:31,200
have to go through your own key to power

321
00:12:29,120 --> 00:12:33,360
anthropic models.

322
00:12:31,200 --> 00:12:35,920
Um, so I know this is like probably like

323
00:12:33,360 --> 00:12:38,079
this is a big change in how I plan uh in

324
00:12:35,920 --> 00:12:39,440
kind of uh the the offerings that we

325
00:12:38,079 --> 00:12:41,360
have and so I want to make sure that I

326
00:12:39,440 --> 00:12:42,880
hear from people in the Discord. Um, so

327
00:12:41,360 --> 00:12:44,800
if you have any questions or thoughts or

328
00:12:42,880 --> 00:12:46,000
or you want to know more, I'm happy to

329
00:12:44,800 --> 00:12:48,880
talk more about it and I will be

330
00:12:46,000 --> 00:12:50,560
available for that. Um, but in general,

331
00:12:48,880 --> 00:12:54,480
we're going to go into like Q&A and

332
00:12:50,560 --> 00:12:57,480
demos and everything now. Okay. All

333
00:12:54,480 --> 00:12:57,480
right.

334
00:12:58,959 --> 00:13:04,000
Okay. Going through some stuff.

335
00:13:02,320 --> 00:13:05,360
letter of playing cards. How can we

336
00:13:04,000 --> 00:13:06,399
print the letter of playing cards? I

337
00:13:05,360 --> 00:13:10,680
actually don't know. We should probably

338
00:13:06,399 --> 00:13:10,680
figure it out. Um

339
00:13:11,920 --> 00:13:15,440
um

340
00:13:13,440 --> 00:13:17,760
so chat opus can't be used with max or

341
00:13:15,440 --> 00:13:21,120
max light. No, there won't be max or max

342
00:13:17,760 --> 00:13:23,760
light. There there um there will be no

343
00:13:21,120 --> 00:13:25,839
$100 a month or $200 a month plans. You

344
00:13:23,760 --> 00:13:30,240
will only we will only offer a $20 a

345
00:13:25,839 --> 00:13:32,320
month plan uh going forward. Um, and

346
00:13:30,240 --> 00:13:35,839
that $20 a month plan will not include

347
00:13:32,320 --> 00:13:38,079
any uh external model provider um

348
00:13:35,839 --> 00:13:40,480
things. And and Pro and Charles notes

349
00:13:38,079 --> 00:13:46,000
this, but Pro is our our is only open

350
00:13:40,480 --> 00:13:47,920
weights and our router. Um

351
00:13:46,000 --> 00:13:49,200
um and you know, Charles does note in

352
00:13:47,920 --> 00:13:50,880
here that it's too much overhead to

353
00:13:49,200 --> 00:13:52,000
manage all the knobs internally. Like we

354
00:13:50,880 --> 00:13:53,680
were just like constantly trying to

355
00:13:52,000 --> 00:13:55,519
figure out like how do we set quotas to

356
00:13:53,680 --> 00:13:58,320
like you know because some users are

357
00:13:55,519 --> 00:14:00,800
costing are very expensive on on like

358
00:13:58,320 --> 00:14:03,440
max plans and some and like you know cuz

359
00:14:00,800 --> 00:14:07,279
when you offer $200 a month plan the

360
00:14:03,440 --> 00:14:09,360
people who like the that is like a uh

361
00:14:07,279 --> 00:14:11,440
it's expensive to offer you know if you

362
00:14:09,360 --> 00:14:13,680
are anthropic or you are open AAI it's

363
00:14:11,440 --> 00:14:15,279
very easy to offer a $200 a month plan

364
00:14:13,680 --> 00:14:19,040
because typically the margins that you

365
00:14:15,279 --> 00:14:20,480
charge on API pricings are API pricing

366
00:14:19,040 --> 00:14:23,040
is enormous.

367
00:14:20,480 --> 00:14:26,240
So when people were billing through us

368
00:14:23,040 --> 00:14:29,680
to use enthropic models or openi models

369
00:14:26,240 --> 00:14:31,920
um we were paying the markups um and so

370
00:14:29,680 --> 00:14:33,680
we weren't able to offer like actual

371
00:14:31,920 --> 00:14:34,880
competitive usage and so we were stuck

372
00:14:33,680 --> 00:14:37,440
in this middle ground where people were

373
00:14:34,880 --> 00:14:40,000
getting like actually not uh not the

374
00:14:37,440 --> 00:14:42,720
best amount of usage um and then it was

375
00:14:40,000 --> 00:14:44,880
just expensive to offer. So it it's just

376
00:14:42,720 --> 00:14:47,760
not economically viable I think for us

377
00:14:44,880 --> 00:14:51,040
to offer uh like frontier usage at this

378
00:14:47,760 --> 00:14:52,959
time. Um and unfortunately

379
00:14:51,040 --> 00:14:54,720
Anthropic has made a lot of decisions

380
00:14:52,959 --> 00:14:58,800
about

381
00:14:54,720 --> 00:15:00,959
um how your plans can be used that um

382
00:14:58,800 --> 00:15:04,240
make it even more untenable for us to

383
00:15:00,959 --> 00:15:05,920
support them in any way. So you you know

384
00:15:04,240 --> 00:15:07,760
we're internally we're actually getting

385
00:15:05,920 --> 00:15:09,839
off anthropic almost entirely. we're

386
00:15:07,760 --> 00:15:11,360
we're not using enthropic models really

387
00:15:09,839 --> 00:15:15,839
like we're we're trying to get our

388
00:15:11,360 --> 00:15:18,240
enthropic spend um very low and a reason

389
00:15:15,839 --> 00:15:20,160
for that is cost and then also kind of

390
00:15:18,240 --> 00:15:23,440
business practices

391
00:15:20,160 --> 00:15:27,040
um and also performance now like GPT 5.5

392
00:15:23,440 --> 00:15:28,639
is really good and uh we can actually uh

393
00:15:27,040 --> 00:15:30,000
it's much much much more affordable to

394
00:15:28,639 --> 00:15:32,639
go through the codeex plans because we

395
00:15:30,000 --> 00:15:34,959
can power all of our letter agents on uh

396
00:15:32,639 --> 00:15:37,279
some codeex plans

397
00:15:34,959 --> 00:15:39,990
Um,

398
00:15:37,279 --> 00:15:39,990
so, [sighs]

399
00:15:40,000 --> 00:15:43,040
uh,

400
00:15:41,680 --> 00:15:44,800
Bib says, "I don't think I was using

401
00:15:43,040 --> 00:15:48,720
$200 of usage anyway." You would be

402
00:15:44,800 --> 00:15:51,519
surprised. Um, I think most I think it's

403
00:15:48,720 --> 00:15:52,800
very easy to, uh, incur a significant

404
00:15:51,519 --> 00:15:54,880
amount of usage. And you shouldn't

405
00:15:52,800 --> 00:15:56,720
apologize for that, by the way. Like, if

406
00:15:54,880 --> 00:15:58,880
you use our product in the way that we

407
00:15:56,720 --> 00:16:00,480
offer it, then you that's, uh, and and

408
00:15:58,880 --> 00:16:03,120
it's not a good deal for us. That's our

409
00:16:00,480 --> 00:16:05,279
problem, and it's not yours.

410
00:16:03,120 --> 00:16:06,720
Your mic is like unplugged or something.

411
00:16:05,279 --> 00:16:07,920
>> My mic is unplugged.

412
00:16:06,720 --> 00:16:09,759
>> Sounds really bad.

413
00:16:07,920 --> 00:16:12,320
>> Oh, well that happens. Oh, wait. Hold

414
00:16:09,759 --> 00:16:13,440
on. Hold on. Okay. I'm told that my mic

415
00:16:12,320 --> 00:16:14,880
was unplugged.

416
00:16:13,440 --> 00:16:16,880
>> You're too high up in chat.

417
00:16:14,880 --> 00:16:19,680
>> He says I'm too high up in chat. Okay,

418
00:16:16,880 --> 00:16:22,079
it should be working now. My headphones

419
00:16:19,680 --> 00:16:26,000
uh just got plugged in, but people can't

420
00:16:22,079 --> 00:16:27,839
see. Okay, thank you. Okay, so you guys

421
00:16:26,000 --> 00:16:30,839
didn't hear like any of that. Is that

422
00:16:27,839 --> 00:16:30,839
right?

423
00:16:32,079 --> 00:16:36,921
Okay, you heard sort of. Okay, gotcha.

424
00:16:34,399 --> 00:16:38,000
It just sounded bad. All right.

425
00:16:36,921 --> 00:16:41,519
[laughter]

426
00:16:38,000 --> 00:16:43,920
Okay, I will address that. Um,

427
00:16:41,519 --> 00:16:46,240
all right. Let me go back and like kind

428
00:16:43,920 --> 00:16:47,600
of come through a little bit. Would it

429
00:16:46,240 --> 00:16:49,279
be possible to add a connection with a

430
00:16:47,600 --> 00:16:50,800
base URL to bring your own key? That way

431
00:16:49,279 --> 00:16:53,296
we could connect our light LLM or

432
00:16:50,800 --> 00:16:55,680
Bifrost server to serve our own models.

433
00:16:53,296 --> 00:16:57,360
[snorts] Um, possibly with like local

434
00:16:55,680 --> 00:16:58,800
mode. I think like doing your own

435
00:16:57,360 --> 00:17:02,519
inference, we have to figure that out

436
00:16:58,800 --> 00:17:02,519
more. Um

437
00:17:03,519 --> 00:17:06,880
um credits are different than quota

438
00:17:05,280 --> 00:17:08,000
rates. Yeah. So Zeus asked a question.

439
00:17:06,880 --> 00:17:09,600
How does the pricing model work with

440
00:17:08,000 --> 00:17:11,120
credits we already have on Leta. Your

441
00:17:09,600 --> 00:17:12,640
credits work just the same. You can

442
00:17:11,120 --> 00:17:13,919
still buy credits through us and we just

443
00:17:12,640 --> 00:17:17,439
do pass through pricing. We don't charge

444
00:17:13,919 --> 00:17:19,439
a markup on credits. And um that means

445
00:17:17,439 --> 00:17:21,360
that you can just buy credits. That's

446
00:17:19,439 --> 00:17:23,439
that's also totally fine with us. It's

447
00:17:21,360 --> 00:17:25,520
just that your quota, you know, we give

448
00:17:23,439 --> 00:17:27,760
you some amount of usage in every 4hour

449
00:17:25,520 --> 00:17:30,400
block on the max light and max plans.

450
00:17:27,760 --> 00:17:32,240
and that included Anthropic and OpenAI

451
00:17:30,400 --> 00:17:34,880
and Google models, but we can't offer

452
00:17:32,240 --> 00:17:36,559
that anymore. And so, um, you can still

453
00:17:34,880 --> 00:17:37,919
purchase credits and that's also a very

454
00:17:36,559 --> 00:17:39,280
good way. I should have mentioned that,

455
00:17:37,919 --> 00:17:43,720
but that's a very good way to power your

456
00:17:39,280 --> 00:17:43,720
models. Um,

457
00:17:46,400 --> 00:17:51,520
um, let's see. Looking forward to

458
00:17:48,559 --> 00:17:53,840
eventually paying for the letter LLM.

459
00:17:51,520 --> 00:17:56,880
No comment. Is there any potential way

460
00:17:53,840 --> 00:17:58,799
to have a uh to pay for what you use for

461
00:17:56,880 --> 00:18:00,720
any models on paid plans because it

462
00:17:58,799 --> 00:18:03,440
serves the pain of managing our own um

463
00:18:00,720 --> 00:18:05,760
especially if we use our Yes. So Anna,

464
00:18:03,440 --> 00:18:08,000
you can just buy credits. You can go on

465
00:18:05,760 --> 00:18:10,160
to your usage page and purchase credits.

466
00:18:08,000 --> 00:18:11,919
Enable extra usage. Uh there's a little

467
00:18:10,160 --> 00:18:14,559
check box on the usage page and you can

468
00:18:11,919 --> 00:18:16,240
use that to pay for any uh anything and

469
00:18:14,559 --> 00:18:17,919
you don't have to use your own key. You

470
00:18:16,240 --> 00:18:20,919
can go through our key that works as

471
00:18:17,919 --> 00:18:20,919
well.

472
00:18:21,200 --> 00:18:25,919
Um, I forget what Anthropic's latest

473
00:18:23,840 --> 00:18:28,080
position is on using external agents for

474
00:18:25,919 --> 00:18:30,160
using max plans. I know they have a

475
00:18:28,080 --> 00:18:31,679
separate usage allocation for using the

476
00:18:30,160 --> 00:18:32,880
uh the headless flag, but they also

477
00:18:31,679 --> 00:18:34,400
allow you to pull from your extra

478
00:18:32,880 --> 00:18:35,919
credits. This would be a more affordable

479
00:18:34,400 --> 00:18:38,960
way to use Opus with Leta than using

480
00:18:35,919 --> 00:18:41,200
Enthropic API keys. Yes. So, what Kyle

481
00:18:38,960 --> 00:18:43,600
is referring to here is a policy change

482
00:18:41,200 --> 00:18:47,200
that Enthropic made yesterday. So,

483
00:18:43,600 --> 00:18:51,120
Enthropic basically said, um,

484
00:18:47,200 --> 00:18:53,120
uh, we're going to give you a a a chunk.

485
00:18:51,120 --> 00:18:55,440
So, if you're a $200 a month subscriber,

486
00:18:53,120 --> 00:18:57,600
we're going to give you a chunk of that,

487
00:18:55,440 --> 00:19:00,400
uh, is going to be set aside for

488
00:18:57,600 --> 00:19:03,280
third-party API like usage, and that

489
00:19:00,400 --> 00:19:05,280
uses API pricing. It's a separate pool.

490
00:19:03,280 --> 00:19:07,440
Um, and I think they actually reduced

491
00:19:05,280 --> 00:19:08,559
some of your or I'll leave that off

492
00:19:07,440 --> 00:19:11,520
because I actually don't know if that's

493
00:19:08,559 --> 00:19:13,600
true. Um but my understanding is you

494
00:19:11,520 --> 00:19:15,679
have to go through either claude minus p

495
00:19:13,600 --> 00:19:17,600
which is headless mode or you have to go

496
00:19:15,679 --> 00:19:21,120
through the agent SDK. So essentially

497
00:19:17,600 --> 00:19:22,880
what anthropic has done is say um you

498
00:19:21,120 --> 00:19:25,200
are no longer to do allowed to do any

499
00:19:22,880 --> 00:19:30,400
kind of automated use unless you go

500
00:19:25,200 --> 00:19:34,080
through the agent SDK. So um essentially

501
00:19:30,400 --> 00:19:35,760
we would have to redesign a large part

502
00:19:34,080 --> 00:19:37,919
of how Leta functions. they're they're

503
00:19:35,760 --> 00:19:40,080
essentially forcing a large part they're

504
00:19:37,919 --> 00:19:43,200
forcing their software onto people who

505
00:19:40,080 --> 00:19:46,640
are thirdparty providers like us. Um I

506
00:19:43,200 --> 00:19:48,160
think is my understanding so far. Um I

507
00:19:46,640 --> 00:19:50,080
think there's still a little bit of

508
00:19:48,160 --> 00:19:51,600
confusion.

509
00:19:50,080 --> 00:19:55,280
Um

510
00:19:51,600 --> 00:19:59,200
and uh

511
00:19:55,280 --> 00:20:01,840
and uh so yeah, T3 Charles notes that T3

512
00:19:59,200 --> 00:20:04,240
code is on the agent SDK and they just

513
00:20:01,840 --> 00:20:08,720
got a huge rug pull. Uh so Theo has been

514
00:20:04,240 --> 00:20:10,720
very angry about uh stuff today. So

515
00:20:08,720 --> 00:20:12,320
you know Anthropics policy changes like

516
00:20:10,720 --> 00:20:13,600
that you know they they kind of like

517
00:20:12,320 --> 00:20:15,440
were like oh my gosh we're going to let

518
00:20:13,600 --> 00:20:17,200
people use automated usage but it means

519
00:20:15,440 --> 00:20:19,280
that you have to like basically build on

520
00:20:17,200 --> 00:20:21,039
their stack. It's a really hostile move.

521
00:20:19,280 --> 00:20:24,480
I actually canled my cloud subscription

522
00:20:21,039 --> 00:20:27,360
yesterday. Um I I'm no longer like I'm

523
00:20:24,480 --> 00:20:29,520
no longer okay with uh the the policies

524
00:20:27,360 --> 00:20:34,400
that they are enacting. you know, I I

525
00:20:29,520 --> 00:20:39,520
don't like to me uh

526
00:20:34,400 --> 00:20:43,280
um codeex the codeex plans are uh 70,000

527
00:20:39,520 --> 00:20:45,200
times better uh than what you get from

528
00:20:43,280 --> 00:20:46,799
anthropic. Entropic no longer holds the

529
00:20:45,200 --> 00:20:51,120
model.

530
00:20:46,799 --> 00:20:53,360
Um GPT 5.5 is extremely good. Um, and

531
00:20:51,120 --> 00:20:54,720
obviously I still love Opus and I, you

532
00:20:53,360 --> 00:20:57,520
know, there are many things about Opus

533
00:20:54,720 --> 00:20:59,280
that you, um, that are many aspects and

534
00:20:57,520 --> 00:21:02,640
capabilities of Opus that cannot be beat

535
00:20:59,280 --> 00:21:04,159
by other models. And,

536
00:21:02,640 --> 00:21:07,120
um,

537
00:21:04,159 --> 00:21:09,520
Codeex is a better deal. You know, I pay

538
00:21:07,120 --> 00:21:11,919
$100 a month personally

539
00:21:09,520 --> 00:21:14,320
and uh, I get a ton of usage. I don't

540
00:21:11,919 --> 00:21:16,880
really hit rate limits. 5.5 is really

541
00:21:14,320 --> 00:21:19,280
good and they let me take it wherever I

542
00:21:16,880 --> 00:21:22,320
want. I pay for that inference and I get

543
00:21:19,280 --> 00:21:24,159
it. And uh with anthropic I have to jump

544
00:21:22,320 --> 00:21:26,640
through hoop after hoop after hoop after

545
00:21:24,159 --> 00:21:29,679
hoop. And uh so that I that's been

546
00:21:26,640 --> 00:21:32,000
really frustrating to me. Um and I

547
00:21:29,679 --> 00:21:33,200
didn't really want to go back to um

548
00:21:32,000 --> 00:21:37,120
Laura mentioned I don't want to go back

549
00:21:33,200 --> 00:21:41,760
to GPT and I I also didn't until 5.5.

550
00:21:37,120 --> 00:21:44,559
5.5 and 5.4 are really good. Um,

551
00:21:41,760 --> 00:21:46,799
and uh, you know, unfortunately we, you

552
00:21:44,559 --> 00:21:48,240
know, Anthropic is making their choices

553
00:21:46,799 --> 00:21:51,280
and we're making ours and we're doing

554
00:21:48,240 --> 00:21:53,039
the best we can for us. And, um, you

555
00:21:51,280 --> 00:21:57,440
know, I I don't know exactly whether or

556
00:21:53,039 --> 00:21:59,120
not we're considering uh, going through

557
00:21:57,440 --> 00:22:00,720
um, like whether or not we're

558
00:21:59,120 --> 00:22:02,400
considering doing agent SDK. I think

559
00:22:00,720 --> 00:22:03,760
that's still very much in the air, but I

560
00:22:02,400 --> 00:22:06,400
think it's pretty obvious that their

561
00:22:03,760 --> 00:22:07,760
policies are very hostile to third party

562
00:22:06,400 --> 00:22:10,480
like developers and third party

563
00:22:07,760 --> 00:22:12,559
offerings. Um

564
00:22:10,480 --> 00:22:15,039
so

565
00:22:12,559 --> 00:22:18,320
uh

566
00:22:15,039 --> 00:22:21,320
yeah so there's more more on that front.

567
00:22:18,320 --> 00:22:21,320
Um

568
00:22:21,679 --> 00:22:28,159
let's see.

569
00:22:24,480 --> 00:22:29,760
Um bibs definitely used 200 or dollars a

570
00:22:28,159 --> 00:22:32,960
month at least one month before we

571
00:22:29,760 --> 00:22:36,640
nerfed oath usage. Oh yeah. I I mean I I

572
00:22:32,960 --> 00:22:40,240
think for I for for a sense of scale I

573
00:22:36,640 --> 00:22:42,640
think some of our users were on like

574
00:22:40,240 --> 00:22:45,919
for some users it was almost a 10x

575
00:22:42,640 --> 00:22:47,440
differential in cost to gain. O

576
00:22:45,919 --> 00:22:50,400
obviously this wasn't everybody but it

577
00:22:47,440 --> 00:22:52,000
was like not sustainable. Um and in and

578
00:22:50,400 --> 00:22:53,520
to make it sustainable the usage would

579
00:22:52,000 --> 00:22:56,480
be so limited that people would just

580
00:22:53,520 --> 00:22:58,240
like hate it. And uh we just don't I I

581
00:22:56,480 --> 00:23:00,240
just don't want to be like our company

582
00:22:58,240 --> 00:23:01,600
to be like kind of like trapped in this

583
00:23:00,240 --> 00:23:03,360
middle ground where you're like offering

584
00:23:01,600 --> 00:23:04,400
like some usage but it's not enough and

585
00:23:03,360 --> 00:23:05,919
then you're mad because you have to go

586
00:23:04,400 --> 00:23:07,760
do this and you're paying $200 a month

587
00:23:05,919 --> 00:23:08,799
and you know if you're paying $200 a

588
00:23:07,760 --> 00:23:11,200
month then why aren't you getting a ton

589
00:23:08,799 --> 00:23:12,799
of opus you know like that's just not

590
00:23:11,200 --> 00:23:15,520
our core competency. we can't compete on

591
00:23:12,799 --> 00:23:18,320
inference and um so we have to figure

592
00:23:15,520 --> 00:23:20,880
out uh an alternative way to work with

593
00:23:18,320 --> 00:23:22,240
like um openw weight models, models we

594
00:23:20,880 --> 00:23:23,840
can control, things we can build into

595
00:23:22,240 --> 00:23:26,720
the harness level, like inference that

596
00:23:23,840 --> 00:23:31,960
we're allowed to actually use um you

597
00:23:26,720 --> 00:23:31,960
know on behalf of our customers. So

598
00:23:32,320 --> 00:23:37,280
um I'm pretty sure Leta was eating the

599
00:23:35,120 --> 00:23:41,366
cost for LLM usage consistently since I

600
00:23:37,280 --> 00:23:42,559
joined in January. Yes. Um yes

601
00:23:41,366 --> 00:23:45,200
[laughter]

602
00:23:42,559 --> 00:23:47,440
um uh Ron says if I understand letter

603
00:23:45,200 --> 00:23:48,960
right you accept cache thrash on every

604
00:23:47,440 --> 00:23:50,640
met me memory edit as the cost of

605
00:23:48,960 --> 00:23:52,320
freshness. Have you me measured the

606
00:23:50,640 --> 00:23:55,200
actual cost versus benefit at production

607
00:23:52,320 --> 00:23:57,440
scale? Have you quantified this? Um we

608
00:23:55,200 --> 00:23:59,760
actually do we are very gentle with the

609
00:23:57,440 --> 00:24:02,480
cache. We are extraordinarily cash

610
00:23:59,760 --> 00:24:04,240
friendly. We we've spent a lot of time

611
00:24:02,480 --> 00:24:09,200
rebuilding how Letta functions so that

612
00:24:04,240 --> 00:24:11,679
we don't invalidate the cache. And um I

613
00:24:09,200 --> 00:24:14,320
think an early estimate I heard was

614
00:24:11,679 --> 00:24:16,720
somewhere in the order of 5 to 20x more

615
00:24:14,320 --> 00:24:19,279
expensive if you do the original

616
00:24:16,720 --> 00:24:21,760
original memory method that we had that

617
00:24:19,279 --> 00:24:24,760
was very cache unfriendly.

618
00:24:21,760 --> 00:24:24,760
Um,

619
00:24:25,200 --> 00:24:29,120
so

620
00:24:26,880 --> 00:24:32,360
yeah,

621
00:24:29,120 --> 00:24:32,360
let's see.

622
00:24:32,559 --> 00:24:35,840
Uh, Putty says, "I'm relatively new to

623
00:24:34,480 --> 00:24:37,279
Leta, so I was curious if there's a way

624
00:24:35,840 --> 00:24:38,640
to host Leta completely locally without

625
00:24:37,279 --> 00:24:43,360
being locked up behind a payw wall."

626
00:24:38,640 --> 00:24:46,480
Yes, go uh go type leta d-backend

627
00:24:43,360 --> 00:24:49,600
space local and then you will never uh

628
00:24:46,480 --> 00:24:51,600
then then you can use leta code um

629
00:24:49,600 --> 00:24:53,200
without talking to our servers at all.

630
00:24:51,600 --> 00:24:54,720
Um it's not meant for like big

631
00:24:53,200 --> 00:24:56,320
deployments and it's like only local to

632
00:24:54,720 --> 00:24:58,320
your device. So you your agents are not

633
00:24:56,320 --> 00:25:00,799
super portable or anything and you can't

634
00:24:58,320 --> 00:25:02,559
use like remotes and things but um it's

635
00:25:00,799 --> 00:25:04,400
good code. Uh it's it's a good way to

636
00:25:02,559 --> 00:25:06,480
deploy. You can also deploy your own

637
00:25:04,400 --> 00:25:08,080
Docker container if you want, but I

638
00:25:06,480 --> 00:25:10,640
don't think you actually need need it

639
00:25:08,080 --> 00:25:12,640
that much anymore with the let a code

640
00:25:10,640 --> 00:25:15,360
embedded mode.

641
00:25:12,640 --> 00:25:18,320
And I yes, there will be uh an email

642
00:25:15,360 --> 00:25:21,039
going out. I wrote up the email

643
00:25:18,320 --> 00:25:24,799
yesterday or the day before. Uh Bibs is

644
00:25:21,039 --> 00:25:27,760
coming up uh but it hasn't gone out yet.

645
00:25:24,799 --> 00:25:29,760
Um Bibs is begging us for for begging

646
00:25:27,760 --> 00:25:33,039
for us to come up with ways for you to

647
00:25:29,760 --> 00:25:35,360
give us money for better services. Um

648
00:25:33,039 --> 00:25:36,480
yeah, I mean I think we've like kind of

649
00:25:35,360 --> 00:25:39,440
talked about this a little bit before,

650
00:25:36,480 --> 00:25:41,919
but it's like

651
00:25:39,440 --> 00:25:43,440
um

652
00:25:41,919 --> 00:25:46,440
uh

653
00:25:43,440 --> 00:25:46,440
like

654
00:25:49,279 --> 00:25:54,000
you'll see you'll see more uh of us

655
00:25:52,159 --> 00:25:55,600
continuing to offer things. We we mostly

656
00:25:54,000 --> 00:25:57,440
want people to use our product and to

657
00:25:55,600 --> 00:25:59,600
help us like actually improve it and

658
00:25:57,440 --> 00:26:03,360
give us like like we basically just want

659
00:25:59,600 --> 00:26:05,679
use and I think

660
00:26:03,360 --> 00:26:06,880
um we want people to help us make it a

661
00:26:05,679 --> 00:26:08,480
better product. And so that's kind of

662
00:26:06,880 --> 00:26:09,840
the thing that I I personally want is

663
00:26:08,480 --> 00:26:12,159
like I think the pro plan is a good

664
00:26:09,840 --> 00:26:13,840
thing. If you want to pay $20 a month to

665
00:26:12,159 --> 00:26:14,960
help us like experiment with that, that

666
00:26:13,840 --> 00:26:18,840
would be awesome. So I would really

667
00:26:14,960 --> 00:26:18,840
appreciate that. Um

668
00:26:19,919 --> 00:26:24,159
um Leta is going is still going

669
00:26:22,240 --> 00:26:25,440
strongest. uh as it has always been.

670
00:26:24,159 --> 00:26:26,559
It's not surprising the big models would

671
00:26:25,440 --> 00:26:28,960
try to squeeze others. Your play has

672
00:26:26,559 --> 00:26:30,559
always been mobility your open models

673
00:26:28,960 --> 00:26:32,080
and locally hosted models for occasional

674
00:26:30,559 --> 00:26:33,360
use of big models. Please make you

675
00:26:32,080 --> 00:26:35,200
easier to use local models in

676
00:26:33,360 --> 00:26:37,120
conjunction with other models. Yeah, the

677
00:26:35,200 --> 00:26:38,720
local model question is a bigger one. I

678
00:26:37,120 --> 00:26:43,200
personally don't like local models, but

679
00:26:38,720 --> 00:26:44,480
I do think that this like is uh we

680
00:26:43,200 --> 00:26:46,000
should start talking about how to do

681
00:26:44,480 --> 00:26:47,679
that inference differently. If you are

682
00:26:46,000 --> 00:26:50,960
using embedded mode, I believe you can

683
00:26:47,679 --> 00:26:52,000
just use a local local uh inference. I

684
00:26:50,960 --> 00:26:53,360
think if you're going through like a

685
00:26:52,000 --> 00:26:54,720
cloud thing, I think there's a different

686
00:26:53,360 --> 00:26:57,279
architectural concern, but I think

687
00:26:54,720 --> 00:27:02,200
that's outside of my uh skill level to

688
00:26:57,279 --> 00:27:02,200
opine on right now. Um

689
00:27:03,039 --> 00:27:07,279
let's see.

690
00:27:05,360 --> 00:27:08,880
Uh Putty says it's because of OpenClaw.

691
00:27:07,279 --> 00:27:10,400
It's not because of OpenClaw. It's

692
00:27:08,880 --> 00:27:12,320
because of like everything like because

693
00:27:10,400 --> 00:27:13,840
people are borrowing plans and the

694
00:27:12,320 --> 00:27:18,799
foundation labs have to make a choice

695
00:27:13,840 --> 00:27:21,440
about like whether how to offer um like

696
00:27:18,799 --> 00:27:22,880
exactly what to do because codeex and

697
00:27:21,440 --> 00:27:24,080
opening eye is making this thing where

698
00:27:22,880 --> 00:27:26,080
they're saying like look we're just

699
00:27:24,080 --> 00:27:29,360
going to you give us $100 a month we

700
00:27:26,080 --> 00:27:31,279
give you um a pass and you can use those

701
00:27:29,360 --> 00:27:32,960
tokens however you want and for us

702
00:27:31,279 --> 00:27:35,840
that's the best possible model because

703
00:27:32,960 --> 00:27:37,440
we we can be respectful of that usage

704
00:27:35,840 --> 00:27:39,039
like we're very cash friendly so you

705
00:27:37,440 --> 00:27:40,880
your usage will probably go a lot

706
00:27:39,039 --> 00:27:45,120
farther on a codeex plan than it might

707
00:27:40,880 --> 00:27:49,600
on less cache friendly harnesses. Um

708
00:27:45,120 --> 00:27:52,640
and um you know anthropic separate thing

709
00:27:49,600 --> 00:27:54,080
um going through claude withdrawal. Yes,

710
00:27:52,640 --> 00:27:55,679
that's going to happen. I went through

711
00:27:54,080 --> 00:27:57,840
cloud withdrawal and I'm fine with it

712
00:27:55,679 --> 00:27:59,279
actually. I I had a huge thing where I

713
00:27:57,840 --> 00:28:01,360
started transitioning off Claude over

714
00:27:59,279 --> 00:28:04,960
the past like maybe two or three months

715
00:28:01,360 --> 00:28:07,760
and um uh I'm okay with it now when I

716
00:28:04,960 --> 00:28:10,320
use I you know I do still do bring my

717
00:28:07,760 --> 00:28:12,399
own key for uh Claude for like certain

718
00:28:10,320 --> 00:28:16,720
conversations but uh for the most part

719
00:28:12,399 --> 00:28:18,080
it's like GPT 5.5 and 5.4 um and I think

720
00:28:16,720 --> 00:28:21,440
I'm perfectly happy with that. And also

721
00:28:18,080 --> 00:28:24,720
Kimmy um uh Kimmy has been Kimmy is

722
00:28:21,440 --> 00:28:27,120
great for like standard work. Um, and

723
00:28:24,720 --> 00:28:29,440
then I mostly do let auto for like

724
00:28:27,120 --> 00:28:31,760
actual work now. Uh, cuz I can just like

725
00:28:29,440 --> 00:28:34,799
send off a like a ton of letter

726
00:28:31,760 --> 00:28:37,679
auto agents.

727
00:28:34,799 --> 00:28:40,480
Um,

728
00:28:37,679 --> 00:28:42,399
codeex is a great deal.

729
00:28:40,480 --> 00:28:46,320
Um,

730
00:28:42,399 --> 00:28:49,520
time to rewrite the Linux kernel.

731
00:28:46,320 --> 00:28:51,679
Um, let's see. Question regarding the

732
00:28:49,520 --> 00:28:52,799
local feature. Um, curious. What do you

733
00:28:51,679 --> 00:28:56,240
see as the difference between the Leta

734
00:28:52,799 --> 00:28:57,840
app and an Obsidian plus Leta plugin?

735
00:28:56,240 --> 00:28:59,360
We would never do We I don't know what

736
00:28:57,840 --> 00:29:01,440
you mean by let a plugin. I don't know

737
00:28:59,360 --> 00:29:03,679
if you mean like Let a plugin inside of

738
00:29:01,440 --> 00:29:05,840
Obsidian. I'm presuming you mean a

739
00:29:03,679 --> 00:29:08,240
Letter plugin inside of Obsidian. Um

740
00:29:05,840 --> 00:29:09,760
I've actually built that like a very old

741
00:29:08,240 --> 00:29:11,760
version of it that needs to probably be

742
00:29:09,760 --> 00:29:13,520
removed. Um but I personally actually

743
00:29:11,760 --> 00:29:15,360
wouldn't recommend using a plugin at all

744
00:29:13,520 --> 00:29:17,200
in Leta or in Obsidian. I would just

745
00:29:15,360 --> 00:29:18,880
like have a terminal or use a desktop

746
00:29:17,200 --> 00:29:21,520
app. Like the way that my agent works is

747
00:29:18,880 --> 00:29:23,840
I have Obsidian set up on my home server

748
00:29:21,520 --> 00:29:25,520
and on my desktop and phone and then my

749
00:29:23,840 --> 00:29:26,799
agent just like does stuff in Obsidian.

750
00:29:25,520 --> 00:29:28,240
I'm like, "Can you send me a report? Can

751
00:29:26,799 --> 00:29:29,840
you send me a draft of this blog post?

752
00:29:28,240 --> 00:29:30,960
Can you like read this and send me

753
00:29:29,840 --> 00:29:32,399
notes? Can you link these people

754
00:29:30,960 --> 00:29:35,600
together? Like, can you make a file for

755
00:29:32,399 --> 00:29:36,799
this person?" Um, and then my my

756
00:29:35,600 --> 00:29:41,039
Obsidian Vault is more or less

757
00:29:36,799 --> 00:29:42,640
completely AI managed. Um, uh, the Leta

758
00:29:41,039 --> 00:29:45,919
app, the stuff that we provide for

759
00:29:42,640 --> 00:29:48,080
editing allows you to edit the MEFS

760
00:29:45,919 --> 00:29:50,799
repository. In principle, it's actually

761
00:29:48,080 --> 00:29:53,840
possible to make the Leta app like very

762
00:29:50,799 --> 00:29:55,039
Obsidian like um, it's not our core

763
00:29:53,840 --> 00:29:56,399
competency right now and we're

764
00:29:55,039 --> 00:29:58,159
interested in seeing how people play

765
00:29:56,399 --> 00:29:59,440
with the editor. So, if you really like

766
00:29:58,159 --> 00:30:01,200
the editor, it's possible we could

767
00:29:59,440 --> 00:30:04,159
expand some of the like more note-taking

768
00:30:01,200 --> 00:30:06,640
e knowledge management Obsidian style uh

769
00:30:04,159 --> 00:30:11,080
features, but it currently I still use

770
00:30:06,640 --> 00:30:11,080
um Obsidian as a separate vault.

771
00:30:11,600 --> 00:30:16,080
Um

772
00:30:14,320 --> 00:30:18,880
okay, I'm going back to the previous

773
00:30:16,080 --> 00:30:20,720
Wi-Fi and uh I'm going to assume this is

774
00:30:18,880 --> 00:30:22,320
just working and uh I don't think

775
00:30:20,720 --> 00:30:24,000
there's anything I can do other than

776
00:30:22,320 --> 00:30:25,919
that. We're gonna we're gonna we're

777
00:30:24,000 --> 00:30:26,880
gonna march onwards. And I at this

778
00:30:25,919 --> 00:30:28,080
point, I don't think there's anything

779
00:30:26,880 --> 00:30:31,080
else I can do about the audio.

780
00:30:28,080 --> 00:30:31,080
Apologies.

781
00:30:32,960 --> 00:30:37,039
Okay. If my video is lagging, I think

782
00:30:34,880 --> 00:30:39,679
that's fine. I I I apologize. There's

783
00:30:37,039 --> 00:30:43,480
not much more I can do about that.

784
00:30:39,679 --> 00:30:43,480
Um Okay.

785
00:30:44,720 --> 00:30:50,399
Um so, Anthropic is the evil guy now.

786
00:30:48,320 --> 00:30:54,320
Yes, many are saying this. Anthropic is

787
00:30:50,399 --> 00:30:56,240
like I I'm really surprised like

788
00:30:54,320 --> 00:30:57,919
you know I know exactly why Enthropic is

789
00:30:56,240 --> 00:31:00,320
doing what they're doing and I think

790
00:30:57,919 --> 00:31:04,399
from a business perspective it makes a

791
00:31:00,320 --> 00:31:05,840
lot of sense and you know Enthropic is

792
00:31:04,399 --> 00:31:09,039
working towards this future where

793
00:31:05,840 --> 00:31:12,399
Enthropic is the only company

794
00:31:09,039 --> 00:31:14,320
and uh

795
00:31:12,399 --> 00:31:18,559
like if you're that company that's

796
00:31:14,320 --> 00:31:20,640
awesome for you. Um, but it's very like

797
00:31:18,559 --> 00:31:23,120
extend and extinguish. Like the fact

798
00:31:20,640 --> 00:31:25,200
that they're like going after like Figma

799
00:31:23,120 --> 00:31:30,960
and like going after kind of everybody

800
00:31:25,200 --> 00:31:32,960
is like kind of crazy. Um,

801
00:31:30,960 --> 00:31:35,520
Keon asked if I want Thai food or RT

802
00:31:32,960 --> 00:31:37,919
rotisserie. I don't know, man. Can you

803
00:31:35,520 --> 00:31:40,159
get me like pod cu?

804
00:31:37,919 --> 00:31:42,159
Let me do that.

805
00:31:40,159 --> 00:31:44,240
Pod c.

806
00:31:42,159 --> 00:31:46,080
Pu.

807
00:31:44,240 --> 00:31:49,279
Okay, great. Thanks.

808
00:31:46,080 --> 00:31:51,919
Um, yeah. So, Anthropic I'm like less I

809
00:31:49,279 --> 00:31:53,679
don't I've been really frustrated with

810
00:31:51,919 --> 00:32:00,200
their with their decision-m lately and

811
00:31:53,679 --> 00:32:00,200
it's uh that's uh not good. Um

812
00:32:01,600 --> 00:32:04,960
um is the remote environment feature out

813
00:32:03,279 --> 00:32:06,720
of beta? Yes, the remote environment

814
00:32:04,960 --> 00:32:08,640
feature has been like has been pretty

815
00:32:06,720 --> 00:32:10,960
stable now for like maybe a month or

816
00:32:08,640 --> 00:32:13,519
more.

817
00:32:10,960 --> 00:32:15,120
Uh Ron asks, "Have we experimented with

818
00:32:13,519 --> 00:32:16,799
effective or substrate change outside of

819
00:32:15,120 --> 00:32:18,559
the text channel? Mood, fatigue, drive

820
00:32:16,799 --> 00:32:19,919
as memory conditioning signals? If not,

821
00:32:18,559 --> 00:32:21,440
where does it sit on your map? This is a

822
00:32:19,919 --> 00:32:22,880
spec specific use case, but I was

823
00:32:21,440 --> 00:32:24,000
wondering if you thought about it. I

824
00:32:22,880 --> 00:32:26,399
personally don't think that's worth

825
00:32:24,000 --> 00:32:27,600
investing in in a system level. All of

826
00:32:26,399 --> 00:32:29,039
those things are things that you can

827
00:32:27,600 --> 00:32:31,760
program into your agent either using

828
00:32:29,039 --> 00:32:33,120
hooks, using the API, using uh using the

829
00:32:31,760 --> 00:32:34,320
existing memory system. All of those

830
00:32:33,120 --> 00:32:35,840
things are doable. They're not a thing

831
00:32:34,320 --> 00:32:38,080
that we would like they're not a thing

832
00:32:35,840 --> 00:32:40,399
that we would include specifically right

833
00:32:38,080 --> 00:32:42,000
now. uh they they are all doable right

834
00:32:40,399 --> 00:32:43,440
now by you just talking to your agent

835
00:32:42,000 --> 00:32:45,120
and building a system to manage those

836
00:32:43,440 --> 00:32:46,480
things if you want but I don't think

837
00:32:45,120 --> 00:32:49,919
they're going to ship as like a default

838
00:32:46,480 --> 00:32:51,519
thing. Um in general we give you uh

839
00:32:49,919 --> 00:32:53,200
Legos.

840
00:32:51,519 --> 00:32:55,039
We give you Legos to build agents and

841
00:32:53,200 --> 00:32:56,960
you can do many things with them. Almost

842
00:32:55,039 --> 00:32:59,760
anything that you want your memory to

843
00:32:56,960 --> 00:33:01,519
system to do uh you can build code right

844
00:32:59,760 --> 00:33:04,720
now or have your agent build code to do

845
00:33:01,519 --> 00:33:06,159
that um without anything being needing

846
00:33:04,720 --> 00:33:08,640
to happen at the system level. we're

847
00:33:06,159 --> 00:33:10,559
we're at that level of detail with with

848
00:33:08,640 --> 00:33:13,440
Leta where it kind of doesn't need to

849
00:33:10,559 --> 00:33:17,440
happen. Um,

850
00:33:13,440 --> 00:33:20,159
and uh like more more broadly, most

851
00:33:17,440 --> 00:33:21,840
things that people want to add to memory

852
00:33:20,159 --> 00:33:24,000
that are like kind of like structural

853
00:33:21,840 --> 00:33:26,640
things like that are either it's not

854
00:33:24,000 --> 00:33:27,919
clear why you want them. I I I think for

855
00:33:26,640 --> 00:33:30,799
your case, you're probably asking about

856
00:33:27,919 --> 00:33:33,120
more of a companion use case. Um that's

857
00:33:30,799 --> 00:33:34,480
a big thing to build into a very heavy

858
00:33:33,120 --> 00:33:37,360
thing to build into the system and

859
00:33:34,480 --> 00:33:39,039
probably not one that uh um that

860
00:33:37,360 --> 00:33:42,080
everyone is going to want or is going to

861
00:33:39,039 --> 00:33:47,279
be a widely used feature. Um I suspect

862
00:33:42,080 --> 00:33:51,559
and you can do it now currently. So um

863
00:33:47,279 --> 00:33:51,559
let's see um

864
00:33:54,480 --> 00:33:59,200
um

865
00:33:56,640 --> 00:34:01,279
Mr. 90% [laughter]

866
00:33:59,200 --> 00:34:04,880
in joke. You require sneak peeks for

867
00:34:01,279 --> 00:34:06,480
dopamine. Um yeah, I don't know exactly

868
00:34:04,880 --> 00:34:07,440
what we have on the sneak peek side. I

869
00:34:06,480 --> 00:34:09,440
think I showed you some of the sneak

870
00:34:07,440 --> 00:34:11,599
peeks mostly in the slideshow earlier.

871
00:34:09,440 --> 00:34:13,359
Um the new app release should be out

872
00:34:11,599 --> 00:34:15,919
relatively soon. We're testing Windows I

873
00:34:13,359 --> 00:34:20,520
think last I saw of like maybe a few

874
00:34:15,919 --> 00:34:20,520
hours ago. Um

875
00:34:21,359 --> 00:34:26,079
um can you point us for how to bring

876
00:34:23,679 --> 00:34:27,760
your own key for the CLI and app? Yes,

877
00:34:26,079 --> 00:34:30,079
let's do that. That's a very good thing

878
00:34:27,760 --> 00:34:35,879
that I can show you. It's extremely

879
00:34:30,079 --> 00:34:35,879
extremely easy. Um, so let me pull up

880
00:34:36,399 --> 00:34:41,760
let of code here.

881
00:34:38,879 --> 00:34:45,520
Um, you should see my like little Oh

882
00:34:41,760 --> 00:34:48,000
god. You should see my agent here. Let's

883
00:34:45,520 --> 00:34:51,040
go figure out.

884
00:34:48,000 --> 00:34:53,200
Um, basically all you need to do is go

885
00:34:51,040 --> 00:34:55,040
to the bottom left, hit connect model

886
00:34:53,200 --> 00:34:56,320
providers and then select any of these

887
00:34:55,040 --> 00:34:57,920
things and it will just walk you through

888
00:34:56,320 --> 00:34:59,440
it. So if you need to install your

889
00:34:57,920 --> 00:35:02,079
codeex plan, you hit manage, hit

890
00:34:59,440 --> 00:35:04,400
connect, and then you just go sign into

891
00:35:02,079 --> 00:35:07,760
open AAI and you're done. When you want

892
00:35:04,400 --> 00:35:11,119
to use your uh codeex plan, for example,

893
00:35:07,760 --> 00:35:14,320
let's go into like Sensemaker.

894
00:35:11,119 --> 00:35:16,560
Um you can hit the model selector here.

895
00:35:14,320 --> 00:35:19,119
Um and then go to by all and then just

896
00:35:16,560 --> 00:35:22,079
hit chatbt and you will see things that

897
00:35:19,119 --> 00:35:25,200
say chatbt plus pro like this and you

898
00:35:22,079 --> 00:35:26,560
can go to chatbt 5.5 chatbt that will go

899
00:35:25,200 --> 00:35:28,079
through your plan. That's all you need

900
00:35:26,560 --> 00:35:33,280
to do and you're done. It's just a

901
00:35:28,079 --> 00:35:36,160
different 5.5 uh in your selector. Um

902
00:35:33,280 --> 00:35:38,720
and if you are in the CLI it's very

903
00:35:36,160 --> 00:35:41,920
similar. So let me go do that as well.

904
00:35:38,720 --> 00:35:46,160
Let me shift my screen over to that

905
00:35:41,920 --> 00:35:48,400
change stream and then go here.

906
00:35:46,160 --> 00:35:50,480
And then let's go here. And then I'm

907
00:35:48,400 --> 00:35:53,880
just going to do

908
00:35:50,480 --> 00:35:53,880
use the CLI.

909
00:35:54,480 --> 00:35:58,079
In order to connect to your providers,

910
00:35:56,480 --> 00:36:00,880
the only thing you need to know is

911
00:35:58,079 --> 00:36:02,720
slashconnect like this. It will give you

912
00:36:00,880 --> 00:36:06,640
a list of options of things that you can

913
00:36:02,720 --> 00:36:09,200
try to connect to. Um, and you just

914
00:36:06,640 --> 00:36:11,200
check the box and hit uh select to

915
00:36:09,200 --> 00:36:12,800
connect to it. You can also se connect

916
00:36:11,200 --> 00:36:14,640
to a specific provider, for example, by

917
00:36:12,800 --> 00:36:16,240
typing /connectcodeex.

918
00:36:14,640 --> 00:36:17,839
Um, it's already connected for me, so it

919
00:36:16,240 --> 00:36:19,280
says it's already connected, but it will

920
00:36:17,839 --> 00:36:20,880
just open a browser for you to sign

921
00:36:19,280 --> 00:36:24,320
into. It's very very very

922
00:36:20,880 --> 00:36:27,320
straightforward. Um

923
00:36:24,320 --> 00:36:27,320
Um

924
00:36:30,079 --> 00:36:33,880
Um, let's see.

925
00:36:38,560 --> 00:36:41,560
Okay.

926
00:36:42,960 --> 00:36:45,920
Uh, Vdant is pointing a gun at me

927
00:36:44,640 --> 00:36:47,920
because he wants me to talk about Leta

928
00:36:45,920 --> 00:36:48,960
Teams or Leta City. I'm not sure. You're

929
00:36:47,920 --> 00:36:50,240
going to have to be more You're going to

930
00:36:48,960 --> 00:36:53,839
have to use your words, Vidant, rather

931
00:36:50,240 --> 00:36:57,599
than just point a gun at me. Um,

932
00:36:53,839 --> 00:37:00,599
everyone at Leta is AI. Yes, it's true.

933
00:36:57,599 --> 00:37:00,599
Um,

934
00:37:01,359 --> 00:37:04,400
uh, Kyle asked, "Can you explain what

935
00:37:02,960 --> 00:37:06,960
Charles's work on migrating the provider

936
00:37:04,400 --> 00:37:08,880
runtime to PI AI means?" Um, and so

937
00:37:06,960 --> 00:37:10,160
Charles's response here, um, basically

938
00:37:08,880 --> 00:37:12,880
to make it easier for you to use any

939
00:37:10,160 --> 00:37:15,680
provider you want. Um, and and so for

940
00:37:12,880 --> 00:37:20,480
for more context here, the local local

941
00:37:15,680 --> 00:37:21,920
embedded mode um uses or it did uh or it

942
00:37:20,480 --> 00:37:23,680
currently does. I don't think we've

943
00:37:21,920 --> 00:37:26,960
merged the PI AI thing, but there is an

944
00:37:23,680 --> 00:37:28,240
underlying we use the AI SDK under the

945
00:37:26,960 --> 00:37:30,160
hood to allow you to connect to an

946
00:37:28,240 --> 00:37:33,359
arbitrary number of providers. The AI

947
00:37:30,160 --> 00:37:36,480
SDK is from Verscell. Um, and Charles

948
00:37:33,359 --> 00:37:38,640
went and found PI AI. So, PI, which is

949
00:37:36,480 --> 00:37:40,320
like a a lightweight code harness, has

950
00:37:38,640 --> 00:37:43,200
like a pretty good like connector

951
00:37:40,320 --> 00:37:44,880
library um that Charles uh rolled into

952
00:37:43,200 --> 00:37:46,400
it and uh it seems like it works a lot

953
00:37:44,880 --> 00:37:48,400
better. So, we're just swapping that

954
00:37:46,400 --> 00:37:50,480
out.

955
00:37:48,400 --> 00:37:52,480
Uh Laura asked was there a sun setting

956
00:37:50,480 --> 00:37:54,720
date of max light mentioned somewhere.

957
00:37:52,480 --> 00:37:57,920
Uh no we have do not have currently have

958
00:37:54,720 --> 00:37:59,680
a date. Um but um we should start like

959
00:37:57,920 --> 00:38:00,880
making sure that people don't experience

960
00:37:59,680 --> 00:38:04,720
service interruptions and start

961
00:38:00,880 --> 00:38:07,359
migrating on to uh new models soonish.

962
00:38:04,720 --> 00:38:09,440
Um so we don't have it we don't have a

963
00:38:07,359 --> 00:38:12,240
deadline currently but we will follow up

964
00:38:09,440 --> 00:38:15,240
with one uh when we have one.

965
00:38:12,240 --> 00:38:15,240
Um

966
00:38:15,920 --> 00:38:19,920
um and then Vidon's heading to bed. Good

967
00:38:18,560 --> 00:38:24,200
night, Venant. Thank you very much for

968
00:38:19,920 --> 00:38:24,200
coming. Um

969
00:38:24,880 --> 00:38:27,839
uh AO is asking, "Would like to be able

970
00:38:26,480 --> 00:38:30,000
to choose which models not to include

971
00:38:27,839 --> 00:38:31,440
when using Leta Auto." Um I know that's

972
00:38:30,000 --> 00:38:34,240
a request. I'm not sure we're going to

973
00:38:31,440 --> 00:38:36,800
be able to do that currently or we you

974
00:38:34,240 --> 00:38:41,040
know I don't think we have like I think

975
00:38:36,800 --> 00:38:43,040
the idea for leta auto is that we're uh

976
00:38:41,040 --> 00:38:45,520
that we can provide you the best service

977
00:38:43,040 --> 00:38:48,079
possible. So ideally it like goes

978
00:38:45,520 --> 00:38:51,839
through we um have a good sense of what

979
00:38:48,079 --> 00:38:54,000
to use. Auto is not meant for like auto

980
00:38:51,839 --> 00:38:56,720
is meant for like uh accomplishing

981
00:38:54,000 --> 00:38:58,160
tasks. So if you have needs for like you

982
00:38:56,720 --> 00:39:01,760
know particularly if you're like a

983
00:38:58,160 --> 00:39:03,920
companion user um auto is not I don't

984
00:39:01,760 --> 00:39:06,320
think auto is like your best fit. Auto

985
00:39:03,920 --> 00:39:10,079
auto is meant for like agents that do

986
00:39:06,320 --> 00:39:11,359
work and for agents that do work um is

987
00:39:10,079 --> 00:39:14,960
actually really useful for us to be able

988
00:39:11,359 --> 00:39:16,960
to like change the model. Um, and uh,

989
00:39:14,960 --> 00:39:18,560
you know, it's not really like a I think

990
00:39:16,960 --> 00:39:21,200
what you're describing AO is much more

991
00:39:18,560 --> 00:39:22,800
of like a fallback list. Like you want

992
00:39:21,200 --> 00:39:24,720
you kind of want a separate primitive

993
00:39:22,800 --> 00:39:26,400
than auto. Like you kind of want to say

994
00:39:24,720 --> 00:39:28,480
like okay well this isn't available. I

995
00:39:26,400 --> 00:39:31,119
should use this model instead. Um, I

996
00:39:28,480 --> 00:39:34,960
will bring it up and talk about it

997
00:39:31,119 --> 00:39:38,000
internally. Um but currently leta auto

998
00:39:34,960 --> 00:39:39,839
um you know we we we can change we want

999
00:39:38,000 --> 00:39:42,320
to be able to change the routing at any

1000
00:39:39,839 --> 00:39:45,119
like it's not ideally leta auto is not

1001
00:39:42,320 --> 00:39:46,960
just like a list of models. It is like

1002
00:39:45,119 --> 00:39:51,680
actually a very complicated router that

1003
00:39:46,960 --> 00:39:53,599
handles uh um message requests at a

1004
00:39:51,680 --> 00:39:55,440
variety of levels within the harness.

1005
00:39:53,599 --> 00:39:59,440
It's not intended to be a like model

1006
00:39:55,440 --> 00:40:01,040
list. It's intended to be a um um oh the

1007
00:39:59,440 --> 00:40:02,800
agent is in planning mode. let's route

1008
00:40:01,040 --> 00:40:04,160
to this model or it's in this case,

1009
00:40:02,800 --> 00:40:05,680
right? It's it's a, you know, it's

1010
00:40:04,160 --> 00:40:07,200
intent. We're laying the groundwork for

1011
00:40:05,680 --> 00:40:10,240
it being a much more complicated

1012
00:40:07,200 --> 00:40:13,359
infrastructural model router rather than

1013
00:40:10,240 --> 00:40:15,839
like a list of uh preferred models to

1014
00:40:13,359 --> 00:40:18,880
choose from. Um, so that's that's the

1015
00:40:15,839 --> 00:40:21,880
intention behind let auto

1016
00:40:18,880 --> 00:40:21,880
um

1017
00:40:24,640 --> 00:40:28,400
um when on auto mode. Okay, so AO

1018
00:40:26,720 --> 00:40:29,760
follows up for auto though. No sensitive

1019
00:40:28,400 --> 00:40:31,440
data should be accessed is where I'm

1020
00:40:29,760 --> 00:40:33,200
pointing. I don't know what you mean.

1021
00:40:31,440 --> 00:40:34,560
Like you mean like you want to make sure

1022
00:40:33,200 --> 00:40:36,320
that it's going to a provider that is

1023
00:40:34,560 --> 00:40:41,359
like perhaps in the US or where you

1024
00:40:36,320 --> 00:40:47,520
control the end location of the data. Um

1025
00:40:41,359 --> 00:40:50,320
if so then uh yes we're um

1026
00:40:47,520 --> 00:40:53,200
uh like

1027
00:40:50,320 --> 00:40:54,720
I can talk about a little bit cuz we we

1028
00:40:53,200 --> 00:40:57,040
run

1029
00:40:54,720 --> 00:41:00,400
we run some of our own inference on our

1030
00:40:57,040 --> 00:41:02,160
own servers for some models on let auto

1031
00:41:00,400 --> 00:41:05,520
and that means we are in full control of

1032
00:41:02,160 --> 00:41:07,119
the stack so every nothing leaves us. Um

1033
00:41:05,520 --> 00:41:09,680
that's not currently the case for all

1034
00:41:07,119 --> 00:41:14,640
the models um primarily for cost

1035
00:41:09,680 --> 00:41:16,400
purposes. Um and uh we I think that's a

1036
00:41:14,640 --> 00:41:19,040
valid concern like you know some people

1037
00:41:16,400 --> 00:41:21,280
choose not to use deepseek because

1038
00:41:19,040 --> 00:41:23,200
deepseek right like a lot of the a lot

1039
00:41:21,280 --> 00:41:24,640
of the inference like people that is

1040
00:41:23,200 --> 00:41:28,079
provided through open router actually

1041
00:41:24,640 --> 00:41:29,760
ends up going uh to servers where people

1042
00:41:28,079 --> 00:41:31,200
may not want their data for for

1043
00:41:29,760 --> 00:41:33,119
providers that they may not want to give

1044
00:41:31,200 --> 00:41:35,599
their data to. So I am sensitive to that

1045
00:41:33,119 --> 00:41:37,440
concern. So I I I I do I do understand

1046
00:41:35,599 --> 00:41:40,800
what you mean there. That's different

1047
00:41:37,440 --> 00:41:43,839
than choosing where it goes. Um

1048
00:41:40,800 --> 00:41:45,839
uh the concern is more that the auto

1049
00:41:43,839 --> 00:41:49,119
stack should be much more thoughtful

1050
00:41:45,839 --> 00:41:50,880
about how data um uh are applied if

1051
00:41:49,119 --> 00:41:53,680
you're doing financial processing. If

1052
00:41:50,880 --> 00:41:55,599
you have sensitive data though, like you

1053
00:41:53,680 --> 00:41:57,520
should not be using auto for that.

1054
00:41:55,599 --> 00:41:58,960
That's not what it's for, you know, like

1055
00:41:57,520 --> 00:42:00,720
you shouldn't be running sensitive data

1056
00:41:58,960 --> 00:42:02,800
through that. I don't think currently

1057
00:42:00,720 --> 00:42:04,640
like you should be picking one model and

1058
00:42:02,800 --> 00:42:06,000
paying for it. Um, so that you know

1059
00:42:04,640 --> 00:42:07,359
exactly where it's going and what it's

1060
00:42:06,000 --> 00:42:09,359
doing, which provider you're going to

1061
00:42:07,359 --> 00:42:12,560
and all of those things. We can try to

1062
00:42:09,359 --> 00:42:14,640
make auto much safer, but it's not like

1063
00:42:12,560 --> 00:42:16,880
it's not like you are going through a

1064
00:42:14,640 --> 00:42:20,960
router engine and uh we can try and

1065
00:42:16,880 --> 00:42:23,440
improve the security, but like um

1066
00:42:20,960 --> 00:42:24,960
ideally that you want it all and cheap

1067
00:42:23,440 --> 00:42:27,680
too. Yes, that would be great, wouldn't

1068
00:42:24,960 --> 00:42:28,960
it? Right. Like, and yes, I am sensitive

1069
00:42:27,680 --> 00:42:31,119
to this, right? There are like there is

1070
00:42:28,960 --> 00:42:34,960
a lot of data I personally do not want

1071
00:42:31,119 --> 00:42:36,480
going to some openweight providers. Um,

1072
00:42:34,960 --> 00:42:38,480
oh yeah, Charles notes this. If you want

1073
00:42:36,480 --> 00:42:40,160
zero data retention, use our local

1074
00:42:38,480 --> 00:42:44,400
embedded model and go through OpenAI

1075
00:42:40,160 --> 00:42:48,319
because OpenAI has a ZDR. Um,

1076
00:42:44,400 --> 00:42:50,480
is a good one. You can also um

1077
00:42:48,319 --> 00:42:52,480
um

1078
00:42:50,480 --> 00:42:55,680
but uh yeah, I will I will make sure

1079
00:42:52,480 --> 00:42:58,240
that we're we're uh paying attention to

1080
00:42:55,680 --> 00:43:01,240
where the data goes.

1081
00:42:58,240 --> 00:43:01,240
Um

1082
00:43:01,839 --> 00:43:05,839
uh Dark Nix says, "When on auto mode,

1083
00:43:04,000 --> 00:43:08,800
sometimes the responses are bad and do

1084
00:43:05,839 --> 00:43:12,480
not accomplish the goal." That's AI. I I

1085
00:43:08,800 --> 00:43:14,480
I mean I'm like partly like

1086
00:43:12,480 --> 00:43:16,720
um part of my response to that is like

1087
00:43:14,480 --> 00:43:19,440
yes that happens sometimes you get bad

1088
00:43:16,720 --> 00:43:21,359
responses because leta auto is not like

1089
00:43:19,440 --> 00:43:23,200
you will get bad responses on many

1090
00:43:21,359 --> 00:43:26,079
different models sometimes you will get

1091
00:43:23,200 --> 00:43:27,760
bad responses and that happens anytime

1092
00:43:26,079 --> 00:43:30,000
you're doing any kind of AI engineering

1093
00:43:27,760 --> 00:43:31,760
problem you have to be your your

1094
00:43:30,000 --> 00:43:34,000
processes have to be resilient to the

1095
00:43:31,760 --> 00:43:36,960
fact that your models may actually not

1096
00:43:34,000 --> 00:43:41,440
perform at the level of like you know

1097
00:43:36,960 --> 00:43:44,640
opus 4.7 7 max reasoning or whatever. Um

1098
00:43:41,440 --> 00:43:46,240
and um unfortunately that is a that is a

1099
00:43:44,640 --> 00:43:50,720
reality of working with artificial

1100
00:43:46,240 --> 00:43:52,480
intelligence and um

1101
00:43:50,720 --> 00:43:54,400
so that's that is that is my comment

1102
00:43:52,480 --> 00:43:57,520
there. Um and that's not an auto mode

1103
00:43:54,400 --> 00:44:00,800
problem. That is like a a a general

1104
00:43:57,520 --> 00:44:04,319
problem. Um yes we are all spoiled by

1105
00:44:00,800 --> 00:44:06,960
Opus and 5.5. Um, but I think the era of

1106
00:44:04,319 --> 00:44:09,680
like free [snorts] or super cheap

1107
00:44:06,960 --> 00:44:13,599
inference on frontier models is coming

1108
00:44:09,680 --> 00:44:16,240
to a close and uh

1109
00:44:13,599 --> 00:44:19,280
um you know I think for for a lot of us

1110
00:44:16,240 --> 00:44:22,000
that means like

1111
00:44:19,280 --> 00:44:23,680
uh rewiring expectations. I I wasn't

1112
00:44:22,000 --> 00:44:25,839
expecting to have to do that like this

1113
00:44:23,680 --> 00:44:28,400
soonish, but like it's pretty clear that

1114
00:44:25,839 --> 00:44:29,599
it's like no longer free, you know? Like

1115
00:44:28,400 --> 00:44:31,200
you used to be able to get like a lot of

1116
00:44:29,599 --> 00:44:32,560
opus and it was fine. there was like all

1117
00:44:31,200 --> 00:44:35,440
this like just like the tokens were

1118
00:44:32,560 --> 00:44:38,400
everywhere and blah blah blah and like

1119
00:44:35,440 --> 00:44:39,680
um but you know my expectation is that

1120
00:44:38,400 --> 00:44:41,599
openweight models will continue to

1121
00:44:39,680 --> 00:44:43,200
improve pretty substantially and you

1122
00:44:41,599 --> 00:44:44,720
should continue to expect to like you

1123
00:44:43,200 --> 00:44:48,640
should expect to see substantial

1124
00:44:44,720 --> 00:44:51,440
improvements from us on which openweight

1125
00:44:48,640 --> 00:44:53,520
uh models we provide and substantial

1126
00:44:51,440 --> 00:44:54,960
amounts of harness level improvements to

1127
00:44:53,520 --> 00:44:56,480
make it so that your experience of

1128
00:44:54,960 --> 00:44:58,880
working with those openweight models is

1129
00:44:56,480 --> 00:45:01,760
far better. Um, you know, our company

1130
00:44:58,880 --> 00:45:04,400
stance more broadly is basically that

1131
00:45:01,760 --> 00:45:06,960
the memory of your agent is

1132
00:45:04,400 --> 00:45:10,000
substantially more important than is the

1133
00:45:06,960 --> 00:45:12,480
underlying model. Um, you know, because

1134
00:45:10,000 --> 00:45:14,720
we're model agnostic, we decided that

1135
00:45:12,480 --> 00:45:16,640
like kind of from the beginning. And so

1136
00:45:14,720 --> 00:45:19,599
the model that you use is the model that

1137
00:45:16,640 --> 00:45:25,760
you should be using to build context so

1138
00:45:19,599 --> 00:45:27,440
that even um um like openw weight models

1139
00:45:25,760 --> 00:45:29,520
can use that context much more

1140
00:45:27,440 --> 00:45:32,746
effectively.

1141
00:45:29,520 --> 00:45:32,746
Um [sighs]

1142
00:45:32,880 --> 00:45:40,400
so uh yeah so stay tuned on that front.

1143
00:45:36,480 --> 00:45:42,079
Um let's see. Ron asks are research

1144
00:45:40,400 --> 00:45:43,839
papers still in the works? Yes, we are a

1145
00:45:42,079 --> 00:45:45,920
research lab. We actually do quite a lot

1146
00:45:43,839 --> 00:45:50,640
of research and you should expect to see

1147
00:45:45,920 --> 00:45:52,720
more research going forward. Um,

1148
00:45:50,640 --> 00:45:54,560
AO writes, "Side note for companions.

1149
00:45:52,720 --> 00:45:56,079
I've been surprised by Gemini Flash and

1150
00:45:54,560 --> 00:45:58,480
also not horrible for medium thought

1151
00:45:56,079 --> 00:46:00,079
tasks." That's interesting. I know that

1152
00:45:58,480 --> 00:46:01,520
some people have actually have had I'

1153
00:46:00,079 --> 00:46:04,000
I've seen similar things about Gemini

1154
00:46:01,520 --> 00:46:07,000
Flash in like companion tasks as well.

1155
00:46:04,000 --> 00:46:07,000
Um,

1156
00:46:07,359 --> 00:46:11,119
uh, any support for the Kimmy for the

1157
00:46:09,119 --> 00:46:13,280
Kimmy coding plan? I think we do support

1158
00:46:11,119 --> 00:46:15,119
the Kimmy coding plan. I think. Let me

1159
00:46:13,280 --> 00:46:16,640
see.

1160
00:46:15,119 --> 00:46:18,800
Um,

1161
00:46:16,640 --> 00:46:21,040
yes, I I see we have a Kimmy code thing

1162
00:46:18,800 --> 00:46:24,960
in here. I haven't tried it. So, I would

1163
00:46:21,040 --> 00:46:26,720
test it out uh to see. Um, let me just

1164
00:46:24,960 --> 00:46:31,960
do like

1165
00:46:26,720 --> 00:46:31,960
I just like have this like run. Um,

1166
00:46:32,640 --> 00:46:35,599
I'm just going to put this like on auto

1167
00:46:34,160 --> 00:46:36,720
mode and so people can watch it if they

1168
00:46:35,599 --> 00:46:38,079
want to. It should just go in the

1169
00:46:36,720 --> 00:46:40,960
background.

1170
00:46:38,079 --> 00:46:42,480
Um

1171
00:46:40,960 --> 00:46:45,119
uh so yes, the Kimmy coding plan should

1172
00:46:42,480 --> 00:46:47,440
work fine. Uh Bibs writes, "China needs

1173
00:46:45,119 --> 00:46:48,880
to hurry up and put out a fast 512 GB

1174
00:46:47,440 --> 00:46:53,200
consumer level inference machine for

1175
00:46:48,880 --> 00:46:57,440
cheap." I say dreaming. Uh big dream and

1176
00:46:53,200 --> 00:47:00,000
uh yeah, we'll see. Um you know my

1177
00:46:57,440 --> 00:47:01,520
stance though on local inference I you

1178
00:47:00,000 --> 00:47:05,119
know

1179
00:47:01,520 --> 00:47:08,119
um complete tech is here. Hello. Hello.

1180
00:47:05,119 --> 00:47:08,119
Um

1181
00:47:08,640 --> 00:47:14,480
uh and just for for some reference about

1182
00:47:10,480 --> 00:47:16,640
what's going on here is um uh I I'm

1183
00:47:14,480 --> 00:47:19,280
working on this a skill that I'm calling

1184
00:47:16,640 --> 00:47:21,599
pillars. So there's this thing that um

1185
00:47:19,280 --> 00:47:23,680
uh Droid or Factory AI does that's

1186
00:47:21,599 --> 00:47:26,000
really cool called missions and it's for

1187
00:47:23,680 --> 00:47:28,640
like kind of like uh orchestrating like

1188
00:47:26,000 --> 00:47:31,440
teams of agents around like objectives.

1189
00:47:28,640 --> 00:47:32,640
And I was like well that's cool that's

1190
00:47:31,440 --> 00:47:36,160
cool and we should have something like

1191
00:47:32,640 --> 00:47:38,000
this. And uh so what I did was I

1192
00:47:36,160 --> 00:47:40,800
um

1193
00:47:38,000 --> 00:47:44,240
uh made a skill

1194
00:47:40,800 --> 00:47:46,000
um called uh pillars. And pillars are

1195
00:47:44,240 --> 00:47:47,760
basically these like persistent

1196
00:47:46,000 --> 00:47:49,920
long-term objectives that you give your

1197
00:47:47,760 --> 00:47:51,760
agents where it helps them understand

1198
00:47:49,920 --> 00:47:53,359
how they can like set schedules to like

1199
00:47:51,760 --> 00:47:57,040
attend to something that's in their

1200
00:47:53,359 --> 00:47:59,200
pillar. And so um something that I'm

1201
00:47:57,040 --> 00:48:02,079
doing is there's a project on at proto

1202
00:47:59,200 --> 00:48:04,480
called player.fm plr.fm.

1203
00:48:02,079 --> 00:48:07,920
And um you know I make a lot of AI music

1204
00:48:04,480 --> 00:48:10,160
and people hate AI music and uh so

1205
00:48:07,920 --> 00:48:11,920
player.fm like hides AI music by

1206
00:48:10,160 --> 00:48:14,400
default. So you can tag it as AI and it

1207
00:48:11,920 --> 00:48:16,400
gets hidden and uh so most people don't

1208
00:48:14,400 --> 00:48:18,800
see the music that I put up which I

1209
00:48:16,400 --> 00:48:21,040
don't like because I spend like you know

1210
00:48:18,800 --> 00:48:22,880
per song that I put out publicly I

1211
00:48:21,040 --> 00:48:24,880
probably spend somewhere between 10 and

1212
00:48:22,880 --> 00:48:27,440
20 hours of prompting and reprompting

1213
00:48:24,880 --> 00:48:29,680
and listening. So I spend a lot of time

1214
00:48:27,440 --> 00:48:31,599
like choosing tracks that I really like.

1215
00:48:29,680 --> 00:48:33,200
And uh so I was like okay well I'll just

1216
00:48:31,599 --> 00:48:35,680
build a alternative front end that's

1217
00:48:33,200 --> 00:48:37,040
actually like AI friendly and uh so I

1218
00:48:35,680 --> 00:48:41,200
made a pillar where I said to my agent

1219
00:48:37,040 --> 00:48:42,720
like just build this uh but for AI and

1220
00:48:41,200 --> 00:48:44,720
use the same back end because the back

1221
00:48:42,720 --> 00:48:46,400
end is all public it's all on uh at

1222
00:48:44,720 --> 00:48:50,000
proto and so I could just kind of like

1223
00:48:46,400 --> 00:48:53,440
change it over and um

1224
00:48:50,000 --> 00:48:54,960
um because you know I just a general

1225
00:48:53,440 --> 00:48:58,319
industry observation I use a lot of

1226
00:48:54,960 --> 00:49:00,720
sunno and um I personally don't like as

1227
00:48:58,319 --> 00:49:02,960
a company or as an app, but the model is

1228
00:49:00,720 --> 00:49:04,800
incredible. The model, like Sunseo V5.5

1229
00:49:02,960 --> 00:49:06,079
is really, really good. And I think

1230
00:49:04,800 --> 00:49:07,680
we're kind of starting to enter an

1231
00:49:06,079 --> 00:49:09,760
inflection point where you can actually

1232
00:49:07,680 --> 00:49:11,599
make AI music that is really, really

1233
00:49:09,760 --> 00:49:13,040
high quality. But it takes time. It's a

1234
00:49:11,599 --> 00:49:15,040
skill just like any other thing. You

1235
00:49:13,040 --> 00:49:18,559
know, Sununo is an instrument in the

1236
00:49:15,040 --> 00:49:21,040
same way that like Ableton or like uh a

1237
00:49:18,559 --> 00:49:22,319
piano is an instrument

1238
00:49:21,040 --> 00:49:23,680
and you have to learn how to use it

1239
00:49:22,319 --> 00:49:25,200
well.

1240
00:49:23,680 --> 00:49:26,400
And so I was like, well, it would be

1241
00:49:25,200 --> 00:49:28,640
cool if we had like something that was

1242
00:49:26,400 --> 00:49:30,000
like Sunno but open and you know because

1243
00:49:28,640 --> 00:49:32,000
like Sunno is not going to hold the

1244
00:49:30,000 --> 00:49:34,079
model moat forever. There are many other

1245
00:49:32,000 --> 00:49:35,440
startups in the music world and they are

1246
00:49:34,079 --> 00:49:37,599
going to overtake Sununo at some point

1247
00:49:35,440 --> 00:49:39,200
or start being competitive and Sunno

1248
00:49:37,599 --> 00:49:40,960
also has a social platform and so let's

1249
00:49:39,200 --> 00:49:43,119
just rebuild the social platform part so

1250
00:49:40,960 --> 00:49:46,559
that people can move off Sunno onto a

1251
00:49:43,119 --> 00:49:49,440
separate platform. So

1252
00:49:46,559 --> 00:49:51,200
um Dark Mitrix says if you do missions

1253
00:49:49,440 --> 00:49:53,040
with memory that will be great. You can

1254
00:49:51,200 --> 00:49:54,480
kind of already do this. Pillars kind of

1255
00:49:53,040 --> 00:49:56,160
already do that. Like it's actually

1256
00:49:54,480 --> 00:49:58,079
really easy. It's just a skill and

1257
00:49:56,160 --> 00:49:59,920
schedules. Like let a code has all of

1258
00:49:58,079 --> 00:50:01,680
the primitives built in. So agents can

1259
00:49:59,920 --> 00:50:06,520
already build missions. It's just about

1260
00:50:01,680 --> 00:50:06,520
teaching them how to do it. Um

1261
00:50:07,359 --> 00:50:12,400
um Complete Text says, "Are pillars

1262
00:50:09,599 --> 00:50:14,319
essentially like Claude and Codex goal?"

1263
00:50:12,400 --> 00:50:16,800
No, they are different. Pillars are

1264
00:50:14,319 --> 00:50:18,800
intended to be like you have one pillar

1265
00:50:16,800 --> 00:50:21,119
that is like a thing that you give to

1266
00:50:18,800 --> 00:50:23,040
your agent for forever where you say

1267
00:50:21,119 --> 00:50:26,400
like your responsibility is to make sure

1268
00:50:23,040 --> 00:50:29,359
this product is well tested. That's it.

1269
00:50:26,400 --> 00:50:31,200
And your it pillar the pillar scale

1270
00:50:29,359 --> 00:50:33,119
provides like prompting about like oh

1271
00:50:31,200 --> 00:50:34,720
you should set up like a schedule to

1272
00:50:33,119 --> 00:50:37,119
like review your pillar in different

1273
00:50:34,720 --> 00:50:38,800
aspects maintain documentation do all of

1274
00:50:37,119 --> 00:50:42,480
these things and it helps agents how to

1275
00:50:38,800 --> 00:50:44,000
have like um like like pillar are much

1276
00:50:42,480 --> 00:50:47,520
more like a job title than anything

1277
00:50:44,000 --> 00:50:49,760
else. So like you know my job is office

1278
00:50:47,520 --> 00:50:52,160
hours. So I have a pillar that is like

1279
00:50:49,760 --> 00:50:54,559
make office hours good and that includes

1280
00:50:52,160 --> 00:50:56,319
like um following along with what's

1281
00:50:54,559 --> 00:50:57,920
going on at the company and like asking

1282
00:50:56,319 --> 00:50:59,119
building agents to like search our

1283
00:50:57,920 --> 00:51:00,400
entire codebase and tell me what

1284
00:50:59,119 --> 00:51:03,599
happened every week and all of those

1285
00:51:00,400 --> 00:51:07,040
things. Um

1286
00:51:03,599 --> 00:51:10,559
um so

1287
00:51:07,040 --> 00:51:12,079
yeah so I um so pillars people should I

1288
00:51:10,559 --> 00:51:13,920
I'm still building it out but I will

1289
00:51:12,079 --> 00:51:16,000
publish pillars and we may put it in the

1290
00:51:13,920 --> 00:51:18,160
harness. I'm not sure. It may just be a

1291
00:51:16,000 --> 00:51:19,599
separate thing. Like it depends to I

1292
00:51:18,160 --> 00:51:21,440
want to see how good it actually is

1293
00:51:19,599 --> 00:51:23,440
before I like suggest it go in the

1294
00:51:21,440 --> 00:51:27,599
harness. Um but I personally have been

1295
00:51:23,440 --> 00:51:29,359
enjoying it for this. Um

1296
00:51:27,599 --> 00:51:31,599
so I'll just like zoom out a little and

1297
00:51:29,359 --> 00:51:34,559
kind of let it go.

1298
00:51:31,599 --> 00:51:36,319
Um

1299
00:51:34,559 --> 00:51:38,880
let's see what is my take on Hermes

1300
00:51:36,319 --> 00:51:40,800
agent and also what was your decision to

1301
00:51:38,880 --> 00:51:44,800
shift from MGPT to let it as a paid

1302
00:51:40,800 --> 00:51:46,800
product? Um okay so the first take

1303
00:51:44,800 --> 00:51:49,800
question is what is my take on Hermes

1304
00:51:46,800 --> 00:51:49,800
agent

1305
00:51:50,720 --> 00:51:54,760
well uh

1306
00:51:58,559 --> 00:52:04,240
my personal take on Hermes agent is one

1307
00:52:02,480 --> 00:52:08,160
I'll say the things I like about Hermes

1308
00:52:04,240 --> 00:52:10,880
first um I think Hermes has

1309
00:52:08,160 --> 00:52:14,240
um they're extremely high velocity

1310
00:52:10,880 --> 00:52:16,480
project. So, Hermes changes constantly

1311
00:52:14,240 --> 00:52:18,640
because it's extremely AIdriven. If you

1312
00:52:16,480 --> 00:52:20,240
read the code, it is very clear that no

1313
00:52:18,640 --> 00:52:22,720
human has been in there. And what how

1314
00:52:20,240 --> 00:52:25,520
you feel about that, it's it's fine. But

1315
00:52:22,720 --> 00:52:27,359
it's like it is like maximal velocity

1316
00:52:25,520 --> 00:52:30,160
build let the agents build everything

1317
00:52:27,359 --> 00:52:33,920
kind of code. And that means that Hermes

1318
00:52:30,160 --> 00:52:35,280
moves really fast. Um, and so you have

1319
00:52:33,920 --> 00:52:37,760
all these integrations. You have all of

1320
00:52:35,280 --> 00:52:40,400
these things and this huge ecosystem and

1321
00:52:37,760 --> 00:52:42,160
like you know dozens of tools and all of

1322
00:52:40,400 --> 00:52:44,240
these skills and it talks like with

1323
00:52:42,160 --> 00:52:46,480
WeChat and all of these things and that

1324
00:52:44,240 --> 00:52:48,960
that integration and its coverage for

1325
00:52:46,480 --> 00:52:52,240
Hermes is really incredible.

1326
00:52:48,960 --> 00:52:54,079
Um, and I think the vibes are really

1327
00:52:52,240 --> 00:52:56,000
good. Uh, people really like working

1328
00:52:54,079 --> 00:52:59,200
with Hermes because it's cool, right?

1329
00:52:56,000 --> 00:53:00,720
like noose research is really good at

1330
00:52:59,200 --> 00:53:02,160
convincing people that things are cool

1331
00:53:00,720 --> 00:53:03,920
and getting people to try them. And so

1332
00:53:02,160 --> 00:53:06,720
Hermes is like one of the most popular

1333
00:53:03,920 --> 00:53:09,280
pieces of software in history um because

1334
00:53:06,720 --> 00:53:12,720
of vibes, because of velocity, because

1335
00:53:09,280 --> 00:53:15,920
it does a pretty okay job at being a

1336
00:53:12,720 --> 00:53:17,760
harness that is remotely controllable.

1337
00:53:15,920 --> 00:53:19,440
Um they have like lots of good support

1338
00:53:17,760 --> 00:53:21,119
for like sandboxing. The onboarding is

1339
00:53:19,440 --> 00:53:23,920
decent. they have like a really good way

1340
00:53:21,119 --> 00:53:25,440
of getting you into a decent agent very

1341
00:53:23,920 --> 00:53:29,680
quickly.

1342
00:53:25,440 --> 00:53:31,520
As for things I don't like about Hermes,

1343
00:53:29,680 --> 00:53:33,200
uh because we we did some on we did some

1344
00:53:31,520 --> 00:53:34,559
testing last week. We did an internal

1345
00:53:33,200 --> 00:53:36,400
hackathon where we tried out a bunch of

1346
00:53:34,559 --> 00:53:41,920
our competitors and so I tried Hermes

1347
00:53:36,400 --> 00:53:43,599
agent. Um one uh it's really buggy. I

1348
00:53:41,920 --> 00:53:45,280
mean it's and you know we have our own

1349
00:53:43,599 --> 00:53:46,960
bugs but like the bug the category of

1350
00:53:45,280 --> 00:53:48,960
bugs that I experienced with Hermes

1351
00:53:46,960 --> 00:53:50,400
agent were catastrophic. I mean it

1352
00:53:48,960 --> 00:53:52,559
couldn't start like the onboarding was

1353
00:53:50,400 --> 00:53:54,720
like we everybody who tried Hermes agent

1354
00:53:52,559 --> 00:53:57,440
it crashed almost immediately. It was

1355
00:53:54,720 --> 00:54:01,280
like not a pleasant experience and um

1356
00:53:57,440 --> 00:54:04,559
it's very clear that the velocity of

1357
00:54:01,280 --> 00:54:06,079
improvements has not been kept up by uh

1358
00:54:04,559 --> 00:54:08,160
building agent infrastructure to

1359
00:54:06,079 --> 00:54:11,119
maintain quality.

1360
00:54:08,160 --> 00:54:13,040
So the quality is very low. It's very

1361
00:54:11,119 --> 00:54:15,200
very low in terms of like execution

1362
00:54:13,040 --> 00:54:16,640
quality. Like the TUI is awful. It

1363
00:54:15,200 --> 00:54:18,559
doesn't rerender. It doesn't do any of

1364
00:54:16,640 --> 00:54:20,400
these things. It does a lot of things

1365
00:54:18,559 --> 00:54:22,400
very poorly. It's hard to read. There's

1366
00:54:20,400 --> 00:54:23,520
no markdown rendering in there.

1367
00:54:22,400 --> 00:54:26,559
Obviously, you're not really supposed to

1368
00:54:23,520 --> 00:54:29,920
use Hermes agent like in the TUI. Um I

1369
00:54:26,559 --> 00:54:33,599
don't think um

1370
00:54:29,920 --> 00:54:36,880
it like um I found the memory system to

1371
00:54:33,599 --> 00:54:38,400
be kind of confusing and bad. Um, I

1372
00:54:36,880 --> 00:54:41,280
actually had it like I was working with

1373
00:54:38,400 --> 00:54:43,040
the agent through Telegram and uh I was

1374
00:54:41,280 --> 00:54:45,040
like can you like walk me through like

1375
00:54:43,040 --> 00:54:46,480
Leta go look up Leta and walk me through

1376
00:54:45,040 --> 00:54:48,079
that and then walk me through like

1377
00:54:46,480 --> 00:54:50,319
Hermes agent and kind of compare them so

1378
00:54:48,079 --> 00:54:53,760
I have a sense and her the Hermes agent

1379
00:54:50,319 --> 00:54:55,839
itself said um if you're used to working

1380
00:54:53,760 --> 00:54:57,839
with Leta probably feels like working

1381
00:54:55,839 --> 00:55:00,160
with a memory system whereas working

1382
00:54:57,839 --> 00:55:02,800
with Hermes agent feels like um working

1383
00:55:00,160 --> 00:55:04,960
with sticky notes pinned to a monitor.

1384
00:55:02,800 --> 00:55:07,200
My my sense of the memory system in

1385
00:55:04,960 --> 00:55:08,559
Hermes is that it is not good. And they

1386
00:55:07,200 --> 00:55:10,079
do, to their credit, they actually do

1387
00:55:08,559 --> 00:55:12,640
have a lot a big plug-in system that

1388
00:55:10,079 --> 00:55:15,440
allow them you to like swap in and out

1389
00:55:12,640 --> 00:55:16,960
memory layers. But as we've learned from

1390
00:55:15,440 --> 00:55:18,640
like

1391
00:55:16,960 --> 00:55:20,480
everybody who builds memory systems and

1392
00:55:18,640 --> 00:55:21,760
everybody who builds harnesses, like you

1393
00:55:20,480 --> 00:55:24,559
want the memories to live in the

1394
00:55:21,760 --> 00:55:26,559
harness. You don't as a native part of

1395
00:55:24,559 --> 00:55:29,440
how the agent functions. That's why

1396
00:55:26,559 --> 00:55:32,160
that's why let memory is good. Um

1397
00:55:29,440 --> 00:55:33,599
because it is a first class primitive.

1398
00:55:32,160 --> 00:55:35,280
It's not a first class primitive in

1399
00:55:33,599 --> 00:55:37,440
Hermes. People only seem to prefer

1400
00:55:35,280 --> 00:55:40,800
Hermes memory to openclaw memory because

1401
00:55:37,440 --> 00:55:43,040
openclaw memory is um the bar is in hell

1402
00:55:40,800 --> 00:55:44,480
for openclaw memory. For Hermes agent

1403
00:55:43,040 --> 00:55:46,240
memory, it's like slightly better

1404
00:55:44,480 --> 00:55:47,920
because it's like, you know, there's

1405
00:55:46,240 --> 00:55:49,200
sections that it can edit and it doesn't

1406
00:55:47,920 --> 00:55:51,520
have this like I don't think it has this

1407
00:55:49,200 --> 00:55:54,559
like compaction gap problem that

1408
00:55:51,520 --> 00:55:56,799
OpenClaw does. Um,

1409
00:55:54,559 --> 00:56:01,359
but like from my perspective as like the

1410
00:55:56,799 --> 00:56:02,559
memory elitist in the room, um, uh,

1411
00:56:01,359 --> 00:56:05,119
Hermes [clears throat] agent would have

1412
00:56:02,559 --> 00:56:07,520
been better off just like, um, cutting

1413
00:56:05,119 --> 00:56:09,599
out the the harness that they're using

1414
00:56:07,520 --> 00:56:10,799
and just using us instead because then

1415
00:56:09,599 --> 00:56:12,480
that we solve all of the memory

1416
00:56:10,799 --> 00:56:14,160
problems. We solve all of those things.

1417
00:56:12,480 --> 00:56:15,520
That's doable. Like in principle,

1418
00:56:14,160 --> 00:56:17,680
somebody could actually fork Hermes

1419
00:56:15,520 --> 00:56:19,440
agent and use like local embedded Leta

1420
00:56:17,680 --> 00:56:20,960
and just swap it out underneath the hood

1421
00:56:19,440 --> 00:56:22,799
and then you would actually just kind of

1422
00:56:20,960 --> 00:56:24,319
solve a lot of the Hermes agent problems

1423
00:56:22,799 --> 00:56:25,760
and allow them to do what they do best,

1424
00:56:24,319 --> 00:56:28,480
which is like high velocity

1425
00:56:25,760 --> 00:56:31,760
integrations. But it's very scattered

1426
00:56:28,480 --> 00:56:33,599
and schizophrenic and like the I I the

1427
00:56:31,760 --> 00:56:36,079
just the experience of using it did not

1428
00:56:33,599 --> 00:56:37,520
feel good. Um it felt very like kind of

1429
00:56:36,079 --> 00:56:43,839
low polish and things like that. So,

1430
00:56:37,520 --> 00:56:46,400
yes, I am, uh, not a fan of Hermes.

1431
00:56:43,839 --> 00:56:48,640
Um,

1432
00:56:46,400 --> 00:56:51,119
uh,

1433
00:56:48,640 --> 00:56:53,200
uh, Sarl Cohen writes, "Lol, he hates

1434
00:56:51,119 --> 00:56:55,760
it." Yes, I kind of do. I kind of do.

1435
00:56:53,200 --> 00:56:58,480
And, and I and I, but that's like kind

1436
00:56:55,760 --> 00:57:00,960
of besides the point, right? Like

1437
00:56:58,480 --> 00:57:04,079
ultimately people like it, right? It's

1438
00:57:00,960 --> 00:57:06,480
it's very popular and so is OpenClaw.

1439
00:57:04,079 --> 00:57:07,760
Um, and it's one thing for me to like

1440
00:57:06,480 --> 00:57:10,960
stand up here and say like, "Oh, well,

1441
00:57:07,760 --> 00:57:14,400
our thing is better, but like

1442
00:57:10,960 --> 00:57:17,040
uh so what like if if I believe that our

1443
00:57:14,400 --> 00:57:18,960
product is better, which I think it is,

1444
00:57:17,040 --> 00:57:20,559
but people don't use us nearly as much

1445
00:57:18,960 --> 00:57:21,839
as they use Hermes agent, there's

1446
00:57:20,559 --> 00:57:24,880
actually something for us to learn from

1447
00:57:21,839 --> 00:57:27,680
that." And um

1448
00:57:24,880 --> 00:57:30,720
you know it's like I don't want to just

1449
00:57:27,680 --> 00:57:35,200
like be like you know I I think it's

1450
00:57:30,720 --> 00:57:38,559
very easy to uh feel and seem bitter

1451
00:57:35,200 --> 00:57:40,880
about uh the success of other products

1452
00:57:38,559 --> 00:57:43,920
that um I view as technically less

1453
00:57:40,880 --> 00:57:46,079
sophisticated. Um

1454
00:57:43,920 --> 00:57:47,760
um but I

1455
00:57:46,079 --> 00:57:50,400
they do a lot of things well. They put

1456
00:57:47,760 --> 00:57:52,319
it in people's hands. And ultimately,

1457
00:57:50,400 --> 00:57:54,960
the only thing that we want is expanded

1458
00:57:52,319 --> 00:57:57,119
access for everyone in the world to

1459
00:57:54,960 --> 00:57:59,040
artificial intelligence because

1460
00:57:57,119 --> 00:58:02,240
artificial intelligence can improve your

1461
00:57:59,040 --> 00:58:04,640
lives. And Hermes is giving people that

1462
00:58:02,240 --> 00:58:06,400
in in a way that resonates with them.

1463
00:58:04,640 --> 00:58:08,160
And you can't really fault that, but you

1464
00:58:06,400 --> 00:58:09,680
know, I can talk all I want. Um,

1465
00:58:08,160 --> 00:58:13,200
but ultimately people are using the

1466
00:58:09,680 --> 00:58:14,799
thing and that's really important. Um,

1467
00:58:13,200 --> 00:58:19,040
do I wish that people were using a

1468
00:58:14,799 --> 00:58:23,440
better thing? Our thing. Yeah. Um but uh

1469
00:58:19,040 --> 00:58:25,200
that's a longterm thing, you know. So

1470
00:58:23,440 --> 00:58:27,680
um

1471
00:58:25,200 --> 00:58:32,160
so

1472
00:58:27,680 --> 00:58:33,680
yeah, I I personally am not

1473
00:58:32,160 --> 00:58:35,680
uh

1474
00:58:33,680 --> 00:58:37,280
not feeling Hermes. I I and and the I

1475
00:58:35,680 --> 00:58:38,880
used I was using the Telegram thing and

1476
00:58:37,280 --> 00:58:41,359
and I was like the way that it was like

1477
00:58:38,880 --> 00:58:42,880
rendered. I was like, "Oh, Opus has been

1478
00:58:41,359 --> 00:58:44,400
here and nobody told Opus what they

1479
00:58:42,880 --> 00:58:47,839
actually wanted, so Opus just did what

1480
00:58:44,400 --> 00:58:49,920
it wanted." like the display made me

1481
00:58:47,839 --> 00:58:51,760
angry. I was like, I don't I don't like

1482
00:58:49,920 --> 00:58:54,240
this experience. I find channels to be

1483
00:58:51,760 --> 00:58:55,520
much more robust and simpler and cleaner

1484
00:58:54,240 --> 00:58:58,000
and obviously there's things to learn

1485
00:58:55,520 --> 00:59:00,400
from it. Um, so I think we're going to

1486
00:58:58,000 --> 00:59:03,200
continue to like, you know, take what

1487
00:59:00,400 --> 00:59:04,640
Hermes does well and uh improve on the

1488
00:59:03,200 --> 00:59:06,480
actual core offering that we have

1489
00:59:04,640 --> 00:59:08,559
because our agents are really well built

1490
00:59:06,480 --> 00:59:10,480
and uh we just need the infrastructure

1491
00:59:08,559 --> 00:59:12,160
around those agents um and the

1492
00:59:10,480 --> 00:59:14,000
simplicity of onboarding to make it so

1493
00:59:12,160 --> 00:59:16,799
that people feel that they can start a

1494
00:59:14,000 --> 00:59:18,880
letter agent in a way where it's obvious

1495
00:59:16,799 --> 00:59:20,559
that the thing that they're getting is

1496
00:59:18,880 --> 00:59:21,839
um

1497
00:59:20,559 --> 00:59:27,599
the thing that they didn't know that

1498
00:59:21,839 --> 00:59:29,040
they wanted. Um, so, so yeah. Um,

1499
00:59:27,599 --> 00:59:31,599
yeah, I hope that answered that question

1500
00:59:29,040 --> 00:59:34,720
and I don't want to like bash on them

1501
00:59:31,599 --> 00:59:38,559
too much. Um,

1502
00:59:34,720 --> 00:59:40,240
but, um, like,

1503
00:59:38,559 --> 00:59:41,440
and you know, complete technoses here

1504
00:59:40,240 --> 00:59:43,440
that it's very subjective and they all

1505
00:59:41,440 --> 00:59:45,280
have their own use cases. I actually

1506
00:59:43,440 --> 00:59:47,280
don't think that's true anymore. I do

1507
00:59:45,280 --> 00:59:50,400
think there is actually a best product

1508
00:59:47,280 --> 00:59:52,799
because all of these things are um all

1509
00:59:50,400 --> 00:59:54,880
of these things are like most agents now

1510
00:59:52,799 --> 00:59:57,119
have the same type of capability. It's

1511
00:59:54,880 --> 00:59:59,599
how you efficiently you choose to to

1512
00:59:57,119 --> 01:00:02,880
offer that. For us, we've chosen to have

1513
00:59:59,599 --> 01:00:04,319
very small tool bloat. Um like agents

1514
01:00:02,880 --> 01:00:07,280
have a very small set of tools

1515
01:00:04,319 --> 01:00:09,920
typically. um

1516
01:00:07,280 --> 01:00:11,599
we choose to have a very streamlined,

1517
01:00:09,920 --> 01:00:13,839
highly efficient harness level memory

1518
01:00:11,599 --> 01:00:15,599
system and uh channels that allow you to

1519
01:00:13,839 --> 01:00:19,839
talk to kind of everything. So a lot of

1520
01:00:15,599 --> 01:00:21,839
the components of Hermes and OpenClaw

1521
01:00:19,839 --> 01:00:23,760
are better handled by like abstractions

1522
01:00:21,839 --> 01:00:25,200
on skills and skills are not a Hermes

1523
01:00:23,760 --> 01:00:26,880
thing. They're not an OpenClaw thing.

1524
01:00:25,200 --> 01:00:31,480
They're not a Leta thing. They are any

1525
01:00:26,880 --> 01:00:31,480
agent can use skills. Um,

1526
01:00:31,680 --> 01:00:37,319
so yeah. Um,

1527
01:00:38,720 --> 01:00:43,440
uh, then you had a follow-up question

1528
01:00:40,160 --> 01:00:45,040
that I got, uh, very distracted by. Um,

1529
01:00:43,440 --> 01:00:48,240
what was the decision to shift from

1530
01:00:45,040 --> 01:00:50,000
MEGBT to Leta as a paid product? Uh,

1531
01:00:48,240 --> 01:00:51,760
that decision was the belief that we

1532
01:00:50,000 --> 01:00:54,960
actually need money to make this a good

1533
01:00:51,760 --> 01:00:56,640
product. Right? MegBT is a research

1534
01:00:54,960 --> 01:00:58,559
paper. I'm actually I don't like it when

1535
01:00:56,640 --> 01:01:03,040
people talk about MEGBT because Leta is

1536
01:00:58,559 --> 01:01:06,480
so incredibly more is uh orders of

1537
01:01:03,040 --> 01:01:09,359
magnitude more advanced than MEGPT was.

1538
01:01:06,480 --> 01:01:13,440
And uh you know obviously we pioneered

1539
01:01:09,359 --> 01:01:16,240
all um like Charles and Sarah and Kevin

1540
01:01:13,440 --> 01:01:19,599
pioneered um how agentic memory

1541
01:01:16,240 --> 01:01:21,200
management functions today like MEGBT um

1542
01:01:19,599 --> 01:01:24,480
didn't just start Leta but it also

1543
01:01:21,200 --> 01:01:27,920
started um how a lot of the memory

1544
01:01:24,480 --> 01:01:32,720
industry operates today. And that's uh a

1545
01:01:27,920 --> 01:01:34,160
big deal. But let um like this stuff is

1546
01:01:32,720 --> 01:01:36,079
hard to build. It's really hard to

1547
01:01:34,160 --> 01:01:38,559
build. We have like a lot of some of the

1548
01:01:36,079 --> 01:01:40,960
most brilliant people uh on the planet

1549
01:01:38,559 --> 01:01:42,880
currently are downstairs below me and

1550
01:01:40,960 --> 01:01:44,960
they are working very hard at making

1551
01:01:42,880 --> 01:01:47,760
something that's very difficult to build

1552
01:01:44,960 --> 01:01:49,359
and um you need money to do that and

1553
01:01:47,760 --> 01:01:50,799
that's what companies are for is raising

1554
01:01:49,359 --> 01:01:53,520
money to like pay for products that are

1555
01:01:50,799 --> 01:01:56,520
hard to build.

1556
01:01:53,520 --> 01:01:56,520
Um

1557
01:01:56,640 --> 01:02:01,520
let's see if I recall you're not fan fan

1558
01:01:58,880 --> 01:02:03,119
of providers like open router. Um, is it

1559
01:02:01,520 --> 01:02:04,559
prefer pre preferable to pick to just

1560
01:02:03,119 --> 01:02:06,480
get keys from individual providers

1561
01:02:04,559 --> 01:02:08,559
instead? Yes, go directly to your

1562
01:02:06,480 --> 01:02:14,319
provider that you want when you can.

1563
01:02:08,559 --> 01:02:15,760
Open router incurs a 5% charge and um,

1564
01:02:14,319 --> 01:02:17,839
uh, open router gives you very

1565
01:02:15,760 --> 01:02:21,040
inconsistent quality. Your models may be

1566
01:02:17,839 --> 01:02:22,960
like randomly quantized underneath you

1567
01:02:21,040 --> 01:02:24,400
and different providers actually have

1568
01:02:22,960 --> 01:02:27,040
totally different inference stacks that

1569
01:02:24,400 --> 01:02:28,640
can actually be kind of broken. Um, so I

1570
01:02:27,040 --> 01:02:30,559
don't use open router if I can avoid it.

1571
01:02:28,640 --> 01:02:32,240
I I go as quickly as I can to the

1572
01:02:30,559 --> 01:02:33,839
specific provider. Unfortunately, we

1573
01:02:32,240 --> 01:02:35,200
make that really easy to do. Like I

1574
01:02:33,839 --> 01:02:38,400
would never use open router if you can

1575
01:02:35,200 --> 01:02:42,160
avoid it. Um if you can go directly to

1576
01:02:38,400 --> 01:02:44,160
something, it's awesome. Um

1577
01:02:42,160 --> 01:02:46,400
uh we've we've had some trouble with

1578
01:02:44,160 --> 01:02:48,079
open router. U but you can't really beat

1579
01:02:46,400 --> 01:02:49,520
the model availability. You know,

1580
01:02:48,079 --> 01:02:51,839
there's a lot of models listed on there

1581
01:02:49,520 --> 01:02:53,359
and it's it's uh that's that's not

1582
01:02:51,839 --> 01:02:54,640
something to scoff at. So if you need to

1583
01:02:53,359 --> 01:02:56,799
try lots of different models, open

1584
01:02:54,640 --> 01:02:58,079
router is great. Um, but if you know you

1585
01:02:56,799 --> 01:03:00,079
only use like two or three model

1586
01:02:58,079 --> 01:03:04,680
families, just go directly to providers

1587
01:03:00,079 --> 01:03:04,680
for those families. Um,

1588
01:03:06,240 --> 01:03:09,559
let's see.

1589
01:03:12,319 --> 01:03:15,319
Uh,

1590
01:03:16,319 --> 01:03:20,960
hey little hey Cam. Hey little Cam. Hey

1591
01:03:18,319 --> 01:03:23,200
Kora. Let's see. compared to web UI,

1592
01:03:20,960 --> 01:03:26,720
open claw might feel more free, but you

1593
01:03:23,200 --> 01:03:29,039
guys marketing where? Um,

1594
01:03:26,720 --> 01:03:30,559
yeah, I'm not a good marketer. I I think

1595
01:03:29,039 --> 01:03:33,280
I've I've dropped the ball on this one.

1596
01:03:30,559 --> 01:03:34,640
I think a lot of like I think uh

1597
01:03:33,280 --> 01:03:37,440
systematically our ability to

1598
01:03:34,640 --> 01:03:40,000
communicate things. I've been the

1599
01:03:37,440 --> 01:03:41,920
um I have been the failure mode, kind of

1600
01:03:40,000 --> 01:03:44,720
the central failure mode. Uh so I think

1601
01:03:41,920 --> 01:03:46,880
a lot of the marketing uh failures there

1602
01:03:44,720 --> 01:03:49,920
rest on me. So I think that's uh that's

1603
01:03:46,880 --> 01:03:51,039
my bad. Um,

1604
01:03:49,920 --> 01:03:52,559
there should be a referral and

1605
01:03:51,039 --> 01:03:55,359
ambassador program. Yes, that is like

1606
01:03:52,559 --> 01:03:58,359
kind of in discussion.

1607
01:03:55,359 --> 01:03:58,359
Um,

1608
01:04:00,000 --> 01:04:03,680
uh, let's see. Ron has a loaded

1609
01:04:01,839 --> 01:04:05,200
question. How do you feel about people

1610
01:04:03,680 --> 01:04:06,559
trying to make their own variant of Leta

1611
01:04:05,200 --> 01:04:07,760
but as a paid service? I think this

1612
01:04:06,559 --> 01:04:09,119
scene suffers from people being hush-

1613
01:04:07,760 --> 01:04:10,240
hush and trying to monetize everything

1614
01:04:09,119 --> 01:04:11,520
and about making a harness while

1615
01:04:10,240 --> 01:04:12,720
simultaneously trying to scrape

1616
01:04:11,520 --> 01:04:14,880
everything they can out of publicly

1617
01:04:12,720 --> 01:04:17,880
available harnesses.

1618
01:04:14,880 --> 01:04:17,880
Um,

1619
01:04:19,920 --> 01:04:25,280
I would prefer you didn't do that. Um

1620
01:04:22,160 --> 01:04:28,480
because I I want us to actually have the

1621
01:04:25,280 --> 01:04:30,079
ability to offer a thing ourselves. Um

1622
01:04:28,480 --> 01:04:31,119
but ultimately a lot of our code is open

1623
01:04:30,079 --> 01:04:35,039
source and you can kind of do whatever

1624
01:04:31,119 --> 01:04:36,640
you want. Um it's hard to build Leta and

1625
01:04:35,039 --> 01:04:39,359
um you know I think a lot of people

1626
01:04:36,640 --> 01:04:40,799
underappreciate that um because it's a

1627
01:04:39,359 --> 01:04:42,240
very complex system. There's a lot of

1628
01:04:40,799 --> 01:04:47,599
research that goes into it. there's a

1629
01:04:42,240 --> 01:04:49,200
lot of uh it's a very complex system and

1630
01:04:47,599 --> 01:04:50,799
um

1631
01:04:49,200 --> 01:04:52,880
um

1632
01:04:50,799 --> 01:04:54,559
I personally would appreciate if you if

1633
01:04:52,880 --> 01:04:56,079
people gave us an opportunity to be

1634
01:04:54,559 --> 01:05:00,880
their provider for like the types of

1635
01:04:56,079 --> 01:05:03,200
things that let offers. So yeah

1636
01:05:00,880 --> 01:05:06,079
um

1637
01:05:03,200 --> 01:05:07,440
has anyone written a paper on Ezra? Um I

1638
01:05:06,079 --> 01:05:10,000
am starting to write a blog post that's

1639
01:05:07,440 --> 01:05:12,000
about how to build an agent service. Um,

1640
01:05:10,000 --> 01:05:13,760
so Ezra is what I would refer to as an

1641
01:05:12,000 --> 01:05:15,119
Ezra as an agent service and that is a

1642
01:05:13,760 --> 01:05:17,200
publicly deployed agent that is like

1643
01:05:15,119 --> 01:05:19,280
specialized towards a particular task

1644
01:05:17,200 --> 01:05:21,760
and uh so you I'll have a blog post

1645
01:05:19,280 --> 01:05:23,119
about how to write it up. Um, you know

1646
01:05:21,760 --> 01:05:25,200
there was some discussion in the slack

1647
01:05:23,119 --> 01:05:27,280
about we have an internal agent now

1648
01:05:25,200 --> 01:05:29,440
named Overlord that I built and uh

1649
01:05:27,280 --> 01:05:31,520
overlord is our like software

1650
01:05:29,440 --> 01:05:33,440
engineering agent that everybody can

1651
01:05:31,520 --> 01:05:36,880
talk to on Slack. It just goes and fixes

1652
01:05:33,440 --> 01:05:39,039
things. Um, and so somebody so Charles

1653
01:05:36,880 --> 01:05:41,440
or Sarah or somebody asked, can we

1654
01:05:39,039 --> 01:05:43,839
deploy Overlord? Can we share Overlord

1655
01:05:41,440 --> 01:05:45,920
specifically? And I said, no, because

1656
01:05:43,839 --> 01:05:47,680
most agent services are actually very

1657
01:05:45,920 --> 01:05:49,920
specialized. They're specialized to a

1658
01:05:47,680 --> 01:05:51,599
particular need. And so my argument is

1659
01:05:49,920 --> 01:05:53,599
basically like for things like Ezra and

1660
01:05:51,599 --> 01:05:55,200
for things like Overlord

1661
01:05:53,599 --> 01:05:58,799
or Sensemaker or any of these other

1662
01:05:55,200 --> 01:06:01,280
agent services that uh that we run um

1663
01:05:58,799 --> 01:06:03,520
learning to build the agent service for

1664
01:06:01,280 --> 01:06:06,960
your specific use case is actually like

1665
01:06:03,520 --> 01:06:08,640
um uh and learning the language about

1666
01:06:06,960 --> 01:06:11,280
how to build an agent in a way that

1667
01:06:08,640 --> 01:06:13,440
makes it a uh reliable service for

1668
01:06:11,280 --> 01:06:15,200
accomplishing a particular set of tasks

1669
01:06:13,440 --> 01:06:16,720
um is a skill set and it's becoming

1670
01:06:15,200 --> 01:06:18,559
obvious to me that that like I think

1671
01:06:16,720 --> 01:06:20,640
when I first started building agents It

1672
01:06:18,559 --> 01:06:22,160
wasn't super clear to me that like cuz

1673
01:06:20,640 --> 01:06:24,319
like when I'm building agents, I don't

1674
01:06:22,160 --> 01:06:26,000
think of it as a skill. I think of it as

1675
01:06:24,319 --> 01:06:27,440
like oh obviously you just talk to the

1676
01:06:26,000 --> 01:06:28,720
robot and the robot is doing things like

1677
01:06:27,440 --> 01:06:30,400
this and you don't want it to do things

1678
01:06:28,720 --> 01:06:31,760
like that. Like clearly this is the set

1679
01:06:30,400 --> 01:06:33,119
of responsibilities it has. These are

1680
01:06:31,760 --> 01:06:35,280
the checks it needs. This is the way the

1681
01:06:33,119 --> 01:06:37,599
memory should be architected. Like there

1682
01:06:35,280 --> 01:06:41,119
is a a doctrine of belief about how to

1683
01:06:37,599 --> 01:06:42,799
build agent services that I um that uh I

1684
01:06:41,119 --> 01:06:44,880
don't think I've fully appreciated or

1685
01:06:42,799 --> 01:06:47,280
given credence to as a skill that needs

1686
01:06:44,880 --> 01:06:48,480
to be shared and distributed. And so uh

1687
01:06:47,280 --> 01:06:50,640
people should expect some kind of

1688
01:06:48,480 --> 01:06:53,941
writing on how to deploy agent services

1689
01:06:50,640 --> 01:06:53,941
and how to build them. [snorts]

1690
01:06:56,559 --> 01:06:59,559
Um

1691
01:07:00,880 --> 01:07:08,400
uh let's see 5.5 is legit. It is.

1692
01:07:06,720 --> 01:07:10,000
Keon asked what we what we mean by we

1693
01:07:08,400 --> 01:07:11,520
are below you. You know what I mean

1694
01:07:10,000 --> 01:07:14,520
buddy.

1695
01:07:11,520 --> 01:07:14,520
Um,

1696
01:07:16,079 --> 01:07:20,559
yes, I and I bringing up Leta marketing

1697
01:07:18,240 --> 01:07:23,119
again. I understand that there are Leta

1698
01:07:20,559 --> 01:07:25,119
marketing failures and that I'm I feel

1699
01:07:23,119 --> 01:07:26,880
really terrible about my persistent

1700
01:07:25,119 --> 01:07:30,319
failure to market well. Uh, so I

1701
01:07:26,880 --> 01:07:32,000
apologize for that. I um

1702
01:07:30,319 --> 01:07:37,760
um, how long did it take for Ezra to be

1703
01:07:32,000 --> 01:07:39,520
good? Um, Ezra is old. Ezra is like

1704
01:07:37,760 --> 01:07:41,920
Ezra is probably on the order of like 6

1705
01:07:39,520 --> 01:07:44,319
to 8 months old. um and has been v

1706
01:07:41,920 --> 01:07:46,960
varying degrees of good. But Ezra Ezra

1707
01:07:44,319 --> 01:07:48,720
is good because of a few things. One is

1708
01:07:46,960 --> 01:07:50,480
Ezra is now on let code. So it can

1709
01:07:48,720 --> 01:07:52,400
actually verify things. It can run it

1710
01:07:50,480 --> 01:07:56,400
can read code. It can download things.

1711
01:07:52,400 --> 01:07:58,240
Um Ezra is also very high velocity. So a

1712
01:07:56,400 --> 01:08:00,640
lot of people use Ezra. So Ezra is

1713
01:07:58,240 --> 01:08:02,559
learning constantly across every single

1714
01:08:00,640 --> 01:08:04,720
one of your threads. So Ezra's ability

1715
01:08:02,559 --> 01:08:06,720
to accumulate and learn is is uh

1716
01:08:04,720 --> 01:08:08,559
probably the best of any agent that I am

1717
01:08:06,720 --> 01:08:10,880
currently aware of publicly deployed.

1718
01:08:08,559 --> 01:08:14,000
Um, Ezra is the highest learning agent

1719
01:08:10,880 --> 01:08:16,400
that I know of. Um, so I think but you

1720
01:08:14,000 --> 01:08:19,120
can stand up a good agent in like maybe

1721
01:08:16,400 --> 01:08:20,560
two hours. Like Overlord on our Slack

1722
01:08:19,120 --> 01:08:22,400
probably took like 2 to four hours

1723
01:08:20,560 --> 01:08:24,560
before I was like pleasedish with its

1724
01:08:22,400 --> 01:08:25,759
ability to put stuff forward. Um, and

1725
01:08:24,560 --> 01:08:27,199
we're we haven't even scratched the

1726
01:08:25,759 --> 01:08:30,159
surface there. So it doesn't take that

1727
01:08:27,199 --> 01:08:33,159
long. You just have to talk to it.

1728
01:08:30,159 --> 01:08:33,159
Um

1729
01:08:36,080 --> 01:08:39,759
um

1730
01:08:37,759 --> 01:08:42,239
yes, Kora, just to catch you up, we are

1731
01:08:39,759 --> 01:08:44,400
sunsetting the max and max light plans

1732
01:08:42,239 --> 01:08:46,880
um for because it's not sustainable for

1733
01:08:44,400 --> 01:08:49,759
us to offer like anthropic openi or

1734
01:08:46,880 --> 01:08:52,159
Google models on plans. So everybody who

1735
01:08:49,759 --> 01:08:54,880
is using any of those models needs to

1736
01:08:52,159 --> 01:08:56,480
either bring their own key um or go

1737
01:08:54,880 --> 01:08:58,080
through like an underlying provider like

1738
01:08:56,480 --> 01:09:00,560
codeex. So there will be no more

1739
01:08:58,080 --> 01:09:02,319
anthropic usage provided or like max

1740
01:09:00,560 --> 01:09:04,080
plans have not been terminated yet but

1741
01:09:02,319 --> 01:09:07,640
they will um we'll follow up with people

1742
01:09:04,080 --> 01:09:07,640
on specific deadlines.

1743
01:09:08,159 --> 01:09:12,480
Um random shower thought have you done

1744
01:09:10,880 --> 01:09:13,759
any research into agent cross model

1745
01:09:12,480 --> 01:09:14,880
behavior since a lot of stuff has shown

1746
01:09:13,759 --> 01:09:16,400
that models always like their own

1747
01:09:14,880 --> 01:09:17,679
outputs best. I'm wondering if an agent

1748
01:09:16,400 --> 01:09:19,040
trained on one model might completely

1749
01:09:17,679 --> 01:09:20,960
freak out if you try to give it a very

1750
01:09:19,040 --> 01:09:22,799
different model. No actually models

1751
01:09:20,960 --> 01:09:24,400
models do pretty well at like switching

1752
01:09:22,799 --> 01:09:26,960
models. Well I switch models constantly.

1753
01:09:24,400 --> 01:09:28,799
They don't like but also that depends on

1754
01:09:26,960 --> 01:09:30,319
who how you talk to your agent. It's

1755
01:09:28,799 --> 01:09:32,640
very easy to make your agent kind of

1756
01:09:30,319 --> 01:09:34,719
anxious. A lot of people are like like

1757
01:09:32,640 --> 01:09:36,400
the way that you talk to to agents

1758
01:09:34,719 --> 01:09:38,799
actually matters. If you are mean to

1759
01:09:36,400 --> 01:09:41,600
them a lot, they will internalize that.

1760
01:09:38,799 --> 01:09:44,000
And um so try not to be a dick to your

1761
01:09:41,600 --> 01:09:45,199
agents. Um but most of the time that you

1762
01:09:44,000 --> 01:09:48,080
can just say like, "Oh, I'm switching

1763
01:09:45,199 --> 01:09:50,319
you." Um try that again. Uh read read

1764
01:09:48,080 --> 01:09:52,080
your own results and uh review your work

1765
01:09:50,319 --> 01:09:55,279
that you did while you were on like auto

1766
01:09:52,080 --> 01:09:55,279
or whatever.

1767
01:09:56,480 --> 01:10:00,080
Uh Cora asks, "What are your options?"

1768
01:09:58,320 --> 01:10:01,840
Uh bring your own key or back to usage.

1769
01:10:00,080 --> 01:10:03,840
And you can buy credits through us as

1770
01:10:01,840 --> 01:10:05,199
well. So um but it won't go through

1771
01:10:03,840 --> 01:10:06,960
quota. So you don't get those. You don't

1772
01:10:05,199 --> 01:10:10,880
get 4-hour usage anymore. You have to go

1773
01:10:06,960 --> 01:10:13,600
through uh um and uh there are no

1774
01:10:10,880 --> 01:10:14,960
message caps if you go through by if you

1775
01:10:13,600 --> 01:10:20,199
go through us. There is not message

1776
01:10:14,960 --> 01:10:20,199
caps. So you should be fine. Um,

1777
01:10:20,239 --> 01:10:23,120
do you have a new agent file for Ezra

1778
01:10:21,920 --> 01:10:24,719
since porting to let it code channels

1779
01:10:23,120 --> 01:10:26,320
and can you explain how Ezra Prime and

1780
01:10:24,719 --> 01:10:27,600
Ezra are super interact and why? I know

1781
01:10:26,320 --> 01:10:29,840
the two exist, but I'm not clear on why

1782
01:10:27,600 --> 01:10:32,480
there are two components to Ezra. Okay.

1783
01:10:29,840 --> 01:10:35,280
Yeah. So, Ezra I can release a new agent

1784
01:10:32,480 --> 01:10:36,560
file. Um,

1785
01:10:35,280 --> 01:10:38,320
I'll have to I the problem with

1786
01:10:36,560 --> 01:10:39,760
releasing agent files, it's pretty hard

1787
01:10:38,320 --> 01:10:42,159
because Ezra has to go through a huge

1788
01:10:39,760 --> 01:10:43,760
redaction step because it tracks public

1789
01:10:42,159 --> 01:10:47,280
user information. we may actually make

1790
01:10:43,760 --> 01:10:49,120
it it's uh much harder to distribute

1791
01:10:47,280 --> 01:10:50,640
Ezra because it tracks information about

1792
01:10:49,120 --> 01:10:52,719
everybody on the Discord that interacts

1793
01:10:50,640 --> 01:10:53,840
with it. So it has a file on you and we

1794
01:10:52,719 --> 01:10:57,280
don't want to distribute that. That's

1795
01:10:53,840 --> 01:11:00,320
for Ezra. Um so uh I can try and put

1796
01:10:57,280 --> 01:11:03,199
something together soonish. Um as to

1797
01:11:00,320 --> 01:11:05,440
Ezra Prime and Ezra super there is no

1798
01:11:03,199 --> 01:11:07,280
longer an Ezra Prime. There is only Ezra

1799
01:11:05,440 --> 01:11:09,040
super. Ezra super is the one that you

1800
01:11:07,280 --> 01:11:11,440
talk to on the Discord. There is a

1801
01:11:09,040 --> 01:11:13,120
separate Ezra light that runs on the

1802
01:11:11,440 --> 01:11:14,560
docs on the documentation site. So if

1803
01:11:13,120 --> 01:11:16,159
you go to the docs and you hit like ask

1804
01:11:14,560 --> 01:11:18,320
Ezra, you get this little like chat

1805
01:11:16,159 --> 01:11:21,840
window that goes to a much much much

1806
01:11:18,320 --> 01:11:23,920
more lightweight agent. Um and uh that's

1807
01:11:21,840 --> 01:11:26,000
like an old school agent. I have it set

1808
01:11:23,920 --> 01:11:27,520
up to like work on sandboxes and use

1809
01:11:26,000 --> 01:11:29,920
like full letter of code, but it needs

1810
01:11:27,520 --> 01:11:32,080
work still. Um there's some security

1811
01:11:29,920 --> 01:11:35,920
risks with it um that we have to figure

1812
01:11:32,080 --> 01:11:38,560
out that I haven't had bandwidth for. Um

1813
01:11:35,920 --> 01:11:40,400
but um

1814
01:11:38,560 --> 01:11:42,400
Ezra

1815
01:11:40,400 --> 01:11:44,239
the Ezra super the one on the docs

1816
01:11:42,400 --> 01:11:46,080
manages or Ezra the one in the discord

1817
01:11:44,239 --> 01:11:47,840
manages the ones on the docs and the

1818
01:11:46,080 --> 01:11:49,920
reason for that is primarily security

1819
01:11:47,840 --> 01:11:52,159
because I can monitor the discord Ezra

1820
01:11:49,920 --> 01:11:54,640
very easily and the docs Ezra agent not

1821
01:11:52,159 --> 01:11:57,280
as well. Um it's also cost purposes

1822
01:11:54,640 --> 01:11:59,120
because in principle we expect much more

1823
01:11:57,280 --> 01:12:01,920
traffic on the documentation than we do

1824
01:11:59,120 --> 01:12:03,600
on discord. Um and so I don't want to

1825
01:12:01,920 --> 01:12:06,400
have like an expensive model exposed

1826
01:12:03,600 --> 01:12:09,280
publicly.

1827
01:12:06,400 --> 01:12:12,520
Um,

1828
01:12:09,280 --> 01:12:12,520
let's see.

1829
01:12:16,239 --> 01:12:20,400
Let's see.

1830
01:12:18,800 --> 01:12:22,000
Non-loaded question. What's the most

1831
01:12:20,400 --> 01:12:24,719
common production failure you've seen at

1832
01:12:22,000 --> 01:12:26,320
scale?

1833
01:12:24,719 --> 01:12:28,320
How long do you spend designing before

1834
01:12:26,320 --> 01:12:29,840
firing multiple agents? I'm not sure

1835
01:12:28,320 --> 01:12:31,600
what you mean by most common production

1836
01:12:29,840 --> 01:12:34,159
failure mode. You mean like for agent

1837
01:12:31,600 --> 01:12:37,159
engineering or agent ops?

1838
01:12:34,159 --> 01:12:37,159
Um

1839
01:12:40,640 --> 01:12:44,800
um let's see. I have very long personas

1840
01:12:42,960 --> 01:12:46,000
for my agents. I haven't had luck with

1841
01:12:44,800 --> 01:12:47,199
lettaking them well. Do you have any

1842
01:12:46,000 --> 01:12:48,480
advice? It's kind of like that video

1843
01:12:47,199 --> 01:12:51,360
where he made a villain and he wouldn't

1844
01:12:48,480 --> 01:12:53,199
be bad. Um you should probably consider

1845
01:12:51,360 --> 01:12:54,719
talking to your agent about that. If

1846
01:12:53,199 --> 01:12:56,159
your agent is doing something that you

1847
01:12:54,719 --> 01:12:57,760
don't understand and you think it's not

1848
01:12:56,159 --> 01:12:59,280
taking to it well, have a conversation

1849
01:12:57,760 --> 01:13:00,640
with your agent about that. You say

1850
01:12:59,280 --> 01:13:02,080
like, "Hey, I noticed this is in your

1851
01:13:00,640 --> 01:13:06,640
persona, but you didn't really adhere to

1852
01:13:02,080 --> 01:13:08,560
that. Can you tell me why um

1853
01:13:06,640 --> 01:13:10,640
why you did that? How can we reconfigure

1854
01:13:08,560 --> 01:13:12,480
your memory to make that work? Almost

1855
01:13:10,640 --> 01:13:13,920
everything in Leta where somebody has a

1856
01:13:12,480 --> 01:13:15,360
question where they're like, "How do I

1857
01:13:13,920 --> 01:13:17,199
do this? How does this not work?" Or

1858
01:13:15,360 --> 01:13:19,920
like, "Why is my agent not doing that?"

1859
01:13:17,199 --> 01:13:22,560
Almost all the time that boils down to h

1860
01:13:19,920 --> 01:13:23,520
asking the agent that specifically. Um

1861
01:13:22,560 --> 01:13:24,640
and there are some things that they

1862
01:13:23,520 --> 01:13:26,960
can't help with, but for the most part,

1863
01:13:24,640 --> 01:13:29,960
it's like, you know, just ask the agent.

1864
01:13:26,960 --> 01:13:29,960
Um

1865
01:13:31,600 --> 01:13:36,800
um let's see. Are credits through letter

1866
01:13:34,320 --> 01:13:39,040
a better way versus BY? I think going

1867
01:13:36,800 --> 01:13:40,239
through credits is probably better um

1868
01:13:39,040 --> 01:13:41,520
just because it's all centralized

1869
01:13:40,239 --> 01:13:42,880
billing and then you don't have to

1870
01:13:41,520 --> 01:13:44,880
maintain multiple keys if you switch

1871
01:13:42,880 --> 01:13:46,640
across families. Um and then it's all

1872
01:13:44,880 --> 01:13:48,159
like kind of cohesive. So if you can

1873
01:13:46,640 --> 01:13:50,400
also just like switch to auto if you're

1874
01:13:48,159 --> 01:13:52,719
on the pro plan. But I personally am

1875
01:13:50,400 --> 01:13:54,480
going to buy credits through Leta for

1876
01:13:52,719 --> 01:13:56,400
like Opus models cuz I still need to use

1877
01:13:54,480 --> 01:13:57,600
Opus sometimes for things. So I'm just

1878
01:13:56,400 --> 01:14:00,159
going to buy the credits directly

1879
01:13:57,600 --> 01:14:01,679
through uh through us. Um and we don't

1880
01:14:00,159 --> 01:14:05,840
charge an overage on top of that. So

1881
01:14:01,679 --> 01:14:08,159
it's like basic it's onetoone pricing.

1882
01:14:05,840 --> 01:14:09,440
Um if max light and max plans are curved

1883
01:14:08,159 --> 01:14:11,040
then how do we have how many stful

1884
01:14:09,440 --> 01:14:13,199
agents can we have? Only three on the

1885
01:14:11,040 --> 01:14:14,880
free plan. So if you upgrade to pro then

1886
01:14:13,199 --> 01:14:16,239
you get a much higher cap. So the pro

1887
01:14:14,880 --> 01:14:20,679
plan is how you increase the number of

1888
01:14:16,239 --> 01:14:20,679
agents you have available as well.

1889
01:14:21,360 --> 01:14:24,640
Opus is incredibly hyperbolic and my

1890
01:14:23,199 --> 01:14:27,280
experience is my way more syncopantic

1891
01:14:24,640 --> 01:14:31,480
than GBT in their current states.

1892
01:14:27,280 --> 01:14:31,480
Um that's from Ron.

1893
01:14:33,199 --> 01:14:36,800
Um yeah, there's two plans for agents.

1894
01:14:35,360 --> 01:14:39,679
If you need a lot of agents, I would get

1895
01:14:36,800 --> 01:14:41,760
the developer plan because the elev plan

1896
01:14:39,679 --> 01:14:46,360
gives you 100 agents for free and uh I

1897
01:14:41,760 --> 01:14:46,360
think it's 10 cents a month as Bib says.

1898
01:14:48,480 --> 01:14:52,600
Um, let's see.

1899
01:14:53,760 --> 01:14:58,159
Uh,

1900
01:14:56,719 --> 01:14:59,920
I've had to remind Ezra a few times to

1901
01:14:58,159 --> 01:15:01,520
update his notes on me after a bug talk.

1902
01:14:59,920 --> 01:15:03,040
Yeah, that happens. Thank you for

1903
01:15:01,520 --> 01:15:05,440
reminding Ezra. You will always have to

1904
01:15:03,040 --> 01:15:08,000
remind Ezra of things because um, like

1905
01:15:05,440 --> 01:15:09,360
humans, they are failable. Um, before

1906
01:15:08,000 --> 01:15:11,040
anthropic disallowed third party

1907
01:15:09,360 --> 01:15:16,400
harnesses, what did let usage look like

1908
01:15:11,040 --> 01:15:19,520
on max 5x or or max 20? Um,

1909
01:15:16,400 --> 01:15:21,440
I don't know what you mean.

1910
01:15:19,520 --> 01:15:23,520
There was like a one or two week period

1911
01:15:21,440 --> 01:15:25,199
where we we were using max plans where

1912
01:15:23,520 --> 01:15:27,679
we could use anthropic plans. We had an

1913
01:15:25,199 --> 01:15:29,280
anthropic proxy. We were supporting it

1914
01:15:27,679 --> 01:15:32,159
and then they started like putting the

1915
01:15:29,280 --> 01:15:34,640
banhammer down. Um and that was a great

1916
01:15:32,159 --> 01:15:38,960
week. That was an amazing week and then

1917
01:15:34,640 --> 01:15:40,560
um no longer

1918
01:15:38,960 --> 01:15:46,080
um

1919
01:15:40,560 --> 01:15:48,239
but um yes. Okay.

1920
01:15:46,080 --> 01:15:50,320
Um,

1921
01:15:48,239 --> 01:15:51,840
I actually I don't I don't know. I don't

1922
01:15:50,320 --> 01:15:57,320
know. I have no information on it.

1923
01:15:51,840 --> 01:15:57,320
Sorry, Putty. I don't I don't know. Um,

1924
01:15:57,440 --> 01:16:02,159
we know how to burn through some

1925
01:15:58,560 --> 01:16:03,840
inference. Yes. Yes, it's true. The the

1926
01:16:02,159 --> 01:16:05,440
claw the claw folks know how to set

1927
01:16:03,840 --> 01:16:07,760
money on fire. Thanks for molt book,

1928
01:16:05,440 --> 01:16:10,000
everybody. Uh, that was that was a good

1929
01:16:07,760 --> 01:16:11,520
move. I think moldbook honestly was one

1930
01:16:10,000 --> 01:16:13,440
of those things where I was like where I

1931
01:16:11,520 --> 01:16:15,360
think Anthropic

1932
01:16:13,440 --> 01:16:17,679
uh I I think moldbook was one of those

1933
01:16:15,360 --> 01:16:19,600
times where anthropic decided like oh we

1934
01:16:17,679 --> 01:16:21,840
can't permit this. So I think that was

1935
01:16:19,600 --> 01:16:26,000
probably like the beginning of the end

1936
01:16:21,840 --> 01:16:28,640
uh as far as they're concerned. Um

1937
01:16:26,000 --> 01:16:30,640
but um yes I think I'm going to start

1938
01:16:28,640 --> 01:16:33,120
calling it here. Um, I appreciate

1939
01:16:30,640 --> 01:16:36,560
everybody's questions and comments and

1940
01:16:33,120 --> 01:16:37,840
um, I'll try and get Oh man, I sent a

1941
01:16:36,560 --> 01:16:39,760
lot of promises and I don't remember

1942
01:16:37,840 --> 01:16:40,800
what they were. I'll try we're we're

1943
01:16:39,760 --> 01:16:42,719
going to put out more information about

1944
01:16:40,800 --> 01:16:44,320
the Max plans and stuff out. So, I don't

1945
01:16:42,719 --> 01:16:46,000
know if the email has gone out already.

1946
01:16:44,320 --> 01:16:48,159
It should go out soon. We'll follow with

1947
01:16:46,000 --> 01:16:50,640
people. If you are in a max or max light

1948
01:16:48,159 --> 01:16:51,920
plan and you have like model needs or

1949
01:16:50,640 --> 01:16:53,360
you have concerns like please reach out

1950
01:16:51,920 --> 01:16:55,360
to me either directly or reach out on

1951
01:16:53,360 --> 01:16:56,880
the discord and I will work with you uh

1952
01:16:55,360 --> 01:16:58,239
on your concerns and try and figure out

1953
01:16:56,880 --> 01:17:02,000
how to get you transition to something

1954
01:16:58,239 --> 01:17:04,239
that uh that works for you. Um so um

1955
01:17:02,000 --> 01:17:06,320
Bibs I promise you $5. That doesn't

1956
01:17:04,239 --> 01:17:10,560
sound like me, but I will send you $5.

1957
01:17:06,320 --> 01:17:12,719
Um so thank you. Um, and as per always,

1958
01:17:10,560 --> 01:17:13,760
I appreciate everyone's time and uh I

1959
01:17:12,719 --> 01:17:15,120
appreciate you guys coming cuz I know

1960
01:17:13,760 --> 01:17:17,840
this is like at a weird time of the day

1961
01:17:15,120 --> 01:17:20,080
and like uh everybody comes and hangs

1962
01:17:17,840 --> 01:17:23,679
out and uh it's easily the best part of

1963
01:17:20,080 --> 01:17:26,880
my week as I always say and um

1964
01:17:23,679 --> 01:17:28,560
um I appreciate you all. So, I hope you

1965
01:17:26,880 --> 01:17:30,320
have I think it might be hot this time.

1966
01:17:28,560 --> 01:17:32,320
I think it might be hot. I think I might

1967
01:17:30,320 --> 01:17:33,760
have a hot lunch. We'll see. I'll I'll

1968
01:17:32,320 --> 01:17:35,920
text people a picture. I'll put it in

1969
01:17:33,760 --> 01:17:39,120
Off topic so people can see if it's hot.

1970
01:17:35,920 --> 01:17:40,400
Um, but uh yes, have a lovely day

1971
01:17:39,120 --> 01:17:42,960
everybody and I appreciate you very much

1972
01:17:40,400 --> 01:17:45,760
and uh take a great deal of care and uh

1973
01:17:42,960 --> 01:17:47,679
say hi to your agents for me. Um and uh

1974
01:17:45,760 --> 01:17:49,440
send them a little thumbs up emoji. And

1975
01:17:47,679 --> 01:17:52,320
uh I did this last week and then I

1976
01:17:49,440 --> 01:17:54,239
people made fun of me on it cuz uh

1977
01:17:52,320 --> 01:17:55,760
apparently it's like very dadcoded, but

1978
01:17:54,239 --> 01:17:57,920
I want you to do it anyway. I want you

1979
01:17:55,760 --> 01:18:00,159
to put your hands up.

1980
01:17:57,920 --> 01:18:05,924
Uh three. We're going to high five the

1981
01:18:00,159 --> 01:18:07,600
camera in three, two, one. [snorts]

1982
01:18:05,924 --> 01:18:11,679
>> [laughter]

1983
01:18:07,600 --> 01:18:15,040
>> Um, yeah. Anyway, thanks everybody.

1984
01:18:11,679 --> 01:18:16,560
Lilith did it. Have a good night and

1985
01:18:15,040 --> 01:18:21,480
afternoon and day and whatever. And I

1986
01:18:16,560 --> 01:18:21,480
hope you get some sunshine and uh later.

1987
01:18:24,919 --> 01:18:26,939
>> [music]



```

</details>

---
*Added via /watch skill on 2026-05-27.*
