# Lighthouse / PSI

**Last attempt:** 2026-05-28
**Target:** https://frame-zero-phi.vercel.app

## Status: SKIPPED (no API key)

The unauthenticated PageSpeed Insights API endpoint
(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`) returned
HTTP 429 with `RATE_LIMIT_EXCEEDED` — the default per-day project quota for
Frame Zero's Google Cloud project is `0`, meaning anonymous calls require
an API key or a manual run from the web UI.

## How to score manually

1. Open https://pagespeed.web.dev/?url=https%3A%2F%2Fframe-zero-phi.vercel.app
2. Wait for both mobile + desktop runs to finish.
3. Append the scores below.

## Recorded scores

| Date       | Strategy | Perf | A11y | BP  | SEO | Notes |
|------------|----------|------|------|-----|-----|-------|
| (pending)  | mobile   |  —   |  —   |  —  |  —  | run from web UI |
| (pending)  | desktop  |  —   |  —   |  —  |  —  | run from web UI |
