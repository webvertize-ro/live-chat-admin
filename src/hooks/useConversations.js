import { useEffect, useState } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const res = await fetch('/api/getVisitors');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch conversations');
        }

        setConversations(data.visitors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    setConversations,
  };
}
