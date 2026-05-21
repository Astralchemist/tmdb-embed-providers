import { listProviders } from './filter.js';
import type { Provider, ProviderFilter } from './types.js';

export { PROVIDERS } from './providers.js';
export type { ContentBias, Provider, ProviderFilter, Tier } from './types.js';
export { listProviders } from './filter.js';
export {
  probeProvider,
  probeAll,
  findLiveProviderIds,
} from './probe.js';
export type { ProbeOptions, ProbeResult, ProbeStatus } from './probe.js';

/**
 * Build the ordered list of movie iframe URLs for a TMDB id. By default
 * returns every provider in package order (core first, extras after); pass a
 * filter to scope the result.
 */
export function buildMovieSources(tmdbId: number | string, filter?: ProviderFilter): string[] {
  const out: string[] = [];
  for (const provider of listProviders(filter)) {
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
  for (const provider of listProviders(filter)) {
    const url = provider.buildTvUrl(tmdbId, season, episode);
    if (url) out.push(url);
  }
  return out;
}
