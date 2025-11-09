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
  const [alertStatus, setAlertStatus] = useState({ subscribed: false, active: false });
  const [checkingAlert, setCheckingAlert] = useState(false);
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

  useEffect(() => {
    if (!isOpen || !userId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/availability/alerts/${userId}/status`, { credentials: 'include' });
        const body = await res.json().catch(() => ({}));
        if (res.ok) {
          setAlertStatus({ subscribed: body.subscribed || false, active: body.active || false });
        }
      } catch (e) {
        console.error('Failed to check alert status:', e);
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
    setCheckingAlert(true);
    try {
      const res = await fetch(`http://localhost:3000/availability/alerts/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('ההרשמה להתראות נכשלה');
      setAlertStatus({ subscribed: true, active: true });
      alert('מעולה! נשלח לך מייל כשמשתמש זה יוסיף זמינות.');
    } catch (e) {
      alert(e.message || 'שגיאה בהרשמה להתראות');
    } finally {
      setCheckingAlert(false);
    }
  };

  const unsubscribeAlert = async () => {
    if (!userId) return;
    if (!window.confirm('האם אתה בטוח שברצונך לבטל את ההתראה?')) return;
    setCheckingAlert(true);
    try {
      const res = await fetch(`http://localhost:3000/availability/alerts/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('ביטול ההתראה נכשל');
      setAlertStatus({ subscribed: false, active: false });
      alert('ההתראה בוטלה בהצלחה. לא תקבל עוד מיילים על זמינות חדשה.');
    } catch (e) {
      alert(e.message || 'שגיאה בביטול ההתראה');
    } finally {
      setCheckingAlert(false);
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
              {alertStatus.active ? (
                <div>
                  <p style={{ marginBottom: 8, color: '#10b981', fontSize: 14 }}>✓ אתה מנוי להתראות</p>
                  <button className={styles.secondaryBtn} onClick={unsubscribeAlert} disabled={checkingAlert}>
                    {checkingAlert ? 'מבטל...' : 'בטל התראה'}
                  </button>
                </div>
              ) : (
                <button className={styles.primaryBtn} onClick={requestAlert} disabled={checkingAlert}>
                  {checkingAlert ? 'מרשם...' : 'הפעל התראה למייל'}
                </button>
              )}
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

      <div className={styles.footer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          {alertStatus.active && (
            <button 
              className={styles.secondaryBtn} 
              onClick={unsubscribeAlert} 
              disabled={checkingAlert || submitting}
              style={{ fontSize: 12, padding: '6px 12px' }}
              title="בטל התראה על זמינות חדשה"
            >
              {checkingAlert ? 'מבטל...' : 'בטל התראה'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.secondaryBtn} onClick={onClose} disabled={submitting}>ביטול</button>
          <button className={styles.primaryBtn} onClick={confirmSchedule} disabled={!selectedId || submitting}>
            {submitting ? 'קובע…' : 'קבע פגישה'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

