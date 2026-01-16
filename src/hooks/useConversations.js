import { useEffect, useRef, useState } from 'react';
import { supabase } from '../db/db';

export default function useConversations({ soundEnabled = true }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const unreadMapRef = useRef(new Map());
  const initializedRef = useRef(false);

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

        // initialize unread map
        data.visitors?.forEach((v) => {
          unreadMapRef.current.set(v.id, v.unread_count ?? 0);
        });

        initializedRef.current = true;
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
            if (payload.eventType === 'INSERT') {
              return [payload.new, ...prev];
            }

            if (payload.eventType === 'UPDATE') {
              const updated = payload.new;

              const prevUnread = unreadMapRef.current.get(updated.id) ?? 0;
              const newUnread = updated.unread_count_admin ?? 0;

              // play sound only if unread_count increased
              if (
                initializedRef.current &&
                soundEnabled &&
                newUnread > prevUnread
              ) {
                audioRef.current?.play().catch(() => {});
              }

              unreadMapRef.current.set(updated.id, newUnread);

              return prev.map((c) => (c.id === updated.id ? updated : c));
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
  }, [soundEnabled]);

  return { conversations, loading, error };
}
