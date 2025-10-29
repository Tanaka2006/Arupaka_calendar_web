export type EventColor = "red" | "blue" | "green" | "orange"

export type Repeat = "none" | "daily" | "weekly" | "monthly"

export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  allDay: boolean
  startTime?: string // HH:mm
  endTime?: string // HH:mm
  color: EventColor
  repeat: Repeat
  repeatInterval?: number // for daily: n days
  repeatDays?: number[] // for weekly: [0..6] (Monday=0)
  repeatEndDate?: string // YYYY-MM-DD
  source?: "user" | "academic"
}
