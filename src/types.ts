export type Tier = 'core' | 'extras';

export type ContentBias = 'global' | 'asian-friendly' | 'anime';

export interface Provider {
  /** Stable kebab-case identifier — safe to log, persist, and key on. */
  id: string;

  /** Human-friendly display name. */
  label: string;

  /** Where this provider sits in the recommended ordering. */
  tier: Tier;

  /**
   * Content bias hint:
   * - `global`         — Western/global title library.
   * - `asian-friendly` — usable for Asian films + dramas, typically with
   *                     multilingual soft-subtitle tracks.
   * - `anime`          — primarily anime catalogues.
   */
  bias: ContentBias;

  /**
   * Build the movie iframe URL for this provider given a TMDB movie id.
   * Return `null` if this provider does not serve movies.
   */
  buildMovieUrl: (tmdbId: number | string) => string | null;

  /**
   * Build the TV episode iframe URL. Return `null` if this provider does not
   * serve TV episodes, or if it requires identifiers other than TMDB id +
   * season + episode (e.g. a slug — those are out of scope for this package
   * and belong in a search-based shim).
   */
  buildTvUrl: (tmdbId: number | string, season: number, episode: number) => string | null;

  /**
   * Optional free-form notes about reliability, ad load, subtitle coverage,
   * known regional behaviour, etc. Not consumed programmatically — keep it
   * short and honest.
   */
  notes?: string;
}

export interface ProviderFilter {
  /** Filter by tier; pass `['core']` to omit extras. */
  tiers?: readonly Tier[];
  /** Filter by content bias. */
  bias?: readonly ContentBias[];
  /** Filter by provider id. */
  ids?: readonly string[];
}
