export type EventColor = "red" | "blue" | "green" | "orange"

export interface BaseCalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  allDay: boolean
  startTime?: string // HH:mm
  endTime?: string // HH:mm
}

export type CalendarEvent = 
  | (BaseCalendarEvent & { 
      color: EventColor
      source?: "user"
    })
  | (BaseCalendarEvent & {
      color?: EventColor
      source: "academic"
    })
