import { QuartzComponentProps } from "../types"
import { DailyActivity } from "../../util/dashboardData"
import { classNames } from "../../util/lang"

type Props = QuartzComponentProps & { dailyActivity: DailyActivity }

// ────────────────────────────────────────────────────────────
// Layout constants
// ────────────────────────────────────────────────────────────
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]
const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
]
const TOTAL_WEEKS = 53 // ~1 year

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getColorIntensity(count: number, maxCount: number): number {
  if (count === 0 || maxCount === 0) return 0
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function getColorClass(level: number): string {
  return `heatmap-lvl-${level}`
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

const Heatmap = ({ dailyActivity, displayClass }: Props) => {
  // Build the grid
  const now = new Date()
  // End on the last Saturday (inclusive)
  const endDay = new Date(now)
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay())) // next Saturday

  // Start 52 weeks back from endDay's Saturday, aligned to Sunday
  const startDay = new Date(endDay)
  startDay.setDate(startDay.getDate() - (TOTAL_WEEKS * 7 - 1))

  // Compute max count for color scaling
  let maxCount = 1
  const entries = Object.values(dailyActivity)
  for (const entry of entries) {
    if (entry.count > maxCount) maxCount = entry.count
  }

  // Build a grid: rows = 0..6 (Sun..Sat), cols = 0..52
  // Each cell maps to a specific calendar date
  const grid: { dateStr: string; count: number; level: number }[][] = []
  const monthStartCols: { col: number; label: string }[] = []
  let lastMonth = -1

  for (let col = 0; col < TOTAL_WEEKS; col++) {
    const week: { dateStr: string; count: number; level: number }[] = []
    for (let row = 0; row < 7; row++) {
      const d = new Date(startDay)
      d.setDate(d.getDate() + col * 7 + row)
      const dateStr = toDateStr(d)

      // Check month boundary
      const month = d.getMonth()
      if (col === 0 || (row === 0 && month !== lastMonth)) {
        monthStartCols.push({ col, label: MONTH_LABELS[month] })
        lastMonth = month
      }

      const cell = dailyActivity[dateStr]
      const count = cell?.count ?? 0
      week.push({
        dateStr,
        count,
        level: getColorIntensity(count, maxCount),
      })
    }
    grid.push(week)
  }

  // Render month labels — show at first column of each month
  const monthLabelRow: (string | null)[] = Array(TOTAL_WEEKS).fill(null)
  for (const { col, label } of monthStartCols) {
    monthLabelRow[col] = label
  }

  return (
    <div class={classNames(displayClass, "dashboard-heatmap")}>
      <h3>📊 活跃热力图</h3>
      <div class="heatmap-container">
        <div class="heatmap-weekdays">
          {WEEKDAYS.map((day) => (
            <span class="weekday-label">{day}</span>
          ))}
        </div>
        <div class="heatmap-scroll">
          <div class="heatmap-month-labels">
            {monthLabelRow.map((label, i) => (
              <span class="month-label" style={`grid-column: ${i + 1}`}>
                {label ?? ""}
              </span>
            ))}
          </div>
          <div class="heatmap-grid">
            {grid.map((week, colIdx) => (
              <div class="heatmap-week" style={`grid-column: ${colIdx + 1}`}>
                {week.map((cell) => (
                  <div
                    class={`heatmap-cell ${getColorClass(cell.level)}`}
                    title={`${cell.dateStr}: ${cell.count} 篇文章`}
                    data-tooltip={`${cell.dateStr}: ${cell.count} 篇文章`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div class="heatmap-legend">
        <span>少</span>
        <span class={`heatmap-cell ${getColorClass(0)}`} />
        <span class={`heatmap-cell ${getColorClass(1)}`} />
        <span class={`heatmap-cell ${getColorClass(2)}`} />
        <span class={`heatmap-cell ${getColorClass(3)}`} />
        <span class={`heatmap-cell ${getColorClass(4)}`} />
        <span>多</span>
      </div>
    </div>
  )
}

export default Heatmap
