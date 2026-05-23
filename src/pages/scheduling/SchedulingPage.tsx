import React, { useState } from "react";

type MeetingStatus = "pending" | "accepted" | "declined";

interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  status: MeetingStatus;
}

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulingPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const weekDays = getWeekDays(currentWeek);

  const prevWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() - 7);
    setCurrentWeek(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + 7);
    setCurrentWeek(d);
  };

  const addMeeting = () => {
    if (!newTitle || !newStart || !newEnd) return;
    setMeetings((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newTitle,
        start: newStart,
        end: newEnd,
        status: "pending",
      },
    ]);
    setNewTitle("");
    setNewStart("");
    setNewEnd("");
    setShowModal(false);
  };

  const updateStatus = (id: string, status: MeetingStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const getMeetingsForSlot = (day: Date, hour: number) => {
    return meetings.filter((m) => {
      const start = new Date(m.start);
      return (
        start.toDateString() === day.toDateString() &&
        start.getHours() === hour
      );
    });
  };

  const statusColor = (status: MeetingStatus) => {
    if (status === "accepted") return "#16a34a";
    if (status === "declined") return "#dc2626";
    return "#d97706";
  };

  const weekLabel = `${weekDays[0].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${weekDays[6].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Scheduling</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          + New Meeting
        </button>
      </div>

      {/* Week navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <button onClick={prevWeek} style={{ cursor: "pointer", padding: "4px 10px" }}>
          ‹
        </button>
        <span style={{ fontWeight: 500 }}>{weekLabel}</span>
        <button onClick={nextWeek} style={{ cursor: "pointer", padding: "4px 10px" }}>
          ›
        </button>
        <button
          onClick={() => setCurrentWeek(new Date())}
          style={{ marginLeft: "auto", cursor: "pointer", padding: "4px 10px" }}
        >
          Today
        </button>
      </div>

      {/* Calendar grid */}
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px repeat(7, 1fr)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
            minWidth: "600px",
          }}
        >
          {/* Header row */}
          <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }} />
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                  borderLeft: "1px solid #e5e7eb",
                  padding: "6px 4px",
                  textAlign: "center",
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? "#2563eb" : "#374151",
                  fontSize: "13px",
                }}
              >
                <div>{DAY_LABELS[day.getDay()]}</div>
                <div style={{ fontSize: "16px" }}>{day.getDate()}</div>
              </div>
            );
          })}

          {/* Hour rows */}
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  padding: "2px 4px",
                  borderBottom: "1px solid #f3f4f6",
                  textAlign: "right",
                  paddingTop: "4px",
                }}
              >
                {hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`}
              </div>
              {weekDays.map((day, di) => {
                const slotMeetings = getMeetingsForSlot(day, hour);
                return (
                  <div
                    key={di}
                    style={{
                      borderLeft: "1px solid #e5e7eb",
                      borderBottom: "1px solid #f3f4f6",
                      minHeight: "40px",
                      padding: "2px",
                      position: "relative",
                    }}
                  >
                    {slotMeetings.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          background: statusColor(m.status),
                          color: "#fff",
                          borderRadius: "4px",
                          fontSize: "11px",
                          padding: "2px 4px",
                          marginBottom: "2px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        title={m.title}
                      >
                        {m.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              width: "360px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>
              New Meeting
            </h2>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Meeting title"
              style={{
                display: "block",
                width: "100%",
                marginBottom: "12px",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <label style={{ fontSize: "13px", color: "#6b7280" }}>Start</label>
            <input
              type="datetime-local"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "12px",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <label style={{ fontSize: "13px", color: "#6b7280" }}>End</label>
            <input
              type="datetime-local"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "16px",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                Cancel
              </button>
              <button
                onClick={addMeeting}
                style={{
                  padding: "8px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting requests list */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Meeting Requests
        </h2>
        {meetings.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No meetings scheduled yet.</p>
        )}
        {meetings.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "8px",
            }}
          >
            <div>
              <p style={{ fontWeight: 500, margin: 0 }}>{m.title}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "2px 0" }}>
                {new Date(m.start).toLocaleString()}
              </p>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: statusColor(m.status),
                  fontWeight: 600,
                }}
              >
                {m.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => updateStatus(m.id, "accepted")}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(m.id, "declined")}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Decline
              </button>
              <button
                onClick={() => deleteMeeting(m.id)}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}