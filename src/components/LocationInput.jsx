import { useState, useEffect, useRef } from 'react';
import { searchPlaces, CATEGORIES } from '../lib/constants.js';

export default function LocationInput({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => { setQuery(value || ''); }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    setResults(searchPlaces(v));
  };

  const handleSelect = (place) => {
    const loc = `${place.name}, ${place.address}`;
    setQuery(loc);
    onChange(loc);
    setResults([]);
    setFocused(false);
  };

  const typeIcons = { food: '🍽️', drinks: '🍹', activity: '🎯', outdoors: '🌿', culture: '🎨', shopping: '🛍️' };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); if (query.length >= 2) setResults(searchPlaces(query)); }}
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
          background: 'rgba(20,18,26,0.97)', border: '1px solid var(--border-hover)',
          borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {results.map((place, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(place); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', background: 'none', border: 'none',
                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
              }}>
                {typeIcons[place.type] || '📍'}
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
