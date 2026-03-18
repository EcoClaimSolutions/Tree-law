"use client"

import { useState } from "react"

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export function SaveModal({ isOpen, onClose, onSave }: SaveModalProps) {
  const [name, setName] = useState("")

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4" style={{ color: "#003c46" }}>
          Save Calculation
        </h3>
        <p className="text-sm text-gray-600 mb-4">Give this calculation a name to save it:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Oak Tree - London Project"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003c46] mb-4"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-6 py-2 font-semibold rounded-lg transition-all hover:opacity-90 shadow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#003c46", color: "white" }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2 font-semibold rounded-lg border-2 transition-all hover:bg-gray-100"
            style={{ borderColor: "#003c46", color: "#003c46" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
