import type { CalendarEvent } from "@/types/event"
import { parseDate, formatDate } from "./calendar"

export function generateRecurringEvents(event: CalendarEvent, startDate: Date, endDate: Date): CalendarEvent[] {
  if (event.repeat === "none") {
    return [event]
  }

  const events: CalendarEvent[] = []
  const eventDate = parseDate(event.date)
  const repeatEnd = event.repeatEndDate ? parseDate(event.repeatEndDate) : endDate

  let currentDate = new Date(eventDate)

  while (currentDate <= repeatEnd && currentDate <= endDate) {
    if (currentDate >= startDate && currentDate >= eventDate) {
      if (shouldIncludeDate(event, currentDate)) {
        events.push({
          ...event,
          id: `${event.id}-${formatDate(currentDate)}`,
          date: formatDate(currentDate),
        })
      }
    }

    currentDate = getNextOccurrence(event, currentDate)

    // Safety check to prevent infinite loops
    if (currentDate.getTime() === eventDate.getTime()) {
      break
    }
  }

  return events
}

function shouldIncludeDate(event: CalendarEvent, date: Date): boolean {
  if (event.repeat === "weekly" && event.repeatDays) {
    const dayOfWeek = (date.getDay() + 6) % 7 // Convert to Monday=0
    return event.repeatDays.includes(dayOfWeek)
  }
  return true
}

function getNextOccurrence(event: CalendarEvent, currentDate: Date): Date {
  const next = new Date(currentDate)

  switch (event.repeat) {
    case "daily":
      next.setDate(next.getDate() + (event.repeatInterval || 1))
      break
    case "weekly":
      next.setDate(next.getDate() + 1)
      break
    case "monthly":
      const originalDay = parseDate(event.date).getDate()
      next.setMonth(next.getMonth() + 1)
      // Handle month-end adjustment
      const daysInMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
      next.setDate(Math.min(originalDay, daysInMonth))
      break
  }

  return next
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dateStr = formatDate(date)
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const allEvents: CalendarEvent[] = []

  events.forEach((event) => {
    const recurring = generateRecurringEvents(event, monthStart, monthEnd)
    allEvents.push(...recurring)
  })

  return allEvents
    .filter((event) => event.date === dateStr)
    .sort((a, b) => {
      // All-day events first
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      // Then by start time
      if (!a.allDay && !b.allDay) {
        return (a.startTime || "").localeCompare(b.startTime || "")
      }
      return 0
    })
}
