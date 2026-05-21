import { PROVIDERS } from './providers.js';
import type { ContentBias, Provider, ProviderFilter, Tier } from './types.js';

export { PROVIDERS } from './providers.js';
export type { ContentBias, Provider, ProviderFilter, Tier } from './types.js';

function getProviders(filter?: ProviderFilter): readonly Provider[] {
  if (!filter) return PROVIDERS;
  return PROVIDERS.filter((p) => {
    if (filter.tiers && !filter.tiers.includes(p.tier)) return false;
    if (filter.bias && !filter.bias.includes(p.bias)) return false;
    if (filter.ids && !filter.ids.includes(p.id)) return false;
    return true;
  });
}

export function listProviders(filter?: ProviderFilter): readonly Provider[] {
  return getProviders(filter);
}

/**
 * Build the ordered list of movie iframe URLs for a TMDB id. By default
 * returns every provider in package order (core first, extras after); pass a
 * filter to scope the result.
 */
export function buildMovieSources(tmdbId: number | string, filter?: ProviderFilter): string[] {
  const out: string[] = [];
  for (const provider of getProviders(filter)) {
    const url = provider.buildMovieUrl(tmdbId);
    if (url) out.push(url);
  }
  return out;
}

/**
 * Build the ordered list of TV episode iframe URLs for a TMDB id / season /
 * episode tuple.
 */
export function buildTvSources(
  tmdbId: number | string,
  season: number,
  episode: number,
  filter?: ProviderFilter,
): string[] {
  const out: string[] = [];
  for (const provider of getProviders(filter)) {
    const url = provider.buildTvUrl(tmdbId, season, episode);
    if (url) out.push(url);
  }
  return out;
}
