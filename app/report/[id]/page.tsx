"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { SavedCalculation } from "@/lib/calculator"
import { ReportView } from "@/components/report/report-view"

export default function SavedReportPage() {
  const router = useRouter()
  const params = useParams()
  const [report, setReport] = useState<SavedCalculation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch("/api/reports/list")
        if (response.ok) {
          const data = await response.json()
          const foundReport = data.reports?.find((r: SavedCalculation) => r.id === params.id)
          if (foundReport) {
            setReport(foundReport)
          } else {
            router.push("/profile")
          }
        } else {
          router.push("/profile")
        }
      } catch (error) {
        router.push("/profile")
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#9bfee9" }}>
        <p className="text-xl" style={{ color: "#003c46" }}>
          Loading report...
        </p>
      </div>
    )
  }

  if (!report) {
    return null
  }

  return (
    <ReportView
      propertyInfo={report.propertyInfo}
      treeInfo={report.treeInfo}
      scenarios={report.scenarios}
      onBack={() => router.push("/profile")}
    />
  )
}
