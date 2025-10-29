export function getMonthDays(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
  
    // Monday = 1, Sunday = 0 -> we want Monday = 0
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Monday=0
    const daysInMonth = lastDay.getDate()
  
    const days: Date[] = []
  
    // Add previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push(date)
    }
  
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
  
    // Add next month days to complete the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }
  
    return days
  }
  
  export function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  
  export function parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
  }
  
  export function isToday(date: Date): boolean {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }
  
  export function isSameMonth(date: Date, month: number): boolean {
    return date.getMonth() === month
  }
  
  export function getJapaneseDayOfWeek(date: Date): string {
    const days = ["月", "火", "水", "木", "金", "土", "日"]
    return days[(date.getDay() + 6) % 7] + "曜日"
  }
  
  export function getColorClass(color: string): string {
    const colors = {
      red: "#FF7468",
      blue: "#68C0FF",
      green: "#83FF68",
      orange: "#FFBD68",
    }
    return colors[color as keyof typeof colors] || colors.red
  }
  