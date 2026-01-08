import { useEffect, useReducer, useRef, useState } from 'react';
import { supabase } from '../db/db';

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const isFirstRealTimeEvent = useRef(true);

  // initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  // initial fetch via API
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/getVisitors');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch visitors');
        }

        setConversations(data.visitors || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('visitors-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitors',
        },
        (payload) => {
          setConversations((prev) => {
            if (!isFirstRealTimeEvent.current) {
              audioRef.current?.play().catch(() => {});
            } else {
              isFirstRealTimeEvent.current = false;
            }

            if (payload.eventType === 'INSERT') {
              return [payload.new, ...prev];
            }

            if (payload.eventType === 'UPDATE') {
              return prev.map((c) =>
                c.id === payload.new.id ? payload.new : c
              );
            }

            if (payload.eventType === 'DELETE') {
              return prev.filter((c) => c.id !== payload.old.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, loading, error };
}
