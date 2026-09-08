// ─────────────────────────────────────────────
// Kharidari.pk — Pakistan Geolocation Service
// ─────────────────────────────────────────────

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Mardan',
  'Gujrat',
  'Kasur',
  'Rahim Yar Khan',
  'Sahiwal',
  'Okara',
  'Jhang',
  'Wah Cantt',
  'Mirpur Khas',
  'Nawabshah',
  'Muzaffarabad',
  'Gilgit',
];

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa (KPK)',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir (AJK)',
  'Gilgit-Baltistan',
];

export interface GeoLocation {
  city: string;
  region: string;
  country: string;
  isPakistan: boolean;
}

/**
 * Detect user's Pakistan city via IP geolocation (ipapi.co)
 * Falls back to Karachi if detection fails or user is outside Pakistan
 */
export async function detectPakistanCity(): Promise<GeoLocation> {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error('Geo API failed');

    const data = await res.json();

    if (data.country_code !== 'PK') {
      return { city: 'Karachi', region: 'Sindh', country: 'Pakistan', isPakistan: false };
    }

    // Match detected city to our city list
    const detectedCity = PAKISTAN_CITIES.find(
      (c) => c.toLowerCase() === (data.city || '').toLowerCase()
    ) || 'Karachi';

    return {
      city: detectedCity,
      region: data.region || 'Sindh',
      country: 'Pakistan',
      isPakistan: true,
    };
  } catch {
    // Default fallback
    return { city: 'Karachi', region: 'Sindh', country: 'Pakistan', isPakistan: false };
  }
}

/**
 * Calculate delivery days estimate between vendor city and customer city
 */
export function getDeliveryEstimate(vendorCity: string, customerCity: string): string {
  if (vendorCity.toLowerCase() === customerCity.toLowerCase()) {
    return 'Same Day / 1 Day';
  }

  const sameDay = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'];
  const isBothMajor =
    sameDay.includes(vendorCity) && sameDay.includes(customerCity);

  if (isBothMajor) return '1–2 Business Days';
  return '2–4 Business Days';
}

/**
 * Check if a product from vendorCity is hyper-local for customerCity
 */
export function isHyperLocal(vendorCity: string, customerCity: string): boolean {
  return vendorCity.toLowerCase() === customerCity.toLowerCase();
}
