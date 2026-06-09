import { readFileSync } from "fs"
import { QuartzPluginData } from "../plugins/vfile"
import { SimpleSlug } from "./path"

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface DailyActivity {
  /** "2026-06-09" → count & wordCount */
  [date: string]: { count: number; wordCount: number }
}

export interface TimelineItem {
  date: Date
  title: string
  slug: SimpleSlug
  description?: string
  tags?: string[]
  wordCount?: number
}

export interface DashboardStats {
  totalPosts: number
  totalWords: number
  totalActiveDays: number
  longestStreak: number
  currentStreak: number
  postsThisMonth: number
  wordsThisMonth: number
}

export interface DashboardData {
  dailyActivity: DailyActivity
  timeline: TimelineItem[]
  stats: DashboardStats
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function toDateOnly(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function tryParseDate(raw: unknown): Date | null {
  if (!raw) return null
  const d = new Date(raw as string)
  return isNaN(d.getTime()) ? null : d
}

function extractDate(fileData: QuartzPluginData): Date | null {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  // Try frontmatter date fields (including common typo "data")
  const fromFm =
    tryParseDate(fm.date) ??
    tryParseDate(fm.data) ?? // common typo in Obsidian
    tryParseDate(fm.created) ??
    tryParseDate(fm["created-date"]) ??
    tryParseDate(fm["date-modified"]) ??
    tryParseDate(fm.modified) ??
    null
  if (fromFm) return fromFm

  // Try extracting date from the slug/filename (e.g., "0-日记本/2026-06-09")
  const slug = fileData.slug ?? ""
  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/)
  if (dateMatch) {
    return tryParseDate(dateMatch[1])
  }

  return null
}

function countWords(text: string | undefined | null): number {
  if (!text) return 0
  // Strip HTML tags and count CJK characters + word tokens
  const stripped = text.replace(/<[^>]+>/g, "")
  if (stripped.trim().length === 0) return 0
  // Count CJK characters individually + Latin words
  const cjk = stripped.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)
  const latin = stripped.match(/\b[a-zA-Z0-9]+\b/g)
  return (cjk?.length ?? 0) + (latin?.length ?? 0)
}

function normalizeSlug(slug: string): string {
  // Remove leading/trailing slashes and index suffix
  return slug.replace(/^\/+|\/+$/g, "").replace(/\/index$/, "")
}

// ────────────────────────────────────────────────────────────
// Data computation functions
// ────────────────────────────────────────────────────────────

export function computeHeatmapData(allFiles: QuartzPluginData[]): DailyActivity {
  const activity: DailyActivity = {}

  for (const file of allFiles) {
    const date = extractDate(file)
    if (!date) continue

    const key = toDateOnly(date)
    // Read actual file content for word count
    let wc = 0
    try {
      if (file.filePath) {
        const rawText = readFileSync(file.filePath as string, "utf-8")
        wc = countWords(rawText)
      }
    } catch {
      // file might not exist (virtual pages), fall back to frontmatter description
      const desc = (file.frontmatter as Record<string, unknown> | undefined)
        ?.description as string | undefined
      wc = desc ? countWords(desc) : 0
    }

    if (!activity[key]) {
      activity[key] = { count: 1, wordCount: wc }
    } else {
      activity[key].count++
      activity[key].wordCount += wc
    }
  }

  return activity
}

export function computeTimeline(allFiles: QuartzPluginData[]): TimelineItem[] {
  const items: TimelineItem[] = []

  for (const file of allFiles) {
    const date = extractDate(file)
    if (!date) continue

    const fm = (file.frontmatter ?? {}) as Record<string, unknown>
    const title = (fm.title as string) ?? file.slug ?? "Untitled"
    const slug = normalizeSlug(file.slug ?? "")

    // Skip virtual/index pages without a real title
    if (title === "Untitled" && slug === "") continue

    // Read actual file for word count (not available in frontmatter)
    let itemWordCount: number | undefined
    try {
      if (file.filePath) {
        const rawText = readFileSync(file.filePath as string, "utf-8")
        itemWordCount = countWords(rawText)
      }
    } catch {
      itemWordCount = undefined
    }

    items.push({
      date,
      title,
      slug: slug as SimpleSlug,
      description: fm.description as string | undefined,
      tags: fm.tags as string[] | undefined,
      wordCount: itemWordCount,
    })
  }

  // Sort by date descending (newest first)
  items.sort((a, b) => b.date.getTime() - a.date.getTime())
  return items
}

export function computeStats(allFiles: QuartzPluginData[]): DashboardStats {
  const activity = computeHeatmapData(allFiles)

  // Get all active dates sorted
  const activeDates = Object.keys(activity).sort()
  const totalActiveDays = activeDates.length

  // Compute streaks
  let longestStreak = 0
  let currentStreak = 0

  if (activeDates.length > 0) {
    const today = toDateOnly(new Date())

    // Walk backwards from today for current streak
    const sortedDates = activeDates.sort()
    let streak = 0
    let maxStreak = 0

    const dateSet = new Set(sortedDates)

    // Helper to add days to a date string
    const addDays = (dateStr: string, n: number): string => {
      const d = new Date(dateStr + "T00:00:00")
      d.setUTCDate(d.getUTCDate() + n)
      return toDateOnly(d)
    }

    // Calculate longest streak
    for (const dateStr of sortedDates) {
      const prev = addDays(dateStr, -1)
      if (dateSet.has(prev)) {
        streak++
      } else {
        streak = 1
      }
      if (streak > maxStreak) maxStreak = streak
    }
    longestStreak = maxStreak

    // Calculate current streak (from today backwards)
    let checkDate = today
    currentStreak = 0
    while (dateSet.has(checkDate)) {
      currentStreak++
      checkDate = addDays(checkDate, -1)
    }
  }

  // Calculate total words and posts
  let totalWords = 0
  let postsThisMonth = 0
  let wordsThisMonth = 0
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  for (const file of allFiles) {
    // Read actual file content for word count
    let wc = 0
    try {
      if (file.filePath) {
        const rawText = readFileSync(file.filePath as string, "utf-8")
        wc = countWords(rawText)
      }
    } catch {
      const desc = (file.frontmatter as Record<string, unknown> | undefined)
        ?.description as string | undefined
      wc = desc ? countWords(desc) : 0
    }
    totalWords += wc

    const date = extractDate(file)
    if (date) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (monthKey === thisMonth) {
        postsThisMonth++
        wordsThisMonth += wc
      }
    }
  }

  return {
    totalPosts: allFiles.length,
    totalWords,
    totalActiveDays,
    longestStreak,
    currentStreak,
    postsThisMonth,
    wordsThisMonth,
  }
}

export function computeDashboardData(allFiles: QuartzPluginData[]): DashboardData {
  return {
    dailyActivity: computeHeatmapData(allFiles),
    timeline: computeTimeline(allFiles),
    stats: computeStats(allFiles),
  }
}
