# Formatting ([Formatter Name])

## Configuration

All formatting is handled by [formatter name and version if known]. Configuration is in `[config file path]`.

## Rules

### Indentation & Spacing

- **Indent width**: [value]
- **Indent style**: [Space/Tab]
- **Line ending**: [LF/CRLF]

### Quotes

- **JavaScript/TypeScript**: [Single/Double]
- **JSX**: [Single/Double]
- **JSON**: [Trailing comma policy or formatter default]

### Line Width

- **Maximum**: [value]
- [formatter] [automatically wraps long lines / follows default behavior]

### Semicolons

- **Policy**: [As needed / Always / Omit where possible]

### Trailing Commas

- **JavaScript/TypeScript**: [All / ES5 / None]
- **JSON**: [None / formatter default]

### Arrow Functions

- **Parentheses**: [Always required / formatter default]

```ts
// Correct
items.map((item) => item.id)

// Avoid if the repo requires parentheses
items.map(item => item.id)
```

### Other Rules

- **Bracket spacing**: [Enabled/Disabled]
- **Bracket same line**: [Enabled/Disabled]
- **Attribute position**: [Auto / repo-specific note]

## Usage

```bash
# Check formatting
[verified formatting check command]

# Auto-fix formatting
[verified formatting write command]

# Check linting
[verified lint command]

# Auto-fix linting issues
[verified lint --fix command if available]

# Check both
[verified combined command if available]

# Auto-fix both
[verified combined write command if available]
```

## Example

```tsx
[repo-faithful example that matches the formatter and export posture]
```

## Override Rules in Files

```ts
// [real ignore syntax]
const data: any = fetchData()
```
