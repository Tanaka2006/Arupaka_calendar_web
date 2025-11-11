"use client"

import React from "react"
import { EventEditor } from "@/components/event-editor"
import { useSearchParams } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EventPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const date = searchParams.get("date") || undefined
  
  // paramsは非同期なので、useStateで管理する必要があります
  const [eventId, setEventId] = React.useState<string>("")
  
  React.useEffect(() => {
    params.then(({ id }) => setEventId(id))
  }, [params])

  if (!eventId) return <div>Loading...</div>

  return <EventEditor eventId={eventId} initialDate={date} />
}
