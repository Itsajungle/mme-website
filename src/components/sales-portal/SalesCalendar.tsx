"use client";

import { cn } from "@/lib/utils";
import { CALENDAR_EVENTS, getRepCalendarColor } from "@/lib/sales-portal/demo-data";
import { Clock, Video, Phone, Users } from "lucide-react";

const WEEK_DAYS = [
  { label: "Mon 31 Mar", date: "2026-03-31" },
  { label: "Tue 1 Apr", date: "2026-04-01" },
  { label: "Wed 2 Apr", date: "2026-04-02" },
  { label: "Thu 3 Apr", date: "2026-04-03" },
  { label: "Fri 4 Apr", date: "2026-04-04" },
];

const TYPE_ICON = {
  meeting: Users,
  call: Phone,
  demo: Video,
  internal: Clock,
} as const;

export function SalesCalendar() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-bold text-text">Team Calendar</h2>
        <p className="text-sm text-text-muted mt-0.5">
          Week of 31 March – 4 April 2026
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] font-medium">
        {[
          { name: "Ciara", color: "#00FF96" },
          { name: "Declan", color: "#3B82F6" },
          { name: "Aoife", color: "#A855F7" },
          { name: "Ronan", color: "#F59E0B" },
        ].map((rep) => (
          <span key={rep.name} className="flex items-center gap-1.5 text-text-secondary">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: rep.color }} />
            {rep.name}
          </span>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-5 gap-3">
        {WEEK_DAYS.map((day) => {
          const dayEvents = CALENDAR_EVENTS.filter((e) => e.date === day.date);

          return (
            <div key={day.date} className="flex flex-col">
              {/* Day header */}
              <div className="rounded-t-lg border border-border bg-bg-card px-3 py-2.5">
                <p className="text-xs font-bold text-text">{day.label}</p>
                <p className="text-[10px] text-text-muted">
                  {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Events */}
              <div className="flex-1 rounded-b-lg border border-t-0 border-border bg-bg-deep/50 p-2 space-y-2 min-h-[280px]">
                {dayEvents.map((event) => {
                  const color = event.repId === "all" ? "#64748B" : getRepCalendarColor(event.repId);
                  const Icon = TYPE_ICON[event.type];

                  return (
                    <div
                      key={event.id}
                      className="rounded-lg border border-border bg-bg-card p-3 transition-all hover:scale-[1.02] cursor-default"
                      style={{ borderLeftWidth: 3, borderLeftColor: color }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon size={10} className="text-text-muted shrink-0" />
                        <span className="text-[10px] font-mono text-text-muted">{event.time}</span>
                        <span className="text-[10px] text-text-muted">· {event.duration}m</span>
                      </div>
                      <p className="text-xs font-semibold text-text leading-tight mb-1">{event.title}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-4 w-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {event.repName.charAt(0)}
                        </span>
                        <span className="text-[10px] text-text-muted">{event.repName}</span>
                      </div>
                    </div>
                  );
                })}

                {dayEvents.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-[10px] text-text-muted italic">
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
