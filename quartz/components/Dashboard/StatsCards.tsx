import { QuartzComponentProps } from "../types"
import { DashboardStats } from "../../util/dashboardData"
import { classNames } from "../../util/lang"

type Props = QuartzComponentProps & { stats: DashboardStats }

function fmt(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万"
  if (n >= 1000) return n.toLocaleString("zh-CN")
  return String(n)
}

const cardDefs = [
  { key: "totalPosts" as const, icon: "📝", label: "总文章数" },
  { key: "totalWords" as const, icon: "✍️", label: "总字数" },
  { key: "totalActiveDays" as const, icon: "📅", label: "活跃天数" },
  { key: "longestStreak" as const, icon: "🔥", label: "最长连续打卡" },
]

const StatsCards = ({ stats, displayClass }: Props) => {
  return (
    <div class={classNames(displayClass, "dashboard-stats")}>
      {cardDefs.map((def) => (
        <div class="stat-card">
          <span class="stat-icon">{def.icon}</span>
          <span class="stat-value">{fmt(stats[def.key])}</span>
          <span class="stat-label">{def.label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
