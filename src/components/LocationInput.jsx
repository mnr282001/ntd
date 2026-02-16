import { useState, useEffect, useRef, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Load Google Maps script once
let loadPromise = null;
function loadGoogleMaps() {
  if (window.google?.maps?.places) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => { loadPromise = null; reject(new Error('Failed to load Google Maps')); };
    document.head.appendChild(script);
  });
  return loadPromise;
}

export default function LocationInput({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const serviceRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    if (!API_KEY) return;
    loadGoogleMaps().then(() => {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
      sessionRef.current = new window.google.maps.places.AutocompleteSessionToken();
      setReady(true);
    }).catch(() => {});
  }, []);

  const search = useCallback((input) => {
    if (!ready || !input || input.length < 2) { setResults([]); return; }
    serviceRef.current.getPlacePredictions(
      { input, sessionToken: sessionRef.current, types: ['establishment'] },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setResults(predictions.map((p) => ({
            placeId: p.place_id,
            name: p.structured_formatting.main_text,
            address: p.structured_formatting.secondary_text || '',
          })));
        } else {
          setResults([]);
        }
      }
    );
  }, [ready]);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    search(v);
  };

  const handleSelect = (place) => {
    const loc = place.address ? `${place.name}, ${place.address}` : place.name;
    setQuery(loc);
    onChange(loc);
    setResults([]);
    setFocused(false);
    // Reset session token after a selection (Google billing best practice)
    sessionRef.current = new window.google.maps.places.AutocompleteSessionToken();
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); search(query); }}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="📍 Search for a place..."
          style={{ paddingRight: '36px' }}
        />
        {query && (
          <button onClick={() => { setQuery(''); onChange(''); setResults([]); }} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '16px',
            cursor: 'pointer', padding: '4px', lineHeight: 1,
          }}>×</button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
          background: 'var(--surface)', border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-sm)', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s var(--ease-out)',
        }}>
          {results.map((place) => (
            <button
              key={place.placeId}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(place); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', background: 'none', border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
              }}>
                📍
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                  color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {place.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-faint)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {place.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
