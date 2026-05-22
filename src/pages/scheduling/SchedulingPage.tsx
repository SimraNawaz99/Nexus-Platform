import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventInput } from "@fullcalendar/core";

type MeetingStatus = "pending" | "accepted" | "declined";

type Meeting = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: MeetingStatus;
};

export default function SchedulingPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const handleSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter meeting title");
    if (!title) return;

    setMeetings((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        status: "pending",
      },
    ]);
  };

  const updateStatus = (id: string, status: MeetingStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const calendarEvents: EventInput[] = meetings.map((m) => ({
    id: m.id,
    title: `${m.title} (${m.status})`,
    start: m.start,
    end: m.end,
    color:
      m.status === "accepted"
        ? "green"
        : m.status === "declined"
        ? "red"
        : "orange",
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Scheduling</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        editable
        select={handleSelect}
        events={calendarEvents}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <div>
        <h2 className="text-xl font-semibold mt-4">Meeting Requests</h2>
        {meetings.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between border rounded p-2 my-2"
          >
            <div>
              <p className="font-medium">{m.title}</p>
              <p className="text-sm">{new Date(m.start).toLocaleString()}</p>
              <span className="text-xs uppercase">{m.status}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-green-600 text-white rounded"
                onClick={() => updateStatus(m.id, "accepted")}
              >
                Accept
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded"
                onClick={() => updateStatus(m.id, "declined")}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}