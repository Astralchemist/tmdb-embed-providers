# tmdb-embed-providers

Curated, typed list of TMDB-id-keyed video embed providers, with a built-in health-check helper. Two tiers:

- **`core`** — providers verified live and serving embed markup at release time. Seven entries: `vidfast`, `vidlink`, `vidsrc.pm`, `2embed.skin`, `vidsrc.to`, `vidsrc.cc`, `2embed.cc`.
- **`extras`** — Asian-content-friendly catalogues with multi-language soft subtitles. Five entries: `nontongo.win` (Indonesian-focused — strongest K/C/J-drama coverage), `autoembed.co`, `moviesapi.to`, `smashystream`, `frembed`.

Zero runtime dependencies. ESM. Typed.

> **Why a separate `extras` tier?** These rotate URLs and domains more frequently than the core providers. Run `probeProvider()` before promoting one to the top of your fallback chain.

## Install

```bash
npm install tmdb-embed-providers
```

## Build source URLs

```ts
import { buildMovieSources, buildTvSources } from 'tmdb-embed-providers';

// All providers in default order (core first, extras after)
const sources = buildMovieSources(27205); // Inception

// Asian-friendly extras only
const asian = buildMovieSources(496243, { bias: ['asian-friendly'] }); // Parasite

// Core only (skip the rotating extras)
const stable = buildTvSources(60059, 1, 1, { tiers: ['core'] }); // Better Call Saul S1E1

// Pick specific providers
const picked = buildMovieSources(27205, { ids: ['vidfast', 'nontongo'] });
```

Result is always a flat `string[]` of iframe URLs in priority order, suitable for the fallback chain in a player.

## Health-check before using

The library ships a `probeProvider()` helper that fetches a provider's embed URL, follows redirects, and classifies the response. Run it on startup (or on a cron) to prune dead URLs from your fallback chain.

```ts
import { probeAll, findLiveProviderIds, buildMovieSources } from 'tmdb-embed-providers';

// Print a table
const results = await probeAll();
for (const r of results) {
  console.log(`${r.providerId.padEnd(18)} ${r.status.padEnd(14)} ${r.httpStatus ?? '-'}  ${r.ms}ms`);
}

// Or: build a guaranteed-live source list at startup
const liveIds = await findLiveProviderIds();
const sources = buildMovieSources(27205, { ids: liveIds });
```

Possible `status` values:

| Status | Meaning |
|---|---|
| `alive-embed` | DNS + HTTP 2xx + body contains `iframe` / `<video>` / HLS markers. **Safe to use.** |
| `alive-spa` | DNS + HTTP 2xx but no obvious player markup. Likely a JS bootstrap shell — works in a real browser, untrusted from server-side. |
| `cf-challenge` | Returned a Cloudflare / DDoS-Guard challenge. Will work in a real browser, will not work via a server reverse-proxy. |
| `http-error` | 4xx/5xx that isn't a CF challenge. |
| `dead` | DNS does not resolve, or fetch errored. **Skip this provider.** |

```ts
import { probeProvider, listProviders } from 'tmdb-embed-providers';

for (const provider of listProviders({ tier: 'extras' })) {
  const result = await probeProvider(provider, { timeoutMs: 5000 });
  if (result.status === 'dead') console.warn(`${provider.id} is down: ${result.reason}`);
}
```

## Schema

```ts
interface Provider {
  id: string;                          // 'vidfast', 'nontongo', ...
  label: string;                       // 'VidFast', 'nontongo.win', ...
  tier: 'core' | 'extras';
  bias: 'global' | 'asian-friendly' | 'anime';
  buildMovieUrl: (tmdbId) => string | null;
  buildTvUrl: (tmdbId, season, episode) => string | null;
  notes?: string;
}
```

## What's verified, what's not

The provider list in this release was DNS-probed against `1.1.1.1` and HTTP-probed for both a movie (`TMDB 496243` — Parasite) and a TV episode (`TMDB 93405 S1E1` — Squid Game). Every `alive-embed` entry returned player markup at release. URLs marked `cf-challenge` in their `notes` field work in real browsers but return 403 to server-side fetches — treat those as direct-iframe-only.

This does not mean the URLs will keep working. Use `probeProvider()` in production.

## What's not in here (and why)

- **Search-based Asian-drama sources** (`kisskh.co`, `dramacool`-family, `kissanime`-family, aggregators like `consumet` / `anify`). These do not key by TMDB id — they require resolving title + year to a provider-specific slug first.
- **Anime-specific aggregators** that only take MAL or AniList ids (rather than TMDB).
- **DRM-protected services** (Crunchyroll, Viki). Different problem entirely.

## Pair with

- [`aetherly-embed-guard`](https://github.com/Astralchemist/aetherly-embed-guard) — server-side reverse proxy + iframe popup/redirect guard for these providers.
- [`aetherly-stream-proxy`](https://github.com/Astralchemist/aetherly-stream-proxy) — HLS / MP4 media proxy with per-request header forwarding.

## Changelog

### 0.1.1
- Removed dead providers: `autoembed.cc`, `moviesapi.club`, `vidsrc.icu`, `smashy.stream`, `embed.su`.
- Added verified-alive: `vidsrc.pm`, `2embed.skin`, `autoembed.co`, `moviesapi.to`, `nontongo.win`, `smashystream`, `frembed`.
- New `probeProvider()`, `probeAll()`, `findLiveProviderIds()` helpers.

### 0.1.0
- Initial release.

## License

MIT
