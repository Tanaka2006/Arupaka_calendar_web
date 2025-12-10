'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Palette } from "lucide-react"
import type { CalendarEvent, EventColor } from "@/types/event"
import { getEventById, saveEvent, deleteEvent } from "@/lib/store"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface EventEditorProps {
  eventId?: string
  initialDate?: string
}

export function EventEditor({ eventId, initialDate }: EventEditorProps) {
  const router = useRouter()
  const isNew = !eventId || eventId === "new"

  const formatTime = (d: Date) => d.toTimeString().slice(0, 5)
  const now = new Date()
  const oneHourLater = new Date(now)
  oneHourLater.setHours(now.getHours() + 1)

  const [title, setTitle] = useState("")
  const [allDay, setAllDay] = useState(false)
  const [startTime, setStartTime] = useState(formatTime(now))
  const [endTime, setEndTime] = useState(formatTime(oneHourLater))
  const [color, setColor] = useState<EventColor>("red")

  useEffect(() => {
    if (!isNew && eventId) {
      const event = getEventById(eventId)
      if (event) {
        const timer = setTimeout(() => {
          setTitle(event.title)
          setAllDay(event.allDay)
          setStartTime(event.startTime || formatTime(now))
          setEndTime(event.endTime || formatTime(oneHourLater))
          setColor(event.color || "red")
        }, 0)
        
        return () => clearTimeout(timer)
      }
    }
  }, [eventId, isNew, initialDate])

  const handleSave = () => {
    const event: CalendarEvent = {
      id: isNew ? `e${Date.now()}` : eventId,
      title,
      date: initialDate || new Date().toISOString().split("T")[0],
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      color,
      source: "user",
    }

    saveEvent(event)
    router.back()
  }

  const handleDelete = () => {
    if (!isNew) {
      deleteEvent(eventId)
    }
    router.back()
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center px-3 py-3 border-b">
        <button onClick={() => router.back()} className="p-1 touch-manipulation">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium ml-2">{title || "予定"}</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトル"
              className="w-full text-base font-medium border-b pb-2 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* All day toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm">終日</span>
            <Switch checked={allDay} onCheckedChange={setAllDay} />
          </div>

          {/* Time pickers */}
          {!allDay && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">開始</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-sm touch-manipulation"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">終了</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-sm touch-manipulation"
                />
              </div>
            </>
          )}

          {/* Color picker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" style={{ color: getColorHex(color) }} />
              <span className="text-sm">カラー</span>
            </div>
            <div className="flex gap-2">
              {(["red", "blue", "green", "orange"] as EventColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full touch-manipulation ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                  style={{ backgroundColor: getColorHex(c) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <Button onClick={handleSave} className="w-full touch-manipulation">
          保存
        </Button>
        {!isNew && (
          <Button onClick={handleDelete} variant="destructive" className="w-full touch-manipulation">
            削除
          </Button>
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
