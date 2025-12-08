import React from "react"
import { EventEditor } from "@/components/event-editor"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}

export default async function EventPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { date } = await searchParams
  return <EventEditor eventId={id} initialDate={date} />
}
