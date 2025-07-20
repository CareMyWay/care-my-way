"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WeekNavigationProps {
  currentWeekStart: Date
  onNavigate: (direction: "prev" | "next") => void
  canNavigatePrev: boolean
}

export function WeekNavigation({ currentWeekStart, onNavigate, canNavigatePrev }: WeekNavigationProps) {
  const getWeekInfo = () => {
    const startDate = currentWeekStart
    const endDate = new Date(currentWeekStart)
    endDate.setDate(startDate.getDate() + 6)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStartCopy = new Date(startDate)
    weekStartCopy.setHours(0, 0, 0, 0)

    const diffTime = weekStartCopy.getTime() - today.getTime()
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

    let weekLabel = ""
    if (diffWeeks === 1) {
      weekLabel = "Next Week"
    } else if (diffWeeks === 2) {
      weekLabel = "2 Weeks Ahead"
    } else {
      weekLabel = `${diffWeeks} Weeks Ahead`
    }

    return { startDate, endDate, weekLabel }
  }

  const getCurrentWeekDates = () => {
    const dates = []
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      dates.push({ date, dayName: daysOfWeek[i] })
    }
    return dates
  }

  const { startDate, endDate, weekLabel } = getWeekInfo()
  const weekDates = getCurrentWeekDates()

  return (
    <Card className="dashboard-card mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onNavigate("prev")}
            className="dashboard-button-secondary"
            disabled={!canNavigatePrev}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Week
          </Button>

          <div className="text-center">
            <h2 className="text-2xl font-semibold dashboard-text-primary">
              {startDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {endDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm dashboard-text-secondary font-medium">{weekLabel}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {weekDates.map((item, index) => (
                <div key={index} className="text-xs dashboard-text-secondary">
                  {item.dayName.slice(0, 3)} {item.date.getDate()}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => onNavigate("next")} className="dashboard-button-secondary">
            Next Week
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
