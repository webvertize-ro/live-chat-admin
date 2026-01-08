import { useEffect, useState } from 'react';
import { supabase } from '../db/db';

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setConversations(data);
      }

      setLoading(false);
    }

    fetchConversations();

    const channel = supabase
      .channel('visitors-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitors' },
        (payload) => {
          setConversations((prev) => {
            if (payload.eventType === 'INSERT') {
              // new conversation
              return [payload.new, ...prev];
            }

            if (payload.eventType === 'UPDATE') {
              // unread_count changes, admin_seen reset
              return prev.map((c) =>
                c.id === payload.new.id ? payload.ne : c
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

    return () => supabase.removeChannel(channel);
  }, []);

  return { conversations, loading, error };
}
