"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Plus } from "lucide-react"
import { parseDate, getJapaneseDayOfWeek } from "@/lib/calendar"
import { getEvents, getAcademicEvents } from "@/lib/store"

interface DayViewProps {
  date: string
}

export function DayView({ date }: DayViewProps) {
  const router = useRouter()
  const dateObj = parseDate(date)

  const userEvents = getEvents()
  const academicEvents = getAcademicEvents()
  const allEvents = [...userEvents, ...academicEvents]

  const dayEvents = allEvents.filter((event) => event.date === date)
  const academicDayEvents = dayEvents.filter((e) => e.source === "academic")
  const userDayEvents = dayEvents.filter((e) => e.source === "user")

  const handleBack = () => {
    const month = date.slice(0, 7)
    router.push(`/?month=${month}`)
  }

  const handleAddEvent = () => {
    router.push(`/event/new?date=${date}`)
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b">
        <button onClick={handleBack} className="p-1 touch-manipulation">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button onClick={handleAddEvent} className="p-1 touch-manipulation">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Date title */}
      <div className="px-4 py-3">
        <h1 className="text-lg font-medium">
          {dateObj.getMonth() + 1}月 {dateObj.getDate()}日 {getJapaneseDayOfWeek(dateObj)}
        </h1>
        {academicDayEvents.length > 0 && (
          <div className="mt-2 space-y-1">
            {academicDayEvents.map((event) => (
              <div key={`${event.id}-${event.title}`} className="text-xs" style={{ color: "#656565" }}>
                {event.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {userDayEvents.length === 0 && academicDayEvents.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 text-sm">予定がありません</div>
        ) : (
          <div className="space-y-3">
            {userDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="w-full text-left active:bg-gray-50 p-2 -mx-2 rounded touch-manipulation"
              >
                <div className="flex gap-3">
                  <div className="w-1 rounded-full" style={{ backgroundColor: getColorHex(event.color || "red") }} />
                  <div className="flex-1">
                    {!event.allDay && (
                      <div className="text-xs text-gray-600 mb-1">
                        {event.startTime}–{event.endTime}
                      </div>
                    )}
                    <div className="font-medium text-sm">{event.title}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getColorHex(color: string): string {
  const colors = {
    red: "#FF7468",
    blue: "#68C0FF",
    green: "#83FF68",
    orange: "#FFBD68",
  }
  return colors[color as keyof typeof colors] || colors.red
}
