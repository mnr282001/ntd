import { useState, useEffect, useCallback } from 'react';
import { supabase, generateSlug, getSessionId } from '../lib/supabase.js';

// ═══════════════════════════════════════
// usePlan — Create, load, update a plan
// ═══════════════════════════════════════
export function usePlan(slugOrId) {
  const [plan, setPlan] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load plan by share_slug
  const loadBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const { data: planData, error: planErr } = await supabase
        .from('plans')
        .select('*')
        .eq('share_slug', slug)
        .single();

      if (planErr) throw planErr;
      setPlan(planData);

      const { data: stopsData, error: stopsErr } = await supabase
        .from('stops')
        .select('*')
        .eq('plan_id', planData.id)
        .order('start_hour', { ascending: true })
        .order('start_min', { ascending: true });

      if (stopsErr) throw stopsErr;
      setStops(stopsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new plan
  const createPlan = useCallback(async (name = 'Untitled Plan', planDate = null) => {
    const slug = generateSlug();
    const { data, error: err } = await supabase
      .from('plans')
      .insert({ share_slug: slug, name, plan_date: planDate })
      .select()
      .single();

    if (err) throw err;
    setPlan(data);
    setStops([]);
    return data;
  }, []);

  // Update plan metadata
  const updatePlan = useCallback(async (updates) => {
    if (!plan) return;
    const { data, error: err } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', plan.id)
      .select()
      .single();

    if (err) throw err;
    setPlan(data);
    return data;
  }, [plan]);

  // ─── Stop CRUD ───
  const addStop = useCallback(async (stopData) => {
    if (!plan) return;
    const { data, error: err } = await supabase
      .from('stops')
      .insert({ ...stopData, plan_id: plan.id })
      .select()
      .single();

    if (err) throw err;
    setStops((prev) => [...prev, data]);
    return data;
  }, [plan]);

  const updateStop = useCallback(async (stopId, updates) => {
    const { data, error: err } = await supabase
      .from('stops')
      .update(updates)
      .eq('id', stopId)
      .select()
      .single();

    if (err) throw err;
    setStops((prev) => prev.map((s) => (s.id === stopId ? data : s)));
    return data;
  }, []);

  const removeStop = useCallback(async (stopId) => {
    const { error: err } = await supabase
      .from('stops')
      .delete()
      .eq('id', stopId);

    if (err) throw err;
    setStops((prev) => prev.filter((s) => s.id !== stopId));
  }, []);

  // Load on mount if slug provided
  useEffect(() => {
    if (slugOrId) {
      loadBySlug(slugOrId);
    } else {
      setLoading(false);
    }
  }, [slugOrId, loadBySlug]);

  return {
    plan, stops, loading, error,
    createPlan, updatePlan, loadBySlug,
    addStop, updateStop, removeStop,
    setPlan, setStops,
  };
}

// ═══════════════════════════════════════
// useReactions — Load and toggle reactions
// ═══════════════════════════════════════
export function useReactions(stopIds) {
  const [reactions, setReactions] = useState({}); // { stopId: { emoji: count } }
  const [myReactions, setMyReactions] = useState({}); // { stopId: Set<emoji> }

  // Load reaction counts for all stops
  const loadReactions = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return;

    const { data, error } = await supabase
      .from('reaction_counts')
      .select('*')
      .in('stop_id', ids);

    if (error) { console.error('Failed to load reactions:', error); return; }

    const grouped = {};
    (data || []).forEach(({ stop_id, emoji, count }) => {
      if (!grouped[stop_id]) grouped[stop_id] = {};
      grouped[stop_id][emoji] = parseInt(count);
    });
    setReactions(grouped);

    // Load my reactions
    const sessionId = getSessionId();
    const { data: myData } = await supabase
      .from('reactions')
      .select('stop_id, emoji')
      .in('stop_id', ids)
      .eq('reactor_id', sessionId);

    const myGrouped = {};
    (myData || []).forEach(({ stop_id, emoji }) => {
      if (!myGrouped[stop_id]) myGrouped[stop_id] = new Set();
      myGrouped[stop_id].add(emoji);
    });
    setMyReactions(myGrouped);
  }, []);

  // Track latest myReactions in a ref so toggleReaction never has a stale closure
  const myReactionsRef = useRef(myReactions);
  useEffect(() => { myReactionsRef.current = myReactions; }, [myReactions]);

  // Toggle a reaction (add or remove)
  const toggleReaction = useCallback(async (stopId, emoji) => {
    const sessionId = getSessionId();
    const alreadyReacted = myReactionsRef.current[stopId]?.has(emoji);

    // Optimistic update first, then DB call
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

      await supabase
        .from('reactions')
        .delete()
        .eq('stop_id', stopId)
        .eq('emoji', emoji)
        .eq('reactor_id', sessionId);
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

      await supabase
        .from('reactions')
        .upsert({ stop_id: stopId, emoji, reactor_id: sessionId });
    }
  }, []);

  useEffect(() => {
    if (stopIds && stopIds.length > 0) {
      loadReactions(stopIds);
    }
  }, [stopIds?.join(',')]);

  return { reactions, myReactions, toggleReaction, loadReactions };
}

// ═══════════════════════════════════════
// useRealtimeStops — Subscribe to live updates
// ═══════════════════════════════════════
export function useRealtimeStops(planId, onUpdate) {
  useEffect(() => {
    if (!planId) return;

    const channel = supabase
      .channel(`stops:${planId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stops', filter: `plan_id=eq.${planId}` },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [planId, onUpdate]);
}

// ═══════════════════════════════════════
// useRealtimeReactions — Subscribe to live reactions
// ═══════════════════════════════════════
export function useRealtimeReactions(stopIds, onUpdate) {
  useEffect(() => {
    if (!stopIds || stopIds.length === 0) return;

    const channel = supabase
      .channel('reactions:live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        (payload) => {
          if (stopIds.includes(payload.new?.stop_id) || stopIds.includes(payload.old?.stop_id)) {
            onUpdate(payload);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [stopIds?.join(','), onUpdate]);
}
