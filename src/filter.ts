import { PROVIDERS } from './providers.js';
import type { Provider, ProviderFilter } from './types.js';

export function listProviders(filter?: ProviderFilter): readonly Provider[] {
  if (!filter) return PROVIDERS;
  return PROVIDERS.filter((p) => {
    if (filter.tiers && !filter.tiers.includes(p.tier)) return false;
    if (filter.bias && !filter.bias.includes(p.bias)) return false;
    if (filter.ids && !filter.ids.includes(p.id)) return false;
    return true;
  });
}
