// LocalStorage utilities for saving and loading calculations

import type { SavedCalculation } from "./calculator"

const STORAGE_KEY = "tree_subsidence_calculations"

export function saveCalculation(calculation: Omit<SavedCalculation, "id" | "timestamp">): string {
  const calculations = getAllCalculations()

  const newCalculation: SavedCalculation = {
    ...calculation,
    id: Date.now().toString(),
    timestamp: Date.now(),
  }

  calculations.push(newCalculation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations))

  return newCalculation.id
}

export function getAllCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getCalculation(id: string): SavedCalculation | null {
  const calculations = getAllCalculations()
  return calculations.find((calc) => calc.id === id) || null
}

export function deleteCalculation(id: string): void {
  const calculations = getAllCalculations()
  const filtered = calculations.filter((calc) => calc.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function updateCalculation(id: string, updates: Partial<SavedCalculation>): void {
  const calculations = getAllCalculations()
  const index = calculations.findIndex((calc) => calc.id === id)

  if (index !== -1) {
    calculations[index] = { ...calculations[index], ...updates, timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations))
  }
}
