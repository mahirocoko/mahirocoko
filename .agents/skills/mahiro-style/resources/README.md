# mahiro-style resources

This folder contains fallback doctrine for Mahiro's cross-repo code style.

Keep the docs focused on code shape and repo boundaries, not framework-specific API details.

## Document Map

- `guide.md` - consolidated fallback guide
- `code-style.md` - naming, interfaces, imports, section order
- `structure.md` - file purpose and module boundaries
- `constants-i18n.md` - constants extraction with Lingui safety
- `services-state.md` - service/store/provider patterns
- `review-checklist.md` - fast evaluation checklist
- `anti-patterns.md` - common style drift

## Related Examples

See `../examples/README.md` for concrete `Do / Avoid` samples that make the doctrine easier to apply during review and refactor work.

That examples pack now covers naming, boundaries, i18n-safe constants extraction, services, stores, internal section order, and export style.
