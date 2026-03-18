import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { saveReportForUser } from "@/lib/reports"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const report = await request.json()
  const savedReport = saveReportForUser(session.email as string, report)

  return NextResponse.json({ success: true, report: savedReport })
}
