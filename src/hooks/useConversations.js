import { useEffect, useState } from 'react';
import { supabase } from '../db/db';

export default function useConversations() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const response = await fetch('/api/getVisitors');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch conversations');
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

  // implementing real-time
  useEffect(() => {
    const channel = supabase
      .channel('get-visitors')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          table: 'visitors',
          schema: 'public',
        },
        (payload) => {
          setConversations((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });

  return {
    loading,
    conversations,
    error,
    setConversations,
  };
}
