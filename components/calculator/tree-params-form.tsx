"use client"

import type React from "react"

import type { TreeInfo } from "@/lib/calculator"

const TREE_SPECIES = [
  "Laurel",
  "Apple",
  "Hawthorn",
  "Magnolia",
  "Cherry",
  "Pear",
  "Whitebeam",
  "Laburnum",
  "Damson",
  "Plum",
  "Holly",
  "Yew",
  "Cypress",
  "Poplar",
  "Willow",
  "False Acacia",
  "London Plane",
  "Birch",
  "Pine",
  "Maple",
  "Lime",
  "Ash",
  "Spruce",
  "Elm",
  "Walnut",
  "Horse Chestnut",
  "Beech",
  "Oak",
  "Sycamore",
  "Hornbeam",
]

interface TreeParamsFormProps {
  treeInfo: TreeInfo
  onChange: (updates: Partial<TreeInfo>) => void
}

export function TreeParamsForm({ treeInfo, onChange }: TreeParamsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const numericValue = type === "number" ? (value === "" ? "" : Number.parseFloat(value)) : value
    onChange({ [name]: numericValue as any })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4" style={{ borderColor: "#00d4aa" }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: "#003c46" }}>
        1. Tree Parameters
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Quantity of trees:</span>
            <input
              type="number"
              name="quantity"
              value={treeInfo.quantity}
              onChange={handleChange}
              step="1"
              min="1"
              required
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Species:</span>
            <select
              name="species"
              value={treeInfo.species}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46] bg-white"
            >
              <option value="">Select species...</option>
              {TREE_SPECIES.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Diameter at breast height (cm):</span>
            <input
              type="number"
              name="diameter"
              value={treeInfo.diameter}
              onChange={handleChange}
              step="0.1"
              required
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Height (m):</span>
            <input
              type="number"
              name="height"
              value={treeInfo.height}
              onChange={handleChange}
              step="0.1"
              required
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Date Damage noticed:</span>
            <input
              type="date"
              name="damageDate"
              value={treeInfo.damageDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Postal Code:</span>
            <input
              type="text"
              name="postalCode"
              value={treeInfo.postalCode}
              onChange={handleChange}
              placeholder="e.g. SW1A 1AA"
              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-gray-700">Tree Ownership:</span>
          <input
            type="text"
            name="ownership"
            value={treeInfo.ownership}
            onChange={handleChange}
            placeholder="e.g. Council, Neighbour, Homeowner"
            className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">Claim Reference:</span>
          <input
            type="text"
            name="claimReference"
            value={treeInfo.claimReference}
            onChange={handleChange}
            placeholder="e.g. CLM-2024-001"
            className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46]"
          />
        </label>
      </div>
    </div>
  )
}
