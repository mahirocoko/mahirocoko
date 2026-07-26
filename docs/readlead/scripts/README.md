# ReadLead research scraper

`research_scrape.py` is a deliberately bounded research probe. It is not a general crawler and must not be used to bypass source-site access controls.

## Contract

- Exactly two configured sites: `novelfull` and `wuxiaworld`
- Exactly five explicitly approved novels per site
- Exactly five chapters per novel
- One request at a time, at least 12 seconds between every request by default
- Maximum 60 requests, including `robots.txt`
- Robots check is mandatory; HTTP 401/403/429, bot challenges, login, paywall, redirect outside the approved host, or extraction failures stop that novel without retry
- No authentication, cookies, proxies, headless browser, retry loop, or anti-bot bypass
- Saves only extracted title/body text and source URL to `.agent-state/tmp/readlead-research/`; never commit sample source text to the repository

`novelfull.com` already returned a Cloudflare challenge during a basic access probe. Treat a stop there as an expected research result, not a reason to bypass it. `wuxiaworld.com` being fetchable or allowing a path in `robots.txt` does not grant copyright or reuse permission.

## Prepare targets

Copy the example outside of Git-tracked docs, then replace all placeholder first-chapter URLs with source URLs the customer is authorized to test:

```sh
cp docs/readlead/research-targets.example.json .agent-state/tmp/readlead-targets.json
```

## Dry-run first

```sh
/usr/bin/python3 docs/readlead/scripts/research_scrape.py \
  --targets .agent-state/tmp/readlead-targets.json
```

The default dry-run does not make network requests.

## Run the bounded probe

```sh
/usr/bin/python3 docs/readlead/scripts/research_scrape.py \
  --targets .agent-state/tmp/readlead-targets.json \
  --run \
  --delay-seconds 12 \
  --max-requests 60
```

A complete run contains 50 chapter pages plus up to two `robots.txt` requests, so the default delay alone makes it take at least about 10 minutes. Do not reduce the delay below 8 seconds or launch more than one run at a time.
