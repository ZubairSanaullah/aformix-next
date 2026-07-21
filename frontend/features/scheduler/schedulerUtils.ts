export interface ScheduleItem {
  id: string;
  title: string;
  start: string; // ISO date
  end?: string; // ISO date
  allDay?: boolean;
  type?: "meeting" | "focus" | "reminder";
}

export const sampleSchedule: ScheduleItem[] = [
  { id: "s1", title: "Client strategy sync", start: new Date().toISOString(), type: "meeting" },
  { id: "s2", title: "Focus: Landing page", start: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), type: "focus" },
];
