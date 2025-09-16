import React, { useEffect, useMemo, useState } from 'react';
import ModalShell from '../../utils/components/Modal/ModalShell';
import { ModalHeader } from '../../utils/components/Modal/ModalHeader';
import styles from './ScheduleDialog.module.scss';

export default function ScheduleDialog({ isOpen, onClose, targetUser, onScheduled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const userId = targetUser?.id;

  useEffect(() => {
    if (!isOpen || !userId) return;
    setSelectedId(null);
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3000/availability/${userId}`, { credentials: 'include' });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || 'טעינת זמינות נכשלה');
        setSlots(Array.isArray(body?.availability) ? body.availability : []);
      } catch (e) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, userId]);

  const grouped = useMemo(() => {
    const byDay = {};
    for (const s of slots) {
      const d = new Date(s.startTime);
      const key = d.toDateString();
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(s);
    }
    return byDay;
  }, [slots]);

  const requestAlert = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/availability/alerts/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('ההרשמה להתראות נכשלה');
      alert('מעולה! נשלח לך מייל כשמשתמש זה יוסיף זמינות.');
      onClose?.();
    } catch (e) {
      alert(e.message || 'שגיאה בהרשמה להתראות');
    }
  };

  const confirmSchedule = async () => {
    if (!selectedId || !userId) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/meetings/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetUserId: userId, availabilityId: selectedId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'קביעת הפגישה נכשלה');
      onScheduled?.(body?.meeting);
      onClose?.();
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} overlayClass={styles.overlay} modalClass={styles.modal}>
      <ModalHeader titleId="scheduleTitle" title={`בחר זמן פנוי — ${targetUser?.firstName || targetUser?.username || ''}`} onClose={onClose} headerClass={styles.header} closeButtonClass={styles.closeBtn} />

      <div className={styles.content}>
        {loading ? (
          <div>טוען זמינות…</div>
        ) : error ? (
          <div style={{ color: 'crimson' }}>{error}</div>
        ) : slots.length === 0 ? (
          <div className={styles.empty}>
            אין כרגע זמינות. תרצה לקבל התראה ברגע שמתפנה?
            <div style={{ marginTop: 12 }}>
              <button className={styles.primaryBtn} onClick={requestAlert}>הפעל התראה למייל</button>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([day, arr]) => (
            <div key={day} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{day}</div>
              <div className={styles.grid}>
                {arr.map((s) => {
                  const start = new Date(s.startTime);
                  const end = new Date(s.endTime);
                  const selected = selectedId === s.id;
                  return (
                    <div key={s.id} className={`${styles.slotCard} ${selected ? styles.slotSelected : ''}`} onClick={() => setSelectedId(s.id)}>
                      <div style={{ fontSize: 14, color: '#374151' }}>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{start.toLocaleDateString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.secondaryBtn} onClick={onClose} disabled={submitting}>ביטול</button>
        <button className={styles.primaryBtn} onClick={confirmSchedule} disabled={!selectedId || submitting}>
          {submitting ? 'קובע…' : 'קבע פגישה'}
        </button>
      </div>
    </ModalShell>
  );
}

