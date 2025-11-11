import React from "react"
import { DayView } from "@/components/day-view"

interface PageProps {
  params: Promise<{ date: string }>
}

export default async function DayPage({ params }: PageProps) {
  const { date } = await params
  return <DayView date={date} />
}
