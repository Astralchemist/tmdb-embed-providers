# tmdb-embed-providers

Curated, typed list of TMDB-id-keyed video embed providers, split into two tiers:

- **`core`** — six stable providers that index Western / global catalogues (`vidfast`, `vidlink`, `embed.su`, `vidsrc.to`, `vidsrc.cc`, `2embed`).
- **`extras`** — five additional providers biased toward **Asian-content libraries with multi-language soft subtitles** (`autoembed.cc`, `multiembed.mov`, `moviesapi.club`, `vidsrc.icu`, `smashy.stream`). Useful when your core providers come up empty on K-drama / C-drama / J-drama / anime / Asian feature films.

Zero dependencies. ESM. Typed.

## Install

```bash
npm install tmdb-embed-providers
```

## Use

```ts
import { buildMovieSources, buildTvSources } from 'tmdb-embed-providers';

// All providers in default order (core first, extras after)
const sources = buildMovieSources(27205); // Inception

// Asian-friendly extras only
const asian = buildMovieSources(27205, { bias: ['asian-friendly'] });

// Core only (skip the rotating extras)
const stable = buildTvSources(60059, 1, 1, { tiers: ['core'] }); // Better Call Saul S1E1

// Pick specific providers
const picked = buildMovieSources(27205, { ids: ['vidfast', 'embedsu'] });
```

The result is always a flat `string[]` of iframe URLs in priority order, suitable for the fallback chain in a player (try first, if it fails try second, etc.).

## Filtering

```ts
import { listProviders } from 'tmdb-embed-providers';

listProviders({ bias: ['asian-friendly'] })
  .forEach((p) => console.log(p.id, p.label, p.notes));
```

## Schema

```ts
interface Provider {
  id: string;                          // 'vidfast', 'autoembed', ...
  label: string;                       // 'VidFast', 'autoembed.cc', ...
  tier: 'core' | 'extras';
  bias: 'global' | 'asian-friendly' | 'anime';
  buildMovieUrl: (tmdbId) => string | null;
  buildTvUrl: (tmdbId, season, episode) => string | null;
  notes?: string;
}
```

## Health-check this list before depending on it

These URLs are **not under my control**. The `extras` tier in particular rotates domains frequently — a provider that worked last month may serve 403s next month, and a new mirror may appear at a sibling TLD. Treat this package as a starting point, not a guarantee.

Recommended pattern: probe each URL on startup (or hourly via a job) and drop dead ones from your fallback chain before sending to the client.

## What's not in here (and why)

- **Search-based Asian-drama sources** (`kisskh.co`, `dramacool`-family, `kissanime`-family, aggregators like `consumet` / `anify`). These do not key by TMDB id — they require resolving title + year to a provider-specific slug first. That belongs in a separate search shim, not this URL-template list. A companion `tmdb-to-slug-resolver` package may follow.
- **Anime-specific aggregators** that only take MAL or AniList ids (rather than TMDB). Out of scope.
- **DRM-protected services** (Crunchyroll, Viki). Different problem entirely.

## Pair with

- [`aetherly-embed-guard`](https://github.com/Astralchemist/aetherly-embed-guard) — server-side reverse proxy + iframe popup/redirect guard for these providers.
- [`aetherly-stream-proxy`](https://github.com/Astralchemist/aetherly-stream-proxy) — HLS / MP4 media proxy with per-request header forwarding (for when you've extracted a direct stream URL and need to bypass `Referer` gating).

## License

MIT
