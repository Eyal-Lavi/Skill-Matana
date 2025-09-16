import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyAvailability() {
  const user = useSelector((s) => s.auth?.user);
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const toISO = (d, t) => {
    if (!d || !t) return '';
    try {
      const iso = new Date(`${d}T${t}:00`);
      return iso.toISOString();
    } catch {
      return '';
    }
  };

  const slotPreview = useMemo(() => {
    const s = toISO(startDate, startTime);
    const e = toISO(endDate, endTime);
    return s && e ? `${s} → ${e}` : '';
  }, [startDate, startTime, endDate, endTime]);

  const loadAvailability = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/availability/${userId}`, { credentials: 'include' });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || 'Failed to load availability');
      setAvailability(Array.isArray(body?.availability) ? body.availability : []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAvailability(); }, [userId]);

  const addPendingSlot = () => {
    setError('');
    const startTimeISO = toISO(startDate, startTime);
    const endTimeISO = toISO(endDate, endTime);
    if (!startTimeISO || !endTimeISO) {
      setError('נא למלא תאריך ושעה התחלה/סיום תקינים');
      return;
    }
    if (new Date(endTimeISO) <= new Date(startTimeISO)) {
      setError('שעת הסיום חייבת להיות אחרי ההתחלה');
      return;
    }
    setPendingSlots((arr) => [...arr, { startTime: startTimeISO, endTime: endTimeISO }]);
    // reset inputs
    setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
  };

  const removePendingSlot = (idx) => {
    setPendingSlots((arr) => arr.filter((_, i) => i !== idx));
  };

  const saveAll = async () => {
    if (!pendingSlots.length) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/availability/my', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ slots: pendingSlots }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'שמירת הזמינות נכשלה');
      setPendingSlots([]);
      await loadAvailability();
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/availability/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'מחיקה נכשלה');
      await loadAvailability();
    } catch (e) {
      alert(e.message || 'שגיאה במחיקה');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>הזמינות שלי</h2>
      <p style={{ color: '#666' }}>הוסף חלונות לזמינות בשבוע הקרוב כדי שחברים יוכלו לקבוע איתך שיעור.</p>

      {/* Add slot form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', gap: 12, maxWidth: 520, marginTop: 16 }}>
        <div>
          <label>תאריך התחלה</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label>שעת התחלה</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label>תאריך סיום</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label>שעת סיום</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>{slotPreview}</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={addPendingSlot}>הוסף חלון לרשימה</button>
        <button onClick={saveAll} disabled={saving || pendingSlots.length === 0}>
          {saving ? 'שומר…' : `שמור ${pendingSlots.length} חלונות`}
        </button>
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

      {/* Pending */}
      {pendingSlots.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>חלונות שממתינים לשמירה</h4>
          <ul>
            {pendingSlots.map((s, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}</span>
                <button onClick={() => removePendingSlot(i)}>הסר</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Existing availability */}
      <div style={{ marginTop: 28 }}>
        <h3>הזמינות הקרובה שלי</h3>
        {loading ? (
          <div>טוען…</div>
        ) : availability.length === 0 ? (
          <div>אין כרגע זמינות עתידית.</div>
        ) : (
          <ul>
            {availability.map((a) => (
              <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{new Date(a.startTime).toLocaleString()} → {new Date(a.endTime).toLocaleString()}</span>
                {!a.isBooked && (
                  <button onClick={() => deleteSlot(a.id)}>
                    מחק
                  </button>
                )}
                {a.isBooked && <span style={{ color: '#888' }}>(שמור לשיעור)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

