# Anti-Patterns

- Giant route modules that combine types, config, helper maps, mock data, and full page rendering
- Refactors that technically pass checks but make ownership of code less clear
- Introducing new abstraction layers before checking the repo's existing constants or service patterns
- Losing i18n structure while trying to "clean up" copy placement
- Generic names such as `items`, `list`, `data`, `meta`, `config` when the domain can be stated directly
- Moving page-specific business rules into shared components just to reduce line count
- Treating style as formatting only instead of file purpose, naming, and boundaries
