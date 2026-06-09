import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { DashboardPageType } from "./quartz/plugins/pageTypes/dashboard"
import TimelineWidget from "./quartz/components/Dashboard/TimelineWidget"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"

const config = await loadQuartzConfig()
// 注册自定义仪表盘 pageType（虚拟页面 /仪表盘）
config.plugins.pageTypes ??= []
config.plugins.pageTypes.push(DashboardPageType())

// 重新构建 layout，注入时间轴到仪表盘右侧栏
const rawLayout = await loadQuartzLayout()
if (rawLayout.byPageType["dashboard"]) {
  rawLayout.byPageType["dashboard"].right = [TimelineWidget(undefined)]
}
// 替换掉 loadQuartzConfig 内部创建的 PageTypeDispatcher
const dispatcherIdx = config.plugins.emitters.findIndex((e) => e.name === "PageTypeDispatcher")
if (dispatcherIdx !== -1) {
  config.plugins.emitters[dispatcherIdx] = PageTypeDispatcher({
    defaults: rawLayout.defaults,
    byPageType: rawLayout.byPageType,
  })
}
export default config
export const layout = rawLayout
