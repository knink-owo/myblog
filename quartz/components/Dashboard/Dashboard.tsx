import { QuartzComponent, QuartzComponentProps } from "../types"
import { computeDashboardData } from "../../util/dashboardData"
import { classNames } from "../../util/lang"
import StatsCards from "./StatsCards"
import Heatmap from "./Heatmap"
// Graph component — show full site graph in local view (not the overlay)
const _g = await import("../../../.quartz/plugins/graph/dist/components/index.js")
const DGraph: any = (_g as any).Graph({
  localGraph: { depth: -1 },
  globalGraph: { depth: -1 },
})

const Dashboard: QuartzComponent = (props: QuartzComponentProps) => {
  const { allFiles, displayClass } = props
  const data = computeDashboardData(allFiles)

  return (
    <div class={classNames(displayClass, "dashboard-page")}>
      <h1 class="dashboard-title">📊 仪表盘</h1>
      <StatsCards stats={data.stats} {...props} />
      <div class="dashboard-body">
        <Heatmap dailyActivity={data.dailyActivity} {...props} />
        <div class="dashboard-graph">
          <h3>🌐 全站图谱</h3>
          <DGraph {...props} />
        </div>
      </div>
    </div>
  )
}

// ── CSS ─────────────────────────────────────────────────────
Dashboard.css = `
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
.dashboard-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: var(--lightgray, #f0f0f0);
  border-radius: 12px;
  padding: 1.2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.stat-icon { font-size: 1.6rem; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--dark, #333); }
.stat-label { font-size: 0.8rem; color: var(--gray, #888); }

.dashboard-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Heatmap */
.dashboard-heatmap h3 { font-size: 1.1rem; margin-bottom: 0.8rem; }
.heatmap-container { display: flex; gap: 0.3rem; align-items: flex-start; }
.heatmap-weekdays { display: grid; grid-template-rows: repeat(7, 12px); gap: 2px; padding-top: 1.2rem; }
.weekday-label { font-size: 0.55rem; color: var(--gray, #888); line-height: 12px; text-align: right; padding-right: 2px; }
.heatmap-scroll { overflow-x: auto; flex: 1; }
.heatmap-month-labels { display: grid; grid-template-columns: repeat(53, 12px); gap: 2px; margin-bottom: 2px; }
.month-label { font-size: 0.55rem; color: var(--gray, #888); grid-row: 1; }
.heatmap-grid { display: grid; grid-template-columns: repeat(53, 12px); gap: 2px; }
.heatmap-week { display: grid; grid-template-rows: repeat(7, 12px); gap: 2px; }
.heatmap-cell { width: 12px; height: 12px; border-radius: 2px; background: var(--lightgray, #ebedf0); }
.heatmap-lvl-0 { background: var(--lightgray, #ebedf0); }
.heatmap-lvl-1 { background: #9be9a8; }
.heatmap-lvl-2 { background: #40c463; }
.heatmap-lvl-3 { background: #30a14e; }
.heatmap-lvl-4 { background: #216e39; }
[saved-theme="dark"] .heatmap-lvl-0 { background: #1a1a2e; }
[saved-theme="dark"] .heatmap-lvl-1 { background: #0e4429; }
[saved-theme="dark"] .heatmap-lvl-2 { background: #006d32; }
[saved-theme="dark"] .heatmap-lvl-3 { background: #26a641; }
[saved-theme="dark"] .heatmap-lvl-4 { background: #39d353; }
.heatmap-legend {
  display: flex; align-items: center; gap: 3px; margin-top: 0.5rem;
  font-size: 0.65rem; color: var(--gray, #888); justify-content: flex-end;
}
.heatmap-legend .heatmap-cell { width: 10px; height: 10px; }

/* Graph */
.dashboard-graph h3 { font-size: 1.1rem; margin-bottom: 0.8rem; }
.dashboard-graph .graph { width: 100%; max-width: 100%; }
.dashboard-graph .graph-outer,
.dashboard-graph .global-graph-outer { width: 100%; aspect-ratio: 16/9; min-height: 400px; }
.dashboard-graph .global-graph-outer { display: none !important; }

@media (max-width: 768px) {
  .dashboard-stats { grid-template-columns: repeat(2, 1fr); }
  .heatmap-scroll { max-width: calc(100vw - 4rem); }
}
@media (max-width: 480px) {
  .dashboard-stats { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  .stat-card { padding: 0.8rem 0.5rem; }
  .stat-value { font-size: 1.2rem; }
}
`

export default Dashboard
