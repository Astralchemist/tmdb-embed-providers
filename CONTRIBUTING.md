# Contributing

Thanks for considering a contribution.

## Quick setup

```bash
git clone https://github.com/Astralchemist/tmdb-embed-providers.git
cd tmdb-embed-providers
npm install
npm run typecheck
npm run build
```

## Adding or removing a provider

Most contributions to this repo will be provider list maintenance. The list is intentionally small and curated — quality over quantity.

### Adding a provider

1. **Probe it first.** From your local machine:
   ```bash
   curl -sS -L -o /tmp/probe.html -w "%{http_code} %{content_type}\n" \
     --max-time 8 -A "Mozilla/5.0 ..." \
     'https://<provider>/<embed-path>'
   grep -iE 'iframe|jwplayer|hls\.|<video' /tmp/probe.html | head
   ```
   The response must be HTTP 200 with player markup. Cloudflare 403s are fine to add but mark the entry's `notes` field with `Cloudflare-gated server-side. Load as direct iframe.`

2. **Add an entry to `src/providers.ts`.**
   ```ts
   {
     id: 'kebab-case-id',
     label: 'human-readable name',
     tier: 'core' | 'extras',
     bias: 'global' | 'asian-friendly' | 'anime',
     buildMovieUrl: (id) => `https://...${n(id)}`,
     buildTvUrl: (id, s, e) => `https://...${n(id)}/${s}/${e}`,
     notes: 'Anything load-bearing: cf-gated, sandbox-detection, regional, etc.',
   }
   ```

3. **Pick the right tier.** `core` = stable global catalogues. `extras` = anything that rotates URLs frequently or has a narrower (Asian / language-specific) catalogue.

4. **Pick the right bias.** Honest is better than aspirational — if a provider is mostly Western content with occasional Asian uploads, that's `global`, not `asian-friendly`.

5. **Run `npm run typecheck && npm run build`** before opening the PR.

### Removing a provider

If a provider dies (`probeProvider()` returns `dead`), remove it in a PR rather than commenting it out. A "what was removed" line in the CHANGELOG is sufficient justification.

## Other welcome contributions

- **More precise probe heuristics.** The current `PLAYER_MARKERS` regex is conservative.
- **Tests.** A snapshot test of `buildMovieSources()` / `buildTvSources()` would catch regressions in the URL templates.
- **Docs.** Examples of using `findLiveProviderIds()` with a startup cache or cron job.

## PR checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] New providers were probed and verified
- [ ] CHANGELOG.md is updated for additions, removals, and helpers
- [ ] Commit messages are imperative, descriptive, and under 72 chars on the subject line

## Security disclosures

For security issues, please open a private security advisory on GitHub rather than a public issue.
