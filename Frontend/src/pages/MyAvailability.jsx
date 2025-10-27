import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import styles from "./MyAvailability.module.scss";

export default function MyAvailability() {
  const user = useSelector((s) => s.auth?.user);
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);

  const [selectedDay, setSelectedDay] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);

  // Create ISO string converting local time to UTC
  const toISO = (date, time) => {
    if (!date || !time) return "";
    
    // Get local time components
    const localDate = new Date(date);
    const localTime = new Date(time);
    
    // Combine date and time in local timezone
    const combinedDate = new Date(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localTime.getHours(),
      localTime.getMinutes()
    );
    
    // Return ISO string - this automatically handles timezone conversion
    return combinedDate.toISOString();
  };

  // Format date for display (shows local time)
  const formatDateForDisplay = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const loadAvailability = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/availability/${userId}`, {
        credentials: "include",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to load availability");
      setAvailability(Array.isArray(body?.availability) ? body.availability : []);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addPendingSlot = () => {
    setError("");
    if (!selectedDay || !startHour || !endHour) {
      setError("נא לבחור יום, שעת התחלה ושעת סיום");
      return;
    }

    const startTimeISO = toISO(selectedDay, startHour);
    const endTimeISO = toISO(selectedDay, endHour);

    if (new Date(endTimeISO) <= new Date(startTimeISO)) {
      setError("שעת הסיום חייבת להיות אחרי ההתחלה");
      return;
    }

    setPendingSlots((arr) => [
      ...arr,
      { startTime: startTimeISO, endTime: endTimeISO },
    ]);

    setStartHour(null);
    setEndHour(null);
    setSelectedDay(null);
  };

  const removePendingSlot = (idx) => {
    setPendingSlots((arr) => arr.filter((_, i) => i !== idx));
  };

  const saveAll = async () => {
    if (!pendingSlots.length) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/availability/my", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slots: pendingSlots }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "שמירת הזמינות נכשלה");
      setPendingSlots([]);
      await loadAvailability();
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/availability/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "מחיקה נכשלה");
      await loadAvailability();
    } catch (e) {
      alert(e.message || "שגיאה במחיקה");
    }
  };

  const now = new Date();
  const formatTime = (date) => `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div className={styles.availabilityContainer}>
      <div className={styles.header}>
        <h2>הזמינות שלי</h2>
        <p>
          לחץ על יום בלוח השנה, בחר שעת התחלה ושעת סיום, ואז הוסף לרשימה.
        </p>
      </div>

      {/* לוח שנה */}
      <div className={styles.calendarSection}>
        <Calendar
          onClickDay={(date) => setSelectedDay(date)}
          value={selectedDay}
          minDate={new Date()}
        />
      </div>

      {/* בחירת שעות */}
      {selectedDay && (
        <div className={styles.timeSelector}>
          <h4>
            בחירת שעות ליום {selectedDay.toLocaleDateString()}
          </h4>
          <div className={styles.timeFields}>
            <div className={styles.timeField}>
              <label>שעת התחלה</label>
              <Flatpickr
                value={startHour}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                  minTime: formatTime(now),
                  maxTime: "23:59",
                }}
                onChange={(dates) => setStartHour(dates[0])}
                className="border rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="בחר שעה"
              />
            </div>
            <div className={styles.timeField}>
              <label>שעת סיום</label>
              <Flatpickr
                value={endHour}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                  minTime: startHour ? formatTime(startHour) : formatTime(now),
                  maxTime: "23:59",
                }}
                onChange={(dates) => setEndHour(dates[0])}
                className="border rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="בחר שעה"
              />
            </div>
          </div>
          <button
            onClick={addPendingSlot}
            className={styles.addButton}
          >
            הוסף חלון לרשימה
          </button>
        </div>
      )}

      {/* שמירה */}
      <div>
        <button
          onClick={saveAll}
          disabled={saving || pendingSlots.length === 0}
          className={styles.saveButton}
        >
          {saving ? "שומר…" : `שמור ${pendingSlots.length} חלונות`}
        </button>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {/* Pending */}
      {pendingSlots.length > 0 && (
        <div className={styles.slotsSection}>
          <h3>חלונות שממתינים לשמירה</h3>
          <div className={styles.slotList}>
            {pendingSlots.map((s, i) => (
              <div key={i} className={styles.slotCard}>
                <span className={styles.slotInfo}>
                  {formatDateForDisplay(s.startTime)} → {formatDateForDisplay(s.endTime)}
                </span>
                <button
                  onClick={() => removePendingSlot(i)}
                  className={styles.removeButton}
                >
                  הסר
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing availability */}
      <div className={styles.slotsSection}>
        <h3>הזמינות הקרובה שלי</h3>
        {loading ? (
          <div className={styles.loading}>טוען…</div>
        ) : availability.length === 0 ? (
          <div className={styles.empty}>אין כרגע זמינות עתידית.</div>
        ) : (
          <div className={styles.slotList}>
            {availability.map((a) => (
              <div
                key={a.id}
                className={`${styles.slotCard} ${a.isBooked ? styles.booked : ""}`}
              >
                <span className={styles.slotInfo}>
                  {formatDateForDisplay(a.startTime)} → {formatDateForDisplay(a.endTime)}
                </span>
                {!a.isBooked ? (
                  <button
                    onClick={() => deleteSlot(a.id)}
                    className={styles.removeButton}
                  >
                    מחק
                  </button>
                ) : (
                  <span className={styles.bookedLabel}>(שמור לשיעור)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
