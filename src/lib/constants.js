// ═══════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════
export const CATEGORIES = {
  food: { emoji: '🍽️', label: 'Food', gradient: 'linear-gradient(135deg, #ff6b35, #ff9a5c)', color: '#ff6b35' },
  drinks: { emoji: '🍹', label: 'Drinks', gradient: 'linear-gradient(135deg, #f472b6, #c084fc)', color: '#f472b6' },
  activity: { emoji: '🎯', label: 'Activity', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#6366f1' },
  outdoors: { emoji: '🌿', label: 'Outdoors', gradient: 'linear-gradient(135deg, #10b981, #34d399)', color: '#10b981' },
  culture: { emoji: '🎨', label: 'Culture', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#f59e0b' },
  shopping: { emoji: '🛍️', label: 'Shopping', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#ec4899' },
  travel: { emoji: '🚗', label: 'Transit', gradient: 'linear-gradient(135deg, #64748b, #94a3b8)', color: '#94a3b8' },
};

export const EMOJI_REACTIONS = ['🔥', '👀', '✅', '😍', '🤔', '👎'];
export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
export const HOUR_HEIGHT = 72;
export const SNAP_MINUTES = 15;

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
export const formatTime = (h, m = 0) => {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Pick a date';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const minutesToTime = (totalMin) => {
  const clamped = Math.max(6 * 60, Math.min(23 * 60 + 45, totalMin));
  const snapped = Math.round(clamped / SNAP_MINUTES) * SNAP_MINUTES;
  return { startHour: Math.floor(snapped / 60), startMin: snapped % 60 };
};

export const getShareUrl = (slug) => `https://note-that-down.com/p/${slug}`;

export const TILE_PATTERNS = ['full', 'half-half', 'third-twothird', 'twothird-third', 'full'];

// ═══════════════════════════════════════
// LOCATION SEARCH DATABASE
// Swap this for Google Places Autocomplete in production
// ═══════════════════════════════════════
const PLACES_DB = [
  { name: "The Butcher's Daughter", address: "19 Kenmare St, NYC", type: "food" },
  { name: "Chelsea Market", address: "75 9th Ave, NYC", type: "food" },
  { name: "Los Tacos No. 1", address: "75 9th Ave, Chelsea, NYC", type: "food" },
  { name: "Joe's Pizza", address: "7 Carmine St, NYC", type: "food" },
  { name: "Katz's Delicatessen", address: "205 E Houston St, NYC", type: "food" },
  { name: "Shake Shack", address: "Madison Square Park, NYC", type: "food" },
  { name: "Peter Luger Steak House", address: "178 Broadway, Brooklyn", type: "food" },
  { name: "Le Bernardin", address: "155 W 51st St, NYC", type: "food" },
  { name: "Momofuku Noodle Bar", address: "171 1st Ave, NYC", type: "food" },
  { name: "Russ & Daughters", address: "179 E Houston St, NYC", type: "food" },
  { name: "Di Fara Pizza", address: "1424 Avenue J, Brooklyn", type: "food" },
  { name: "The High Line", address: "Meatpacking District, NYC", type: "outdoors" },
  { name: "Central Park", address: "Manhattan, NYC", type: "outdoors" },
  { name: "Brooklyn Bridge", address: "Brooklyn Bridge, NYC", type: "outdoors" },
  { name: "Brooklyn Bridge Park", address: "334 Furman St, Brooklyn", type: "outdoors" },
  { name: "Prospect Park", address: "Brooklyn, NYC", type: "outdoors" },
  { name: "The Whitney Museum", address: "99 Gansevoort St, NYC", type: "culture" },
  { name: "MoMA", address: "11 W 53rd St, NYC", type: "culture" },
  { name: "The Met", address: "1000 5th Ave, NYC", type: "culture" },
  { name: "Guggenheim Museum", address: "1071 5th Ave, NYC", type: "culture" },
  { name: "American Museum of Natural History", address: "200 Central Park West, NYC", type: "culture" },
  { name: "Westlight Rooftop", address: "111 N 12th St, Brooklyn", type: "drinks" },
  { name: "Please Don't Tell (PDT)", address: "113 St Marks Pl, NYC", type: "drinks" },
  { name: "Death & Co", address: "433 E 6th St, NYC", type: "drinks" },
  { name: "230 Fifth Rooftop", address: "230 5th Ave, NYC", type: "drinks" },
  { name: "SoHo Shopping District", address: "SoHo, Manhattan", type: "shopping" },
  { name: "Brooklyn Flea", address: "80 Pearl St, Brooklyn", type: "shopping" },
  { name: "Top of the Rock", address: "30 Rockefeller Plaza, NYC", type: "activity" },
  { name: "Empire State Building", address: "350 5th Ave, NYC", type: "activity" },
  { name: "One World Observatory", address: "117 West St, NYC", type: "activity" },
  { name: "Broadway Show", address: "Theater District, NYC", type: "activity" },
  { name: "In-N-Out Burger", address: "7009 Sunset Blvd, LA", type: "food" },
  { name: "Grand Central Market", address: "317 S Broadway, LA", type: "food" },
  { name: "Santa Monica Pier", address: "200 Santa Monica Pier, LA", type: "activity" },
  { name: "Griffith Observatory", address: "2800 E Observatory Rd, LA", type: "culture" },
  { name: "The Getty Center", address: "1200 Getty Center Dr, LA", type: "culture" },
  { name: "Venice Beach Boardwalk", address: "Venice, LA", type: "outdoors" },
  { name: "Runyon Canyon", address: "2000 N Fuller Ave, LA", type: "outdoors" },
  { name: "Golden Gate Park", address: "San Francisco, CA", type: "outdoors" },
  { name: "Tartine Bakery", address: "600 Guerrero St, SF", type: "food" },
  { name: "Dolores Park", address: "San Francisco, CA", type: "outdoors" },
  { name: "Art Institute of Chicago", address: "111 S Michigan Ave, Chicago", type: "culture" },
  { name: "Millennium Park", address: "201 E Randolph St, Chicago", type: "outdoors" },
  { name: "Lou Malnati's Pizzeria", address: "439 N Wells St, Chicago", type: "food" },
  { name: "Movie Theater", address: "Various locations", type: "activity" },
  { name: "Bowling Alley", address: "Various locations", type: "activity" },
  { name: "Escape Room", address: "Various locations", type: "activity" },
  { name: "Karaoke Bar", address: "Various locations", type: "drinks" },
  { name: "Farmer's Market", address: "Various locations", type: "shopping" },
  { name: "Beach", address: "Various locations", type: "outdoors" },
  { name: "Hiking Trail", address: "Various locations", type: "outdoors" },
];

export const searchPlaces = (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return PLACES_DB
    .filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.type.includes(q))
    .slice(0, 6);
};
