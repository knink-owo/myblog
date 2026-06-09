import { QuartzComponentProps } from "../types"
import { TimelineItem as TimelineItemType } from "../../util/dashboardData"
import { classNames } from "../../util/lang"

type Props = QuartzComponentProps & { items: TimelineItemType[] }

const MONTHS_ZH = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
]

function fmtDate(d: Date): string {
  return `${d.getFullYear()}年${MONTHS_ZH[d.getMonth()]}${d.getDate()}日`
}

function groupByYearMonth(items: TimelineItemType[]): Map<string, TimelineItemType[]> {
  const groups = new Map<string, TimelineItemType[]>()
  for (const item of items) {
    const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return groups
}

function formatGroupLabel(key: string): string {
  const [year, month] = key.split("-")
  return `${year}年${MONTHS_ZH[parseInt(month) - 1]}`
}

const Timeline = ({ items, displayClass }: Props) => {
  const groups = groupByYearMonth(items)

  if (items.length === 0) {
    return (
      <div class={classNames(displayClass, "dashboard-timeline")}>
        <h3>📅 时间轴</h3>
        <p class="timeline-empty">暂无文章</p>
      </div>
    )
  }

  return (
    <div class={classNames(displayClass, "dashboard-timeline")}>
      <h3>📅 时间轴</h3>
      <div class="timeline-list">
        {[...groups.entries()].map(([groupKey, groupItems]) => (
          <div class="timeline-group">
            <div class="timeline-group-header">
              <span class="timeline-dot" />
              <span class="timeline-group-label">{formatGroupLabel(groupKey)}</span>
              <span class="timeline-group-count">{groupItems.length} 篇</span>
            </div>
            <div class="timeline-group-items">
              {groupItems.map((item) => (
                <div class="timeline-item">
                  <span class="timeline-item-dot" />
                  <div class="timeline-item-content">
                    <a href={`/${item.slug}`} class="timeline-item-title">
                      {item.title}
                    </a>
                    <span class="timeline-item-date">{fmtDate(item.date)}</span>
                    {item.description && (
                      <span class="timeline-item-desc">{item.description}</span>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <span class="timeline-item-tags">
                        {item.tags.map((tag) => (
                          <span class="timeline-tag">{tag}</span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
