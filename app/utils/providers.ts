export const STREAMING_PROVIDERS = {
  NETFLIX: 8,
  PRIME_VIDEO: 9,
  DISNEY_PLUS: 337,
  HULU: 15,
  HBO_MAX: 384,
  APPLE_TV: 2,
  PEACOCK: 386,
  PARAMOUNT_PLUS: 531
};

// Map provider IDs to their names for display
export const PROVIDER_NAMES = {
  [STREAMING_PROVIDERS.NETFLIX]: 'Netflix',
  [STREAMING_PROVIDERS.PRIME_VIDEO]: 'Prime Video',
  [STREAMING_PROVIDERS.DISNEY_PLUS]: 'Disney+',
  [STREAMING_PROVIDERS.HULU]: 'Hulu',
  [STREAMING_PROVIDERS.HBO_MAX]: 'HBO Max',
  [STREAMING_PROVIDERS.APPLE_TV]: 'Apple TV+',
  [STREAMING_PROVIDERS.PEACOCK]: 'Peacock',
  [STREAMING_PROVIDERS.PARAMOUNT_PLUS]: 'Paramount+'
};

// Map provider IDs to their logo URLs (can be updated with actual logos)
export const PROVIDER_LOGOS = {
  [STREAMING_PROVIDERS.NETFLIX]: '/providers/netflix.png',
  [STREAMING_PROVIDERS.PRIME_VIDEO]: '/providers/prime.png',
  [STREAMING_PROVIDERS.DISNEY_PLUS]: '/providers/disney.png',
  [STREAMING_PROVIDERS.HULU]: '/providers/hulu.png',
  [STREAMING_PROVIDERS.HBO_MAX]: '/providers/hbo.png',
  [STREAMING_PROVIDERS.APPLE_TV]: '/providers/apple.png',
  [STREAMING_PROVIDERS.PEACOCK]: '/providers/peacock.png',
  [STREAMING_PROVIDERS.PARAMOUNT_PLUS]: '/providers/paramount.png'
};