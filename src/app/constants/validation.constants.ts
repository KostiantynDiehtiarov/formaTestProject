/**
 * URL validation constants
 */
export const VALIDATION_CONSTANTS = {
  // TLD validation
  tld: {
    minLength: 2,
    maxLength: 63,
    pattern: /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i
  },
  // URL validation
  url: {
    minLength: 3
  },
  // Protocols
  protocols: {
    http: 'http://',
    https: 'https://'
  },
  // Valid TLD list
  validTlds: [
    // General TLD
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
    // Regional TLD
    'ua', 'uk', 'us', 'de', 'fr', 'it', 'es', 'pl', 'ru', 'by', 'kz',
    'ca', 'au', 'jp', 'cn', 'in', 'br', 'mx', 'ar', 'co', 'za',
    // New gTLD
    'io', 'ai', 'co', 'tv', 'me', 'dev', 'app', 'tech', 'online', 'site',
    'store', 'shop', 'blog', 'info', 'biz', 'xyz', 'pro', 'name', 'mobi',
    // Other common
    'eu', 'asia', 'travel', 'jobs', 'museum', 'tel', 'aero'
  ],
  // Local patterns (localhost addresses)
  localPatterns: ['localhost', '127.0.0.1', '0.0.0.0', '::1']
} as const;

