import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { computeTimeline } from "../../util/dashboardData"
import { classNames } from "../../util/lang"

const MONTHS_ZH = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
]

function fmtDate(d: Date): string {
  return `${d.getFullYear()}年${MONTHS_ZH[d.getMonth()]}${d.getDate()}日`
}

function groupByYearMonth(items: { date: Date; title: string; slug: string; description?: string; tags?: string[] }[]) {
  const groups = new Map<string, typeof items>()
  for (const item of items) {
    const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return groups
}

const Widget: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
  const items = computeTimeline(allFiles)

  if (items.length === 0) {
    return (
      <div class={classNames(displayClass, "sidebar-timeline")}>
        <h3>📅 时间轴</h3>
        <p class="timeline-empty">暂无文章</p>
      </div>
    )
  }

  const groups = groupByYearMonth(items)
  // Show only the most recent 3 month groups in the sidebar
  const recentGroups = [...groups.entries()].slice(0, 3)

  return (
    <div class={classNames(displayClass, "sidebar-timeline")}>
      <h3>📅 时间轴</h3>
      <div class="stl-list">
        {recentGroups.map(([groupKey, groupItems]) => (
          <div class="stl-group">
            <div class="stl-group-label">
              {groupKey.split("-")[0]}年{MONTHS_ZH[parseInt(groupKey.split("-")[1]) - 1]}
            </div>
            {groupItems.map((item) => (
              <a href={`/${item.slug}`} class="stl-item">
                <span class="stl-date">{fmtDate(item.date)}</span>
                <span class="stl-title">{item.title}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Attach CSS
Widget.css = `
.sidebar-timeline {
  padding: 0.5rem 0;
}

.sidebar-timeline h3 {
  font-size: 0.9rem;
  margin-bottom: 0.6rem;
  opacity: 0.75;
}

.stl-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stl-group-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gray);
  margin-bottom: 0.2rem;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid var(--lightgray);
}

.stl-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.2rem 0;
  text-decoration: none;
  color: var(--dark);
  font-size: 0.75rem;
  line-height: 1.3;
}

.stl-item:hover {
  color: var(--secondary);
}

.stl-date {
  font-size: 0.6rem;
  color: var(--gray);
}

.stl-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.timeline-empty {
  color: var(--gray);
  font-size: 0.8rem;
  font-style: italic;
}
`

const TimelineWidget: QuartzComponentConstructor = () => Widget
export default TimelineWidget
