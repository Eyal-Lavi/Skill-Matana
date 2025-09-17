import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";

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

  const toISO = (date, time) => {
    if (!date || !time) return "";
    const d = new Date(date);
    const t = new Date(time);
    d.setHours(t.getHours());
    d.setMinutes(t.getMinutes());
    return d.toISOString();
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
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 8 }}>הזמינות שלי</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        לחץ על יום בלוח השנה, בחר שעת התחלה ושעת סיום, ואז הוסף לרשימה.
      </p>

      {/* לוח שנה */}
      <div style={{ maxWidth: 350, marginBottom: 24 }}>
        <Calendar
          onClickDay={(date) => setSelectedDay(date)}
          value={selectedDay}
          minDate={new Date()}
        />
      </div>

      {/* בחירת שעות */}
      {selectedDay && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            maxWidth: 400,
            background: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ marginBottom: 12 }}>
            בחירת שעות ליום {selectedDay.toLocaleDateString()}
          </h4>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>שעת התחלה</label>
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
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>שעת סיום</label>
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
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          >
            הוסף חלון לרשימה
          </button>
        </div>
      )}

      {/* שמירה */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={saveAll}
          disabled={saving || pendingSlots.length === 0}
          style={{
            padding: "10px 20px",
            background: saving || pendingSlots.length === 0 ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor:
              saving || pendingSlots.length === 0 ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {saving ? "שומר…" : `שמור ${pendingSlots.length} חלונות`}
        </button>
      </div>

      {error && (
        <div style={{ color: "crimson", marginBottom: 20 }}>{error}</div>
      )}

      {/* Pending */}
      {pendingSlots.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>חלונות שממתינים לשמירה</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingSlots.map((s, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <span>
                  {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}
                </span>
                <button
                  onClick={() => removePendingSlot(i)}
                  style={{
                    padding: "4px 10px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  הסר
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing availability */}
      <div>
        <h3>הזמינות הקרובה שלי</h3>
        {loading ? (
          <div>טוען…</div>
        ) : availability.length === 0 ? (
          <div>אין כרגע זמינות עתידית.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {availability.map((a) => (
              <div
                key={a.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: a.isBooked ? "#f1f1f1" : "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <span>
                  {new Date(a.startTime).toLocaleString()} → {new Date(a.endTime).toLocaleString()}
                </span>
                {!a.isBooked ? (
                  <button
                    onClick={() => deleteSlot(a.id)}
                    style={{
                      padding: "4px 10px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    מחק
                  </button>
                ) : (
                  <span style={{ color: "#888" }}>(שמור לשיעור)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
