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
  'Africa/Douala': 'CM',
  'Africa/Libreville': 'GA',
  'Africa/Brazzaville': 'CG',
  'Africa/Kinshasa': 'CD',
  'Africa/Lubumbashi': 'CD',
  'Africa/Ndjamena': 'TD',
  'Africa/Bangui': 'CF',
  'Africa/Kigali': 'RW',
  'Africa/Nairobi': 'KE',
  'Africa/Addis_Ababa': 'ET',
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
  'Europe/Lisbon': 'PT',
  'Europe/Amsterdam': 'NL',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Montreal': 'CA',
  'America/Sao_Paulo': 'BR',
  'America/Bogota': 'CO',
  'America/Mexico_City': 'MX',
  'Asia/Tokyo': 'JP',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Singapore': 'SG',
};

/**
 * Tente de déterminer le pays le plus probable à partir de la langue du navigateur (0ms).
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
 * Tente de déterminer le pays à partir du fuseau horaire du navigateur (0ms).
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
 * Tente de déterminer le pays probable à partir de l'IP avec un timeout strict de 1.2s.
 */
async function detectFromIP() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

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
    // Fallback rapide avec timeout 1.2s
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

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
 * Fonction principale de détection intelligente ultra-rapide avec cache sessionStorage
 */
export async function detectUserCountry() {
  // 1. Cache sessionStorage (0ms - instantané lors des navigations)
  try {
    const cached = sessionStorage.getItem('oilai_detected_country');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.code) {
        const match = getCountryByCode(parsed.code) || parsed;
        return { country: match, method: 'cached' };
      }
    }
  } catch (e) {}

  // 2. Fuseau horaire du navigateur (0ms, ultra-précis localement)
  const tzCountry = detectFromTimezone();
  if (tzCountry) {
    try { sessionStorage.setItem('oilai_detected_country', JSON.stringify(tzCountry)); } catch (e) {}
    return { country: tzCountry, method: 'timezone' };
  }

  // 3. Langue du navigateur (ex: fr-BJ -> BJ, en-US -> US) (0ms)
  const langCountry = detectFromBrowserLanguage();
  if (langCountry) {
    try { sessionStorage.setItem('oilai_detected_country', JSON.stringify(langCountry)); } catch (e) {}
    return { country: langCountry, method: 'browser_language' };
  }

  // 4. Géolocalisation IP externe (seulement si tz & langue indéterminés)
  const ipCountry = await detectFromIP();
  if (ipCountry) {
    try { sessionStorage.setItem('oilai_detected_country', JSON.stringify(ipCountry)); } catch (e) {}
    return { country: ipCountry, method: 'ip' };
  }

  // 5. Par défaut : Bénin (BJ)
  const defaultCountry = getCountryByCode('BJ');
  try { sessionStorage.setItem('oilai_detected_country', JSON.stringify(defaultCountry)); } catch (e) {}
  return { country: defaultCountry, method: 'default' };
}
