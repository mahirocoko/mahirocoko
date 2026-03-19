# File Organization

## Project Structure

```text
[repo-root]/
├── [top-level directory]        # [responsibility]
├── [top-level directory]        # [responsibility]
├── docs/                        # Repo documentation
├── AGENTS.md                    # Repo policy and engineering rules
├── README.md                    # Repo overview and quick commands
└── [important config files]     # [what they control]
```

## App Directory Structure

```text
[app-root]/
├── [entry files]
├── routes/                      # [route ownership note]
├── components/                  # [UI ownership note]
├── hooks/                       # [hook ownership note]
├── services/                    # [service ownership note or "when introduced"]
├── stores/                      # [state ownership note]
├── styles/                      # [styling ownership note]
├── types/                       # [shared types note]
└── utils/                       # [utility ownership note]
```

## Route Structure

[Document the real route system here.]

## File Naming Conventions

### Routes

- [route naming rule]

### Components

- [component file naming rule]

### Feature Partials

- [feature-folder grouping rule]

### Hooks

- [hook naming rule]

### Services

- [service folder or file naming rule]

### Stores

- [store folder or file naming rule]

### Types

- [type file naming rule]

### Constants

- [constant naming rule]

### Enums

- [enum naming rule]

### Utilities

- [utility naming rule]

## Component Organization

```text
[components-root]/
├── [feature area]               # [feature-specific partials]
├── layouts/                     # [layout composition]
└── ui/                          # [shared UI primitives]
```

## Hook Organization

```text
[hooks-root]/
└── [example hook or grouping]   # [ownership note]
```

## Service Organization

```text
[services-root]/
├── [base file or entry file]
├── [domain folder]/
│   ├── index.ts
│   └── utils.ts
└── ...
```

## Placement Rules

- Keep logic with its real owner until reuse is proven.
- Extract shared abstractions only after multi-consumer pressure appears.
- Keep feature-specific UI out of shared `ui/` layers until reuse is real.
