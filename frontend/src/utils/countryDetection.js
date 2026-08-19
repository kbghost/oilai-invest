import { WORLD_COUNTRIES, getCountryByCode } from '../data/countries';

/**
 * Mapping des fuseaux horaires connus vers leur code pays ISO2
 */
const TIMEZONE_TO_COUNTRY = {
  'Africa/Porto-Novo': 'BJ',
  'Africa/Abidjan': 'CI',
  'Africa/Lagos': 'NG',
  'Africa/Accra': 'GH',
  'Africa/Dakar': 'SN',
  'Africa/Ouagadougou': 'BF',
  'Africa/Lome': 'TG',
  'Africa/Niamey': 'NE',
  'Africa/Bamako': 'ML',
  'Africa/Conakry': 'GN',
  'Africa/Bissau': 'GW',
  'Africa/Monrovia': 'LR',
  'Africa/Freetown': 'SL',
  'Africa/Casablanca': 'MA',
  'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
  'Europe/Paris': 'FR',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Montreal': 'CA',
  'Asia/Tokyo': 'JP',
  'Asia/Dubai': 'AE',
};

/**
 * Tente de déterminer le pays le plus probable à partir de la langue du navigateur.
 */
function detectFromBrowserLanguage() {
  try {
    const langs = navigator.languages || [navigator.language || ''];
    for (const lang of langs) {
      if (!lang) continue;
      const parts = lang.split('-');
      if (parts.length > 1) {
        const countryCode = parts[parts.length - 1].toUpperCase();
        if (countryCode.length === 2) {
          const match = WORLD_COUNTRIES.find((c) => c.code === countryCode);
          if (match) return match;
        }
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

/**
 * Tente de déterminer le pays à partir du fuseau horaire du navigateur.
 */
function detectFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_COUNTRY[tz]) {
      return getCountryByCode(TIMEZONE_TO_COUNTRY[tz]);
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

/**
 * Tente de déterminer le pays probable à partir de l'IP en utilisant des API gratuites avec fallback.
 */
async function detectFromIP() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        const match = WORLD_COUNTRIES.find((c) => c.code === data.country_code.toUpperCase());
        if (match) return match;
      }
    }
  } catch (e) {
    // Premier fallback: ip-api.com
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://ip-api.com/json/?fields=status,countryCode', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success' && data.countryCode) {
          const match = WORLD_COUNTRIES.find((c) => c.code === data.countryCode.toUpperCase());
          if (match) return match;
        }
      }
    } catch (err) {
      // Ignorer
    }
  }
  return null;
}

/**
 * Fonction principale de détection intelligente combinée
 */
export async function detectUserCountry() {
  // 1. IP Geolocation (plus précis physiquement)
  const ipCountry = await detectFromIP();
  if (ipCountry) return { country: ipCountry, method: 'ip' };

  // 2. Langue du navigateur (ex: fr-BJ -> BJ)
  const langCountry = detectFromBrowserLanguage();
  if (langCountry) return { country: langCountry, method: 'browser_language' };

  // 3. Fuseau horaire du navigateur
  const tzCountry = detectFromTimezone();
  if (tzCountry) return { country: tzCountry, method: 'timezone' };

  // 4. Par défaut : Bénin ou France
  const defaultCountry = getCountryByCode('BJ');
  return { country: defaultCountry, method: 'default' };
}
