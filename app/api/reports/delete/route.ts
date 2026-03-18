import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { deleteReportForUser } from "@/lib/reports"

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { reportId } = await request.json()
  const success = deleteReportForUser(session.email as string, reportId)

  if (!success) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
