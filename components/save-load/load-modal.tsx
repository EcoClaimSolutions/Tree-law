"use client"

import type React from "react"

import type { SavedCalculation } from "@/lib/calculator"
import { getAllCalculations, deleteCalculation } from "@/lib/storage"
import { useState, useEffect } from "react"

interface LoadModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (calculation: SavedCalculation) => void
}

export function LoadModal({ isOpen, onClose, onLoad }: LoadModalProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])

  useEffect(() => {
    if (isOpen) {
      setCalculations(getAllCalculations())
    }
  }, [isOpen])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this calculation?")) {
      deleteCalculation(id)
      setCalculations(getAllCalculations())
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold" style={{ color: "#003c46" }}>
            Load Saved Calculation
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>

        {calculations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved calculations found.</p>
        ) : (
          <div className="space-y-3">
            {calculations
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((calc) => (
                <div
                  key={calc.id}
                  onClick={() => onLoad(calc)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-[#003c46] hover:bg-gray-50 cursor-pointer transition-all flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg" style={{ color: "#003c46" }}>
                      {calc.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {calc.scenarios.length} scenarios • Total CO₂e:{" "}
                      {calc.scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0).toFixed(2)} tonnes
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Saved: {new Date(calc.timestamp).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(calc.id, e)}
                    className="ml-4 px-3 py-1 text-xs font-semibold rounded-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: "#ff4444", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-2 font-semibold rounded-lg border-2 transition-all hover:bg-gray-100"
          style={{ borderColor: "#003c46", color: "#003c46" }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
