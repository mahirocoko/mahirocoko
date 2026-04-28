# Lesson Learned: Conservative scrapers need real browser validation

**Tags**: scraping, playwright, clipboard, premium-boundaries, verification

When building a scraper against a real public site, selectors and browser behavior must be validated early with an actual dry-run. Static DOM assumptions are not enough for media-heavy pages. In this session, `networkidle` was too strict, some cards did not contain the expected image locator, and clipboard reads could return stale values unless the script waited for the copied value to change. The durable pattern is: wait for visible target selectors, treat missing optional elements as skippable data rather than fatal errors, poll clipboard-driven UI actions, and validate any downloaded media URL through a conservative allowlist.

For premium-gated content, the scraper should encode the ethical boundary directly in code: skip visible premium/upgrade markers, skip `/unlimited` links, do not log in by default, and never bypass gates. If authenticated access is later needed, make it an explicit user-owned session mode with clear terms/permission assumptions.
