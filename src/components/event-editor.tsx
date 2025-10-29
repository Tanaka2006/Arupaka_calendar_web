"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Palette } from "lucide-react"
import type { CalendarEvent, EventColor, Repeat } from "@/types/event"
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

  const [title, setTitle] = useState("")
  const [allDay, setAllDay] = useState(false)
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("13:30")
  const [color, setColor] = useState<EventColor>("red")
  const [repeat, setRepeat] = useState<Repeat>("none")
  const [repeatInterval, setRepeatInterval] = useState(1)
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [hasRepeatEnd, setHasRepeatEnd] = useState(false)
  const [repeatEndDate, setRepeatEndDate] = useState("")
  const [repeatExpanded, setRepeatExpanded] = useState(false)

  useEffect(() => {
    if (!isNew && eventId) {
      const event = getEventById(eventId)
      if (event) {
        // Use a timeout to avoid synchronous setState in effect
        const timer = setTimeout(() => {
          setTitle(event.title)
          setAllDay(event.allDay)
          setStartTime(event.startTime || "12:00")
          setEndTime(event.endTime || "13:30")
          setColor(event.color)
          setRepeat(event.repeat)
          setRepeatInterval(event.repeatInterval || 1)
          setRepeatDays(event.repeatDays || [])
          setHasRepeatEnd(!!event.repeatEndDate)
          setRepeatEndDate(event.repeatEndDate || "")
        }, 0)
        
        return () => clearTimeout(timer)
      }
    } else if (initialDate) {
      const timer = setTimeout(() => {
        const date = new Date(initialDate)
        const endDate = new Date(date)
        endDate.setMonth(endDate.getMonth() + 1)
        setRepeatEndDate(endDate.toISOString().split("T")[0])
      }, 0)
      
      return () => clearTimeout(timer)
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
      repeat,
      repeatInterval: repeat === "daily" ? repeatInterval : undefined,
      repeatDays: repeat === "weekly" ? repeatDays : undefined,
      repeatEndDate: hasRepeatEnd ? repeatEndDate : undefined,
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

  const toggleRepeatDay = (day: number) => {
    setRepeatDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const adjustRepeatEndDate = (field: "year" | "month" | "day", delta: number) => {
    const date = new Date(repeatEndDate || new Date())
    if (field === "year") date.setFullYear(date.getFullYear() + delta)
    if (field === "month") date.setMonth(date.getMonth() + delta)
    if (field === "day") date.setDate(date.getDate() + delta)
    setRepeatEndDate(date.toISOString().split("T")[0])
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

          {/* Repeat section */}
          <div>
            <button
              onClick={() => setRepeatExpanded(!repeatExpanded)}
              className="flex items-center justify-between w-full touch-manipulation"
            >
              <span className="text-sm">繰り返し</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${repeatExpanded ? "rotate-90" : ""}`} />
            </button>

            {repeatExpanded && (
              <div className="mt-4 space-y-4">
                {/* Repeat mode */}
                <div className="flex gap-2 flex-wrap">
                  {(["none", "daily", "weekly", "monthly"] as Repeat[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRepeat(mode)}
                      className={`px-3 py-1.5 text-xs rounded-full touch-manipulation ${
                        repeat === mode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {mode === "none" && "なし"}
                      {mode === "daily" && "毎日"}
                      {mode === "weekly" && "毎週"}
                      {mode === "monthly" && "毎月"}
                    </button>
                  ))}
                </div>

                {/* Daily interval */}
                {repeat === "daily" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRepeatInterval(Math.max(1, repeatInterval - 1))}
                      className="px-3 py-1.5 border rounded text-sm touch-manipulation"
                    >
                      -
                    </button>
                    <span className="text-sm">{repeatInterval}日ごと</span>
                    <button
                      onClick={() => setRepeatInterval(repeatInterval + 1)}
                      className="px-3 py-1.5 border rounded text-sm touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Weekly days */}
                {repeat === "weekly" && (
                  <div className="flex gap-1.5">
                    {["月", "火", "水", "木", "金", "土", "日"].map((day, i) => (
                      <button
                        key={i}
                        onClick={() => toggleRepeatDay(i)}
                        className={`w-9 h-9 rounded-full text-xs touch-manipulation ${
                          repeatDays.includes(i) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}

                {/* Repeat end date */}
                {repeat !== "none" && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasRepeatEnd}
                        onChange={(e) => setHasRepeatEnd(e.target.checked)}
                        className="w-4 h-4 touch-manipulation"
                      />
                      <span className="text-xs">繰り返し終了日を設定する</span>
                    </div>

                    {hasRepeatEnd && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustRepeatEndDate("year", -1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            -
                          </button>
                          <span className="text-xs w-14 text-center">{new Date(repeatEndDate).getFullYear()}年</span>
                          <button
                            onClick={() => adjustRepeatEndDate("year", 1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustRepeatEndDate("month", -1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            -
                          </button>
                          <span className="text-xs w-10 text-center">{new Date(repeatEndDate).getMonth() + 1}月</span>
                          <button
                            onClick={() => adjustRepeatEndDate("month", 1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustRepeatEndDate("day", -1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            -
                          </button>
                          <span className="text-xs w-10 text-center">{new Date(repeatEndDate).getDate()}日</span>
                          <button
                            onClick={() => adjustRepeatEndDate("day", 1)}
                            className="px-2 py-1 border rounded text-xs touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
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
