"use client"

import { useState, useEffect } from "react"
import type { PropertyInfo, TreeInfo, Scenario } from "@/lib/calculator"
import { TreeParamsForm } from "@/components/calculator/tree-params-form"
import { ScenarioTabs } from "@/components/calculator/scenario-tabs"
import { ScenarioList } from "@/components/calculator/scenario-list"
import { ReportView } from "@/components/report/report-view"
import { SaveModal } from "@/components/save-load/save-modal"
import { AppFooter } from "@/components/footer/app-footer"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/navigation/top-nav"

export default function SubsidenceCalculator() {
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    type: "2 storey semi detached house",
    damageDate: "summer 2024",
    location: "London",
  })

  const [treeInfo, setTreeInfo] = useState<TreeInfo>({
    species: "",
    ownership: "",
    claimReference: "",
    diameter: 40,
    height: 12,
    quantity: 1,
    postalCode: "", // Added postal code field
    damageDate: "", // Added damage date field
  })

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [showReport, setShowReport] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      }
    }
    checkAuth()
  }, [])

  const handleTreeChange = (updates: Partial<TreeInfo>) => {
    setTreeInfo((prev) => ({ ...prev, ...updates }))
  }

  const handleAddScenario = (scenario: Scenario) => {
    setScenarios((prev) => [...prev, scenario])
  }

  const handleRemoveScenario = (id: number) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }

  const handleSave = async (name: string) => {
    if (!user) {
      alert("Please login to save calculations")
      return
    }

    const report = {
      id: "",
      name,
      timestamp: Date.now(),
      propertyInfo,
      treeInfo,
      scenarios,
    }

    try {
      const response = await fetch("/api/reports/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      })

      if (response.ok) {
        setShowSaveModal(false)
        alert("Report saved successfully!")
      } else {
        alert("Failed to save report")
      }
    } catch (error) {
      alert("Error saving report")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  const handleSaveClick = () => {
    if (!user) {
      alert("Please login to save calculations")
      return
    }
    setShowSaveModal(true)
  }

  const handleSaveReport = () => {
    if (!user) {
      alert("Please login to save reports")
      return
    }
    setShowSaveModal(true)
  }

  if (showReport) {
    return (
      <ReportView
        propertyInfo={propertyInfo}
        treeInfo={treeInfo}
        scenarios={scenarios}
        onBack={() => setShowReport(false)}
      />
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#9bfee9" }}>
      <div className="max-w-6xl mx-auto">
        <TopNav scenariosCount={scenarios.length} onViewReport={() => setShowReport(true)} />

        {/* Top Section: Tree Parameters and Add Scenario Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TreeParamsForm treeInfo={treeInfo} onChange={handleTreeChange} />
          <ScenarioTabs onAddScenario={handleAddScenario} treeInfo={treeInfo} />
        </div>

        {/* Bottom Section: Added Scenarios List */}
        <ScenarioList
          scenarios={scenarios}
          onRemove={handleRemoveScenario}
          totalCO2={scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0).toFixed(2)}
          onSaveReport={handleSaveReport}
        />

        <AppFooter />
      </div>

      <SaveModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={handleSave} />
    </div>
  )
}
