import { CalendarMonth } from "@/components/calendar-month"

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { month } = await searchParams
  return <CalendarMonth initialMonth={month} />
}
