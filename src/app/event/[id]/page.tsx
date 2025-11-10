"use client"

import React from "react"
import { EventEditor } from "@/components/event-editor"
import { useSearchParams } from "next/navigation"

export default function EventPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const date = searchParams.get("date") || undefined

  return <EventEditor eventId={params.id} initialDate={date} />
}
