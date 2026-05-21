import type { Provider, ProviderFilter } from './types.js';
import { listProviders } from './filter.js';

export type ProbeStatus =
  /** DNS resolves and the embed page returned HTML containing iframe/video/HLS markers. */
  | 'alive-embed'
  /** DNS resolves, 2xx, but the body did not contain recognised player markers — usually a JS bootstrap shell that needs a real browser to be sure. */
  | 'alive-spa'
  /** Hit a Cloudflare / DDoS-Guard challenge page. May still work in a real browser. */
  | 'cf-challenge'
  /** DNS does not resolve, or fetch errored out. */
  | 'dead'
  /** Upstream responded but with a 4xx/5xx that isn't a cloudflare challenge. */
  | 'http-error';

export interface ProbeResult {
  providerId: string;
  status: ProbeStatus;
  httpStatus: number | null;
  contentBytes: number;
  finalUrl: string | null;
  ms: number;
  reason?: string;
}

export interface ProbeOptions {
  /** Per-request timeout, ms. */
  timeoutMs?: number;
  /** TMDB id used as the probe payload. Defaults to 27205 (Inception). */
  movieTmdbId?: number | string;
  /** Override the global `fetch`. */
  fetchImpl?: typeof fetch;
  /** User-Agent header sent upstream. */
  userAgent?: string;
}

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
const PLAYER_MARKERS = /iframe|jwplayer|hls\.|video-js|playerjs|videojs|<video/i;
const CHALLENGE_MARKERS =
  /cloudflare|just a moment|checking your browser|cf-chl-bypass|cf-browser-verification/i;

/**
 * Probe a single provider by hitting its `buildMovieUrl()` and classifying the
 * response. Use to prune dead URLs from a fallback chain at startup or on a
 * periodic health-check job.
 *
 * @returns A `ProbeResult` — never throws (network errors are reported as
 *          `status: 'dead'`).
 */
export async function probeProvider(
  provider: Provider,
  options: ProbeOptions = {},
): Promise<ProbeResult> {
  const movieTmdbId = options.movieTmdbId ?? 27205;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;

  const url = provider.buildMovieUrl(movieTmdbId);
  if (!url) {
    return {
      providerId: provider.id,
      status: 'dead',
      httpStatus: null,
      contentBytes: 0,
      finalUrl: null,
      ms: 0,
      reason: 'provider has no movie URL builder',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.google.com/',
      },
    });

    const text = await response.text();
    const ms = Date.now() - startedAt;
    const finalUrl = response.url || url;
    const httpStatus = response.status;
    const contentBytes = text.length;

    if (!response.ok) {
      if (CHALLENGE_MARKERS.test(text)) {
        return {
          providerId: provider.id,
          status: 'cf-challenge',
          httpStatus,
          contentBytes,
          finalUrl,
          ms,
        };
      }
      return {
        providerId: provider.id,
        status: 'http-error',
        httpStatus,
        contentBytes,
        finalUrl,
        ms,
      };
    }

    if (PLAYER_MARKERS.test(text)) {
      return {
        providerId: provider.id,
        status: 'alive-embed',
        httpStatus,
        contentBytes,
        finalUrl,
        ms,
      };
    }
    if (CHALLENGE_MARKERS.test(text)) {
      return {
        providerId: provider.id,
        status: 'cf-challenge',
        httpStatus,
        contentBytes,
        finalUrl,
        ms,
      };
    }
    return {
      providerId: provider.id,
      status: 'alive-spa',
      httpStatus,
      contentBytes,
      finalUrl,
      ms,
    };
  } catch (error) {
    const ms = Date.now() - startedAt;
    const reason = error instanceof Error ? error.message : 'unknown error';
    return {
      providerId: provider.id,
      status: 'dead',
      httpStatus: null,
      contentBytes: 0,
      finalUrl: null,
      ms,
      reason,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Probe every provider matching `filter` (defaults to all) in parallel. Useful
 * as a startup or cron-driven health check; classify each provider and prune
 * the dead ones from your fallback chain.
 */
export async function probeAll(
  filter?: ProviderFilter,
  options: ProbeOptions = {},
): Promise<ProbeResult[]> {
  const providers = listProviders(filter);
  return Promise.all(providers.map((p) => probeProvider(p, options)));
}

/**
 * Convenience: probe and return only the providers that responded with
 * recognisable player markup. Combine with `buildMovieSources` /
 * `buildTvSources` filtered by `ids` to build a guaranteed-live source list.
 */
export async function findLiveProviderIds(
  filter?: ProviderFilter,
  options: ProbeOptions = {},
): Promise<string[]> {
  const results = await probeAll(filter, options);
  return results.filter((r) => r.status === 'alive-embed').map((r) => r.providerId);
}
