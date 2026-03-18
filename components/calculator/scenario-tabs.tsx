"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  type ScenarioType,
  SCENARIOS_META,
  initialScenarioData,
  calculateSingleScenario,
  type Scenario,
  type TreeInfo,
} from "@/lib/calculator"

interface ScenarioTabsProps {
  onAddScenario: (scenario: Scenario) => void
  treeInfo: TreeInfo
}

export function ScenarioTabs({ onAddScenario, treeInfo }: ScenarioTabsProps) {
  const [activeTab, setActiveTab] = useState<ScenarioType>("felling")
  const [currentScenarioData, setCurrentScenarioData] = useState<any>(initialScenarioData.felling)

  const currentSubtotal = useMemo(() => {
    return calculateSingleScenario(activeTab, currentScenarioData, {
      diameter: treeInfo.diameter,
      height: treeInfo.height,
      quantity: treeInfo.quantity,
    })
  }, [activeTab, currentScenarioData, treeInfo.diameter, treeInfo.height, treeInfo.quantity])

  const handleTabChange = (newTab: ScenarioType) => {
    setActiveTab(newTab)
    setCurrentScenarioData(initialScenarioData[newTab])
  }

  const handleScenarioDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (type === "number") {
      const numValue = value === "" ? "" : Number.parseFloat(value)
      // Prevent negative values
      if (typeof numValue === "number" && numValue < 0) return
      setCurrentScenarioData((prev: any) => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      setCurrentScenarioData((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const addScenario = () => {
    const newScenario: Scenario = {
      id: Date.now(),
      type: activeTab,
      name: SCENARIOS_META[activeTab].name,
      color: SCENARIOS_META[activeTab].color,
      data: { ...currentScenarioData },
      ...currentSubtotal,
    }

    onAddScenario(newScenario)
    setCurrentScenarioData(initialScenarioData[activeTab])
  }

  const tabButtonClass = "px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200"

  return (
    <div className="bg-white rounded-xl shadow-2xl border-t-4" style={{ borderColor: SCENARIOS_META[activeTab].color }}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {(Object.keys(SCENARIOS_META) as ScenarioType[]).map((key) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`${tabButtonClass} ${activeTab === key ? "tab-active" : "text-gray-500 hover:text-[#003c46]"}`}
            style={activeTab === key ? { borderBottom: `3px solid ${SCENARIOS_META[key].color}` } : {}}
          >
            {SCENARIOS_META[key].name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="space-y-4">
          {activeTab === "felling" && (
            <>
              <label className="block">
                <span className="text-sm text-gray-700">Concrete volume (m³):</span>
                <input
                  type="number"
                  name="sc_concrete"
                  value={currentScenarioData.sc_concrete ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Steel (tonnes):</span>
                <input
                  type="number"
                  name="sc_steel"
                  value={currentScenarioData.sc_steel ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Years of lost sequestration:</span>
                <input
                  type="number"
                  name="lost_years"
                  value={currentScenarioData.lost_years ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm text-gray-700">Site visit travel (miles):</span>
                <input
                  type="number"
                  name="site_visit_miles"
                  value={currentScenarioData.site_visit_miles ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  placeholder="Total miles travelled for site visits"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
            </>
          )}

          {activeTab === "underpinning" && (
            <>
              <label className="block">
                <span className="text-sm text-gray-700">Length (m):</span>
                <input
                  type="number"
                  name="up_length"
                  value={currentScenarioData.up_length ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Width (m):</span>
                <input
                  type="number"
                  name="up_width"
                  value={currentScenarioData.up_width ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Depth (m):</span>
                <input
                  type="number"
                  name="up_depth"
                  value={currentScenarioData.up_depth ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Steel (tonnes):</span>
                <input
                  type="number"
                  name="up_steel"
                  value={currentScenarioData.up_steel ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm text-gray-700">Site visit travel (miles):</span>
                <input
                  type="number"
                  name="site_visit_miles"
                  value={currentScenarioData.site_visit_miles ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  placeholder="Total miles travelled for site visits"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
            </>
          )}

          {activeTab === "barrier" && (
            <>
              <label className="block">
                <span className="text-sm text-gray-700">Length (m):</span>
                <input
                  type="number"
                  name="barrier_length"
                  value={currentScenarioData.barrier_length ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Depth (m):</span>
                <input
                  type="number"
                  name="barrier_depth"
                  value={currentScenarioData.barrier_depth ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Thickness (mm):</span>
                <input
                  type="number"
                  name="barrier_thickness"
                  value={currentScenarioData.barrier_thickness ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm text-gray-700">Site visit travel (miles):</span>
                <input
                  type="number"
                  name="site_visit_miles"
                  value={currentScenarioData.site_visit_miles ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  placeholder="Total miles travelled for site visits"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
            </>
          )}

          {activeTab === "resin" && (
            <>
              <label className="block">
                <span className="text-sm text-gray-700">Length (m):</span>
                <input
                  type="number"
                  name="resin_length"
                  value={currentScenarioData.resin_length ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Injection spacing (m):</span>
                <input
                  type="number"
                  name="resin_spacing"
                  value={currentScenarioData.resin_spacing ?? ""}
                  onChange={handleScenarioDataChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Resin per point (kg):</span>
                <input
                  type="number"
                  name="resin_per_point"
                  value={currentScenarioData.resin_per_point ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
              <label className="block border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm text-gray-700">Site visit travel (miles):</span>
                <input
                  type="number"
                  name="site_visit_miles"
                  value={currentScenarioData.site_visit_miles ?? ""}
                  onChange={handleScenarioDataChange}
                  step="1"
                  min="0"
                  placeholder="Total miles travelled for site visits"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
                />
              </label>
            </>
          )}
        </div>

        <div
          className="mt-4 p-4 rounded-lg border-2"
          style={{
            backgroundColor: `${SCENARIOS_META[activeTab].color}15`,
            borderColor: SCENARIOS_META[activeTab].color,
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Estimated CO₂e:</span>
            <span className="text-2xl font-bold" style={{ color: "#003c46" }}>
              {(currentSubtotal.co2Tonnes * 1000).toFixed(2)} kg
            </span>
          </div>
        </div>

        <button
          onClick={addScenario}
          className="mt-6 w-full px-10 py-3 text-white font-bold rounded-lg transition-all hover:scale-[1.02] shadow-xl"
          style={{ backgroundColor: "#4CAF50" }}
        >
          Add "{SCENARIOS_META[activeTab].name}" Scenario ({(currentSubtotal.co2Tonnes * 1000).toFixed(2)} kg CO₂e)
        </button>
      </div>
    </div>
  )
}
