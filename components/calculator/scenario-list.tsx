"use client"

import type { Scenario } from "@/lib/calculator"

interface ScenarioListProps {
  scenarios: Scenario[]
  onRemove: (id: number) => void
  totalCO2: string
  onSaveReport?: () => void
}

export function ScenarioList({ scenarios, onRemove, totalCO2, onSaveReport }: ScenarioListProps) {
  if (scenarios.length === 0) return null

  const totalKg = scenarios.reduce((sum, s) => sum + s.co2Tonnes * 1000, 0)

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4" style={{ borderColor: "#003c46" }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: "#003c46" }}>
          2. Added Scenarios ({scenarios.length})
        </h2>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg font-bold text-white shadow-md" style={{ backgroundColor: "#003c46" }}>
            Total CO₂e: {totalKg.toFixed(2)} kg
          </div>
          {onSaveReport && (
            <button
              onClick={onSaveReport}
              className="px-4 py-2 rounded-lg font-bold text-white shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: "#6bb6c4" }}
            >
              Save Report to Profile
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            className="p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all hover:shadow-md"
            style={{ borderColor: "#ffbe0b", backgroundColor: "#fffbeb" }}
          >
            <div className="mb-2 sm:mb-0">
              <p className="font-bold text-lg" style={{ color: "#b45309" }}>
                {index + 1}. {scenario.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                CO₂e Footprint:{" "}
                <span className="font-semibold" style={{ color: "#003c46" }}>
                  {(scenario.co2Tonnes * 1000).toFixed(2)} kg
                </span>
                <span className="mx-2 text-gray-400">|</span>
                Car Equivalent: {scenario.milesEquivalent.toLocaleString()} miles
              </p>
            </div>
            <button
              onClick={() => onRemove(scenario.id)}
              className="px-3 py-1 text-xs font-semibold rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#ff4444", color: "white" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
