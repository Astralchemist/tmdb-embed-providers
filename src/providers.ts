import type { Provider } from './types.js';

function n(id: number | string): string {
  return String(id);
}

/**
 * Core tier — providers verified live and serving embed markup at the time of
 * release. Listed in recommended fallback order. `cf-gated` providers are
 * known to work in real browsers but return 403 to server-side fetches, so the
 * consumer should render those as a direct iframe rather than via a server
 * reverse-proxy.
 */
const CORE: Provider[] = [
  {
    id: 'vidfast',
    label: 'VidFast',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidfast.pro/movie/${n(id)}?autoPlay=true`,
    buildTvUrl: (id, s, e) => `https://vidfast.pro/tv/${n(id)}/${s}/${e}?autoPlay=true`,
    notes: 'Refuses to play inside a sandboxed iframe — load direct.',
  },
  {
    id: 'vidlink',
    label: 'VidLink',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidlink.pro/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidlink.pro/tv/${n(id)}/${s}/${e}`,
    notes: 'Same sandbox-detection behaviour as vidfast.',
  },
  {
    id: 'vidsrc-pm',
    label: 'vidsrc.pm',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidsrc.pm/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.pm/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'vidsrc family mirror with multi-language subtitle tracks.',
  },
  {
    id: '2embed-skin',
    label: '2embed.skin',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://www.2embed.skin/embed/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://www.2embed.skin/embedtv/${n(id)}&s=${s}&e=${e}`,
  },
  {
    id: 'vidsrc-to',
    label: 'vidsrc.to',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidsrc.to/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'Cloudflare-gated server-side. Load as direct iframe, not via reverse-proxy.',
  },
  {
    id: 'vidsrc-cc',
    label: 'vidsrc.cc',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'Cloudflare-gated server-side. Load as direct iframe.',
  },
  {
    id: '2embed-cc',
    label: '2embed.cc',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://www.2embed.cc/embed/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${n(id)}&s=${s}&e=${e}`,
    notes: 'Cloudflare-gated server-side. Load as direct iframe.',
  },
];

/**
 * Extras tier — Asian-content-friendly catalogues with multi-language soft
 * subtitle tracks. Verified live at release. These rotate URLs and domains
 * more frequently than the core tier — run `probeProvider()` before relying
 * on them in production.
 */
const EXTRAS: Provider[] = [
  {
    id: 'nontongo',
    label: 'nontongo.win',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://www.nontongo.win/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://www.nontongo.win/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'Indonesian-focused. Strongest K-drama / C-drama / J-drama coverage of the extras tier.',
  },
  {
    id: 'autoembed-co',
    label: 'autoembed.co',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://autoembed.co/movie/tmdb/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://autoembed.co/tv/tmdb/${n(id)}-${s}-${e}`,
    notes: 'Multi-language subs across drama + anime catalogues.',
  },
  {
    id: 'moviesapi-to',
    label: 'moviesapi.to',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://moviesapi.to/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://moviesapi.to/tv/${n(id)}-${s}-${e}`,
    notes: 'Multi-language subs common on dramas + anime.',
  },
  {
    id: 'smashystream',
    label: 'smashystream',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://player.smashystream.com/playere.php?tmdb=${n(id)}`,
    buildTvUrl: (id, s, e) => `https://player.smashystream.com/playere.php?tmdb=${n(id)}&season=${s}&episode=${e}`,
    notes: 'Aggregator across multiple servers; frequently surfaces Asian-drama uploads.',
  },
  {
    id: 'frembed',
    label: 'frembed',
    tier: 'extras',
    bias: 'global',
    buildMovieUrl: (id) => `https://frembed.icu/api/film.php?id=${n(id)}`,
    buildTvUrl: (id, s, e) => `https://frembed.icu/api/serie.php?id=${n(id)}&sa=${s}&epi=${e}`,
    notes: 'French-origin aggregator. Multilingual subtitle coverage including French, Arabic, Spanish.',
  },
];

export const PROVIDERS: readonly Provider[] = Object.freeze([...CORE, ...EXTRAS]);
