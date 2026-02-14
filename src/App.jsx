import { useState, useCallback } from 'react';
import Shell from './components/Shell.jsx';
import CalendarView from './components/CalendarView.jsx';
import SharedTileView from './components/SharedTileView.jsx';
import { getShareUrl } from './lib/constants.js';

// Sample plan for demo
const SAMPLE_PLAN = {
  name: 'NYC Day Trip ✨',
  date: '2026-02-21',
  activities: [
    { id: 1, startHour: 9, startMin: 0, start_hour: 9, start_min: 0, duration: 90, title: "Brunch at The Butcher's Daughter", location: 'West Village, NYC', notes: 'No reservations — get there early!', category: 'food' },
    { id: 2, startHour: 11, startMin: 0, start_hour: 11, start_min: 0, duration: 90, title: 'Walk the High Line', location: 'Meatpacking District, NYC', notes: 'Great views + photo ops 📸', category: 'outdoors' },
    { id: 3, startHour: 13, startMin: 0, start_hour: 13, start_min: 0, duration: 60, title: 'Chelsea Market', location: '75 9th Ave, NYC', notes: 'Los Tacos No. 1 is a must', category: 'food' },
    { id: 4, startHour: 14, startMin: 30, start_hour: 14, start_min: 30, duration: 120, title: 'The Whitney Museum', location: '99 Gansevoort St, NYC', notes: 'Student discount available', category: 'culture' },
    { id: 5, startHour: 17, startMin: 30, start_hour: 17, start_min: 30, duration: 120, title: 'Rooftop drinks at Westlight', location: '111 N 12th St, Brooklyn', notes: 'Sunset at 6:45 — time it right 🌅', category: 'drinks' },
  ],
};

export default function App() {
  const [screen, setScreen] = useState('create'); // create | shared
  const [activities, setActivities] = useState([]);
  const [planName, setPlanName] = useState('');
  const [planDate, setPlanDate] = useState('');
  const [reactions, setReactions] = useState({});
  const [myReactions, setMyReactions] = useState({});

  // ─── In production, these call Supabase via the hooks ───
  // For now, local state for the interactive prototype

  const handleAdd = (act) => {
    setActivities((prev) => [...prev, { ...act, start_hour: act.startHour, start_min: act.startMin }]);
  };

  const handleRemove = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdate = (id, updates) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...updates, start_hour: updates.start_hour ?? updates.startHour ?? a.start_hour, start_min: updates.start_min ?? updates.startMin ?? a.start_min }
          : a
      )
    );
  };

  const handleUpdateTime = useCallback((id, newHour, newMin) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, startHour: newHour, startMin: newMin, start_hour: newHour, start_min: newMin } : a))
    );
  }, []);

  const handleReact = (stopId, emoji) => {
    const alreadyReacted = myReactions[stopId]?.has(emoji);
    if (alreadyReacted) {
      setReactions((prev) => {
        const next = { ...prev };
        if (next[stopId]?.[emoji]) {
          next[stopId] = { ...next[stopId], [emoji]: next[stopId][emoji] - 1 };
          if (next[stopId][emoji] <= 0) delete next[stopId][emoji];
        }
        return next;
      });
      setMyReactions((prev) => {
        const next = { ...prev };
        next[stopId] = new Set(next[stopId]);
        next[stopId].delete(emoji);
        return next;
      });
    } else {
      setReactions((prev) => {
        const next = { ...prev };
        if (!next[stopId]) next[stopId] = {};
        next[stopId] = { ...next[stopId], [emoji]: (next[stopId][emoji] || 0) + 1 };
        return next;
      });
      setMyReactions((prev) => {
        const next = { ...prev };
        if (!next[stopId]) next[stopId] = new Set();
        else next[stopId] = new Set(next[stopId]);
        next[stopId].add(emoji);
        return next;
      });
    }
  };

  const loadSample = () => {
    setActivities(SAMPLE_PLAN.activities);
    setPlanName(SAMPLE_PLAN.name);
    setPlanDate(SAMPLE_PLAN.date);
  };

  return (
    <Shell>
      {screen === 'shared' ? (
        <SharedTileView
          stops={activities} reactions={reactions} myReactions={myReactions} onReact={handleReact}
          planName={planName} planDate={planDate}
          onBack={() => setScreen('create')}
        />
      ) : (
        <CalendarView
          activities={activities} onAdd={handleAdd} onRemove={handleRemove}
          onUpdate={handleUpdate} onUpdateTime={handleUpdateTime}
          planName={planName} setPlanName={setPlanName}
          planDate={planDate} setPlanDate={setPlanDate}
          onShare={() => setScreen('shared')}
          onLoadSample={loadSample}
        />
      )}
    </Shell>
  );
}
