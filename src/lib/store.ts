"use client"

import type { CalendarEvent } from "@/types/event"
import { academic2025 } from "@/academic/academic-2025"

const STORAGE_KEY = "calendar-events"

function getEventsFromStorage(): CalendarEvent[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load events from storage:", error)
    return []
  }
}

function saveEventsToStorage(events: CalendarEvent[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error("Failed to save events to storage:", error)
  }
}

export function getEvents(): CalendarEvent[] {
  return getEventsFromStorage()
}

export function getAcademicEvents(): CalendarEvent[] {
  return [...academic2025]
}

export function saveEvent(event: CalendarEvent): void {
  const events = getEventsFromStorage()
  const index = events.findIndex((e) => e.id === event.id)
  
  if (index >= 0) {
    events[index] = event
  } else {
    events.push(event)
  }
  
  saveEventsToStorage(events)
}

export function deleteEvent(id: string): void {
  const events = getEventsFromStorage()
  const filteredEvents = events.filter((e) => e.id !== id)
  saveEventsToStorage(filteredEvents)
}

export function getEventById(id: string): CalendarEvent | undefined {
  const events = getEventsFromStorage()
  return events.find((e) => e.id === id)
}
