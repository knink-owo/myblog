import { QuartzPageTypePlugin } from "../types"
import { match } from "./matchers"
import Dashboard from "../../components/Dashboard/Dashboard"
import { defaultProcessedContent } from "../vfile"
import { FullSlug } from "../../util/path"

export const DashboardPageType: QuartzPageTypePlugin = () => ({
  name: "dashboard",
  priority: 100,
  match: match.or(
    match.slugPrefix("仪表盘"),
    match.slugPrefix("dashboard"),
  ),
  generate({ cfg: _cfg }) {
    const slug = "仪表盘" as FullSlug
    const [, vfile] = defaultProcessedContent({
      slug,
      text: "仪表盘",
      description: "博客仪表盘 - 数据统计、活跃热力图与文章时间轴",
      frontmatter: { title: "仪表盘", tags: [] },
    })

    return [
      {
        slug,
        title: "仪表盘",
        data: vfile.data,
      },
    ]
  },
  layout: "dashboard",
  body: () => Dashboard,
})
