import type { Provider } from './types.js';

function n(id: number | string): string {
  return String(id);
}

/**
 * Core tier — providers we've found to be the most stable for Western/global
 * catalogues. These are the same set used in Aetherly's default ordering.
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
    id: 'embedsu',
    label: 'embed.su',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://embed.su/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://embed.su/embed/tv/${n(id)}/${s}/${e}`,
  },
  {
    id: 'vidsrc-to',
    label: 'vidsrc.to',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidsrc.to/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${n(id)}/${s}/${e}`,
  },
  {
    id: 'vidsrc-cc',
    label: 'vidsrc.cc',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${n(id)}/${s}/${e}`,
  },
  {
    id: '2embed',
    label: '2embed',
    tier: 'core',
    bias: 'global',
    buildMovieUrl: (id) => `https://www.2embed.cc/embed/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${n(id)}&s=${s}&e=${e}`,
  },
];

/**
 * Extras tier — additional sources that frequently carry multi-language
 * subtitle tracks (Spanish, Portuguese, Arabic, Indonesian, Vietnamese, Thai,
 * Korean, Chinese, Japanese) and tend to surface Asian films + dramas that the
 * core English-first providers under-index.
 *
 * These rotate URLs / domains relatively often. Always run a health probe
 * before promoting one to your top of the fallback list, and treat 503s as
 * "dead, move on" rather than "retry forever".
 */
const EXTRAS: Provider[] = [
  {
    id: 'autoembed',
    label: 'autoembed.cc',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://player.autoembed.cc/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'Multiple sub languages on most titles, including K-drama / C-drama / anime.',
  },
  {
    id: 'multiembed',
    label: 'multiembed.mov',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://multiembed.mov/?video_id=${n(id)}&tmdb=1`,
    buildTvUrl: (id, s, e) => `https://multiembed.mov/?video_id=${n(id)}&tmdb=1&s=${s}&e=${e}`,
    notes: 'Carries Asian-drama uploads alongside Western titles. Verify health regularly.',
  },
  {
    id: 'moviesapi-club',
    label: 'moviesapi.club',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://moviesapi.club/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://moviesapi.club/tv/${n(id)}-${s}-${e}`,
    notes: 'Multi-language subtitles common on dramas + anime.',
  },
  {
    id: 'vidsrc-icu',
    label: 'vidsrc.icu',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://vidsrc.icu/embed/movie/${n(id)}`,
    buildTvUrl: (id, s, e) => `https://vidsrc.icu/embed/tv/${n(id)}/${s}/${e}`,
    notes: 'Sibling of the vidsrc family with stronger Asian-content coverage in our checks.',
  },
  {
    id: 'smashy-stream',
    label: 'smashy.stream',
    tier: 'extras',
    bias: 'asian-friendly',
    buildMovieUrl: (id) => `https://embed.smashy.stream/playere.php?tmdb=${n(id)}`,
    buildTvUrl: (id, s, e) => `https://embed.smashy.stream/playere.php?tmdb=${n(id)}&season=${s}&episode=${e}`,
    notes: 'Aggregator across multiple servers; often surfaces Asian-drama uploads.',
  },
];

export const PROVIDERS: readonly Provider[] = Object.freeze([...CORE, ...EXTRAS]);
