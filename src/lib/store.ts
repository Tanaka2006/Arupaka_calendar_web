"use client"

import type { CalendarEvent } from "@/types/event"
import { academic2025 } from "@/academic/academic-2025"

// Mock data store
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "バイト",
    date: "2025-09-23",
    allDay: false,
    startTime: "12:00",
    endTime: "13:30",
    color: "red",
    repeat: "none",
    source: "user",
  },
  {
    id: "e2",
    title: "あきくん",
    date: "2025-09-18",
    allDay: true,
    color: "blue",
    repeat: "none",
    source: "user",
  },
]

export function getEvents(): CalendarEvent[] {
  return [...mockEvents]
}

export function getAcademicEvents(): CalendarEvent[] {
  return [...academic2025]
}

export function saveEvent(event: CalendarEvent): void {
  const index = mockEvents.findIndex((e) => e.id === event.id)
  if (index >= 0) {
    mockEvents[index] = event
  } else {
    mockEvents.push(event)
  }
}

export function deleteEvent(id: string): void {
  const index = mockEvents.findIndex((e) => e.id === id)
  if (index >= 0) {
    mockEvents.splice(index, 1)
  }
}

export function getEventById(id: string): CalendarEvent | undefined {
  return mockEvents.find((e) => e.id === id)
}
