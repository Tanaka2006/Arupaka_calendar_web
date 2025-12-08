"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMonthDays, formatDate, isToday, isSameMonth } from "@/lib/calendar"
import { getEvents, getAcademicEvents } from "@/lib/store"
import { Switch } from "@/components/ui/switch"

export function CalendarMonth({ initialMonth }: { initialMonth?: string }) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialMonth) {
      // YYYY-MM を受け取り、その月の1日を初期日付にする
      return new Date(`${initialMonth}-01`)
    }
    return new Date()
  })
  // 初期値をlocalStorageから復元
  const [showAcademic, setShowAcademic] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("show-academic")
    return stored ? stored === "true" : false
  })

  // 変更時に保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("show-academic", String(showAcademic))
    }
  }, [showAcademic])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getMonthDays(year, month)

  const userEvents = getEvents()
  const academicEvents = showAcademic ? getAcademicEvents() : []
  const allEvents = [...userEvents, ...academicEvents]

  const getEventsForDay = (date: Date) => {
    const dateStr = formatDate(date)
    return allEvents.filter((e) => e.date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (date: Date) => {
    router.push(`/${formatDate(date)}`)
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b">
        <button onClick={handlePrevMonth} className="p-1 touch-manipulation">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">
          {year}年{month + 1}月
        </h1>
        <button onClick={handleNextMonth} className="p-1 touch-manipulation">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {["月", "火", "水", "木", "金", "土", "日"].map((day, i) => (
          <div
            key={day}
            className={`text-center py-2 text-xs font-medium ${
              i === 6 ? "text-[#FF7468]" : i === 5 ? "text-[#68C0FF]" : "text-gray-700"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-hidden">
        {days.map((date, index) => {
          const dayEvents = getEventsForDay(date)
          const isCurrentMonth = isSameMonth(date, month)
          const isTodayDate = isToday(date)

          return (
            <button
              key={index}
              onClick={() => handleDayClick(date)}
              className={`border-b border-r p-1 text-left active:bg-gray-100 touch-manipulation ${!isCurrentMonth ? "text-gray-300" : ""}`}
            >
              <div className="flex flex-col h-full min-h-0">
                <div className="flex justify-center mb-0.5">
                  {isTodayDate ? (
                    <div className="w-6 h-6 rounded-full bg-[#FF7468] flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{date.getDate()}</span>
                    </div>
                  ) : (
                    <span className="text-xs">{date.getDate()}</span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] font-bold px-1 py-0.5 rounded truncate leading-tight"
                      style={{
                        backgroundColor: event.source === "academic" ? "#f5f5f5" : `${getColorHex(event.color)}20`,
                        color: event.source === "academic" ? "#656565" : getColorHex(event.color),
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Academic calendar toggle */}
      <div className="flex items-center justify-center gap-3 py-3 border-t">
        <span className="text-sm">学年暦を表示する</span>
        <Switch checked={showAcademic} onCheckedChange={setShowAcademic} />
      </div>
    </div>
  )
}

function getColorHex(color: string): string {
  const colors = {
    red: "#FF7468",
    blue: "#0888FF",
    green: "#03C700",
    orange: "#F19203",
  }
  return colors[color as keyof typeof colors] || colors.red
}
