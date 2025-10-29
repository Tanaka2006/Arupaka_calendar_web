import { DayView } from "@/components/day-view"

export default function DayPage({ params }: { params: { date: string } }) {
  return <DayView date={params.date} />
}
