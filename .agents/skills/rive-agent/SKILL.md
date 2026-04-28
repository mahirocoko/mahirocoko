---
name: rive-agent
description: Use when working with Rive animations, .riv runtime integration, Rive scripting, state machines, data binding, editor handoff specs, or troubleshooting Rive in React/Web/Native apps.
---

# Rive Agent

Use this skill to help an AI agent work safely and effectively around Rive: runtime integration, Rive scripting, data binding, state machines, and editor handoff specs.

This skill **does not** mean the agent can directly control the Rive Editor, edit `.riv` binaries, or create artwork inside `rive.app` by itself. Treat editor work as a human handoff unless a live Rive-native automation surface is explicitly available.

## Use When

- Integrating `.riv` files into React, Next.js, vanilla Web, React Native, Flutter, Apple, Android, Unity, or Unreal projects.
- Wiring state machines, data binding, view models, runtime asset loading, text, fonts, audio, or layout behavior.
- Writing or reviewing Rive scripts, including Node, Layout, Path Effect, Converter, Listener Action, Transition Condition, Util, or Test scripts.
- Turning a product/design request into clear Rive Editor steps for a human designer or animator.
- Debugging blank canvases, blurry rendering, missing assets, state machines that do not respond, runtime feature mismatches, or cleanup leaks.

## Hard Guardrails

- Do **not** claim direct external control of the Rive Editor.
- Do **not** claim the agent can edit `.riv` binary files directly.
- Do **not** treat the `llms.txt` OpenAPI link as proof of Rive editor automation; verify any API before relying on it.
- Prefer **Data Binding / View Models** for new runtime control. Use legacy State Machine Inputs or Events only when a file already depends on them.
- Separate editor instructions, runtime code, and Rive script code. Do not mix them into one ambiguous answer.
- Always ask for or state the required Rive contract: `.riv` path, artboard name, state machine name, view model name, property names, asset names, and renderer/package choice.

## Modes

Start every Rive answer by choosing one mode. If multiple modes are needed, label each section clearly.

### 1. Runtime Integration Mode

Use for app code that embeds and controls `.riv` files.

Checklist:

1. Identify platform: React, Next.js, vanilla Web, React Native, Flutter, Apple, Android, Unity, or Unreal.
2. Choose package/renderer:
   - React/Web default: `@rive-app/react-webgl2` when WebGL2/Rive Renderer features are needed.
   - React/Web fallback: `@rive-app/react-canvas` or `@rive-app/canvas` when package size or compatibility matters.
   - React Native: `rive-react-native`.
3. Confirm file loading strategy:
   - public URL/path, fetched bytes, cached Rive file, or app-native asset bundle.
4. Confirm Rive contract:
   - artboard name
   - state machine name
   - view model name
   - data binding property names and types
   - runtime-swappable asset/font names
5. Generate minimal code first, then add interactivity.
6. Include cleanup/remount and resize guidance when relevant.

Runtime gotchas:

- `.riv` should be treated as binary in git, e.g. `*.riv binary` in `.gitattributes`.
- Canvas/container must have real size.
- Web rendering may need resize handling for device pixel ratio crispness.
- Clean up Rive instances and decoded assets to avoid WASM/C++ resource leaks.
- Check feature support before using newer editor features in a runtime.

### 2. Rive Scripting Mode

Use for Luau scripts that run inside Rive's scripting environment.

Checklist:

1. Identify script protocol:
   - Node Script
   - Layout Script
   - Path Effect Script
   - Converter Script
   - Listener Action Script
   - Transition Condition Script
   - Util Script
   - Test Script
2. State script inputs and expected outputs.
3. Use the smallest script that proves the behavior.
4. Include a debug/test strategy when behavior is non-trivial.
5. Explain where the human should attach the script in the Rive Editor.

When writing scripts:

- Prefer clear names for nodes, inputs, properties, and view model fields.
- Keep generated scripts deterministic and easy to inspect.
- Include comments only where they explain Rive-specific behavior.
- If unsure about a specific API name, consult the official scripting API docs before finalizing.

### 3. Editor Handoff Mode

Use when the requested outcome requires visual creation, animation, rigging, data binding setup, or export actions in the Rive Editor.

Output a human-executable handoff:

1. **Goal**: what the Rive file should do.
2. **Artboards/components**: names and dimensions.
3. **Objects/assets**: shapes, imported images/SVGs, text, fonts, groups, bones, meshes, or layouts.
4. **Animation plan**: timelines, keys, easing, looping, constraints, joysticks, listeners, and state transitions.
5. **Data contract**: view model name, properties, types, defaults, enums, triggers, lists.
6. **Export contract**: exact artboard/state machine/view model/export names runtime code will use.
7. **Validation**: how to test in editor and runtime.

Phrase this as “do these steps in Rive” rather than “I edited Rive.”

## Recommended Answer Shape

```md
Mode: Runtime Integration / Rive Scripting / Editor Handoff

Assumptions:
- ...

Steps / Code / Handoff:
1. ...

Validation:
- ...

Docs:
- ...
```

## Common Docs

- Rive docs index for agents: https://uat.rive.app/docs/llms.txt
- AI Agent in Rive Editor: https://uat.rive.app/docs/editor/ai-agent/ai-agent.md
- Rive getting started: https://uat.rive.app/docs/getting-started/introduction.md
- Editor fundamentals: https://uat.rive.app/docs/editor/fundamentals/overview.md
- Exporting for runtime: https://uat.rive.app/docs/editor/exporting/exporting-for-runtime.md
- State machines: https://uat.rive.app/docs/editor/state-machine/state-machine.md
- Data binding overview: https://uat.rive.app/docs/editor/data-binding/overview.md
- Runtime getting started: https://uat.rive.app/docs/runtimes/getting-started.md
- Web runtime: https://uat.rive.app/docs/runtimes/web/web-js.md
- Web data binding: https://uat.rive.app/docs/runtimes/web/data-binding.md
- React runtime: https://uat.rive.app/docs/runtimes/react/react.md
- React data binding: https://uat.rive.app/docs/runtimes/react/data-binding.md
- Choose a renderer: https://uat.rive.app/docs/runtimes/choose-a-renderer/overview.md
- Feature support: https://uat.rive.app/docs/feature-support.md
- Scripting getting started: https://uat.rive.app/docs/scripting/getting-started.md
- Creating scripts: https://uat.rive.app/docs/scripting/creating-scripts.md
- Scripting protocols: https://uat.rive.app/docs/scripting/protocols/overview.md
- Script inputs: https://uat.rive.app/docs/scripting/script-inputs.md
- Scripting unit tests: https://uat.rive.app/docs/scripting/debugging/unit-testing.md

## Quick Recipes

### React runtime setup

Prefer the official React runtime that matches the renderer required by the file.

```tsx
import { useRive } from '@rive-app/react-webgl2';

export function RiveHero() {
  const { RiveComponent } = useRive({
    src: '/animations/hero.riv',
    artboard: 'Hero',
    stateMachines: 'Hero Machine',
    autoplay: true,
  });

  return <RiveComponent />;
}
```

Before finalizing, verify that `Hero` and `Hero Machine` are exported names in the `.riv` file.

### Editor handoff contract

```md
Rive file contract:
- Artboard: Hero
- State machine: Hero Machine
- View model: HeroViewModel
- Properties:
  - mood: enum('idle', 'happy', 'focused')
  - progress: number 0..100
  - avatarImage: image
- Runtime assets:
  - avatarImage must be swappable
- Export: runtime `.riv`
```

### Troubleshooting blank render

Check in order:

1. Is the `.riv` URL fetchable and served with the app?
2. Does the canvas/container have width and height?
3. Are artboard/state machine names exact?
4. Does the chosen runtime support the file's features?
5. Are external assets/fonts loaded or embedded correctly?
6. Are runtime errors visible in the console/logs?
