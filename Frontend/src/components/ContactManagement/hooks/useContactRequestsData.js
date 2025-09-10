import { useCallback, useEffect, useState } from 'react';

export const useContactRequestsData = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const base = import.meta.env.VITE_API_URL;
      const [recRes, sentRes] = await Promise.all([
        fetch(`${base}/connection-requests/received`, { credentials: 'include' }),
        fetch(`${base}/connection-requests/sent`, { credentials: 'include' }),
      ]);

      if (!recRes.ok || !sentRes.ok) {
        let msg = 'Failed to load contact requests';
        try {
          const er = !recRes.ok ? await recRes.json() : await sentRes.json();
          if (er?.message) msg = er.message;
        } catch (_) {}
        throw new Error(msg);
      }

      const recJson = await recRes.json();
      const sentJson = await sentRes.json();
      setReceived(recJson.data || []);
      setSent(sentJson.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { received, sent, loading, error, refresh: fetchAll };
};

