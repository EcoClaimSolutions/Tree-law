import type { SavedCalculation } from "./calculator"

// In-memory reports storage, keyed by user email
const USER_REPORTS: Record<string, SavedCalculation[]> = {}

export function saveReportForUser(userEmail: string, report: SavedCalculation): SavedCalculation {
  if (!USER_REPORTS[userEmail]) {
    USER_REPORTS[userEmail] = []
  }

  const newReport = {
    ...report,
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  }

  USER_REPORTS[userEmail].push(newReport)
  return newReport
}

export function getReportsForUser(userEmail: string): SavedCalculation[] {
  return USER_REPORTS[userEmail] || []
}

export function getReportById(userEmail: string, reportId: string): SavedCalculation | null {
  const reports = USER_REPORTS[userEmail] || []
  return reports.find((r) => r.id === reportId) || null
}

export function deleteReportForUser(userEmail: string, reportId: string): boolean {
  if (!USER_REPORTS[userEmail]) return false

  const index = USER_REPORTS[userEmail].findIndex((r) => r.id === reportId)
  if (index === -1) return false

  USER_REPORTS[userEmail].splice(index, 1)
  return true
}
