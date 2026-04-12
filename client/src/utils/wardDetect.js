/**
 * wardDetect.js
 * Approximate Jersey City ward boundary polygons + point-in-polygon detection.
 * Polygons are [lat, lng] arrays traced from public ward maps.
 * Detection is best-effort — always let the user override.
 */

// ── Approximate ward polygons ──────────────────────────────────────────────
// Each polygon is an array of [lat, lng] vertices (closed automatically).
const WARD_POLYGONS = {
  // Ward A — Downtown / Waterfront / Exchange Place / Paulus Hook /
  //           Powerhouse Arts District / Newport
  'ward-a': [
    [40.7310, -74.0690],
    [40.7310, -74.0480],
    [40.7240, -74.0390],
    [40.7160, -74.0330],
    [40.7050, -74.0360],
    [40.7000, -74.0420],
    [40.6990, -74.0530],
    [40.7020, -74.0660],
    [40.7120, -74.0720],
    [40.7200, -74.0720],
  ],

  // Ward B — Journal Square / Bergen Hill / McGinley Square
  'ward-b': [
    [40.7310, -74.0690],
    [40.7470, -74.0690],
    [40.7470, -74.0580],
    [40.7390, -74.0540],
    [40.7310, -74.0480],
  ],

  // Ward C — Greenville / West Side / Marion Section
  'ward-c': [
    [40.7020, -74.0660],
    [40.6990, -74.0530],
    [40.6940, -74.0620],
    [40.6860, -74.0760],
    [40.6860, -74.0960],
    [40.6980, -74.0960],
    [40.7060, -74.0860],
    [40.7120, -74.0720],
  ],

  // Ward D — The Heights / North End / Riverview-Fiskville
  'ward-d': [
    [40.7470, -74.0690],
    [40.7620, -74.0690],
    [40.7620, -74.0540],
    [40.7540, -74.0490],
    [40.7470, -74.0580],
  ],

  // Ward E — Bergen-Lafayette / Communipaw / Jackson Hill
  'ward-e': [
    [40.7120, -74.0720],
    [40.7060, -74.0860],
    [40.6980, -74.0960],
    [40.6980, -74.0760],
    [40.7020, -74.0660],
  ],

  // Ward F — Lincoln Park / Hackensack Riverfront / West Side (north)
  'ward-f': [
    [40.7200, -74.0720],
    [40.7120, -74.0720],
    [40.7060, -74.0860],
    [40.6980, -74.0960],
    [40.6860, -74.0960],
    [40.6860, -74.1060],
    [40.7200, -74.1060],
    [40.7470, -74.1060],
    [40.7470, -74.0690],
    [40.7310, -74.0690],
  ],
};

// ── Ray-casting point-in-polygon ───────────────────────────────────────────
function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ── Nominatim geocoder (shared with MapPage) ───────────────────────────────
const geocodeCache = {};

async function geocodeAddress(address) {
  const key = address.trim().toLowerCase();
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=us`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache[key] = result;
      return result;
    }
  } catch { /* silent */ }
  return null;
}

// ── Main export ────────────────────────────────────────────────────────────
/**
 * Given a free-text address string, geocodes it and returns the matching
 * ward value ('ward-a' … 'ward-f'), or null if outside JC / undetectable.
 */
export async function detectWard(address) {
  if (!address || address.trim().length < 5) return null;

  const coords = await geocodeAddress(address);
  if (!coords) return null;

  const { lat, lng } = coords;

  // Rough bounding box for Jersey City — reject clearly out-of-area results
  if (lat < 40.680 || lat > 40.770 || lng < -74.120 || lng > -74.020) {
    return null;
  }

  for (const [ward, polygon] of Object.entries(WARD_POLYGONS)) {
    if (pointInPolygon(lat, lng, polygon)) return ward;
  }

  // Fallback: find nearest ward centroid if the point fell through a gap
  const centroids = {
    'ward-a': [40.7160, -74.0530],
    'ward-b': [40.7390, -74.0615],
    'ward-c': [40.6960, -74.0790],
    'ward-d': [40.7545, -74.0615],
    'ward-e': [40.7030, -74.0840],
    'ward-f': [40.7200, -74.0900],
  };

  let nearest = null;
  let minDist = Infinity;
  for (const [ward, [clat, clng]] of Object.entries(centroids)) {
    const dist = Math.hypot(lat - clat, lng - clng);
    if (dist < minDist) { minDist = dist; nearest = ward; }
  }
  // Only use centroid fallback if reasonably close (within ~2 km)
  return minDist < 0.018 ? nearest : null;
}