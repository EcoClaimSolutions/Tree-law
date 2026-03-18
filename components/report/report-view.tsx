"use client"

import { type PropertyInfo, type TreeInfo, type Scenario, FACTORS } from "@/lib/calculator"
import { exportToPDF, exportToJSON } from "@/lib/export"
import { useState } from "react"

interface ReportViewProps {
  propertyInfo: PropertyInfo
  treeInfo: TreeInfo
  scenarios: Scenario[]
  onBack: () => void
}

export function ReportView({ propertyInfo, treeInfo, scenarios, onBack }: ReportViewProps) {
  const totalFootprintKg = (scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0) * 1000).toFixed(2)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleViewPDF = () => {
    setShowExportMenu(false)
    setTimeout(() => {
      exportToPDF(propertyInfo, treeInfo, scenarios)
    }, 100)
  }

  const handleExportJSON = () => {
    setShowExportMenu(false)
    setTimeout(() => {
      const name = prompt("Enter export name (optional):")
      if (name !== null) {
        exportToJSON(propertyInfo, treeInfo, scenarios, name.trim() || "Tree Subsidence Calculation")
      }
    }, 100)
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "#9bfee9" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header and Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold" style={{ color: "#003c46" }}>
            Carbon Footprint Analysis Report
          </h1>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-6 py-2 text-white font-semibold rounded-lg transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: "#4CAF50" }}
              >
                Export ▾
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-[9999] border-2 border-gray-300">
                  <button
                    onClick={handleViewPDF}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-t-lg transition-colors text-gray-800 font-medium border-b border-gray-200"
                  >
                    📄 View PDF
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-b-lg transition-colors text-gray-800 font-medium"
                  >
                    💾 Download JSON
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onBack}
              className="px-6 py-2 text-white font-semibold rounded-lg transition-all hover:opacity-90 shadow-md bg-[#003c46]"
            >
              ← Back to Calculator
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border-l-4 border-[#003c46]">
          <h2 className="text-xl font-bold mb-3 text-[#003c46]">Executive Summary</h2>
          <p className="text-gray-700">
            This analysis evaluates the environmental impact of various tree subsidence remediation options. The total
            cumulative carbon footprint for the proposed solutions is <strong>{totalFootprintKg} kg of CO₂e</strong>.
            Adopting low-carbon intervention methods, such as Root Barrier or Resin Injection, significantly reduces the
            environmental cost compared to traditional construction and tree removal methods, providing a quantifiable
            metric for sustainable claims management.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl p-6 shadow-xl flex items-start space-x-4" style={{ backgroundColor: "#e3fff9" }}>
            <span className="text-4xl" style={{ color: "#003c46" }}>
              🏠
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-1">Property Profile</h3>
              <p className="text-base font-semibold" style={{ color: "#003c46" }}>
                Owner: {treeInfo.ownership || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-xl flex items-start space-x-4" style={{ backgroundColor: "#e3fff9" }}>
            <span className="text-4xl" style={{ color: "#003c46" }}>
              🌳
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-1">Tree Information</h3>
              <p className="text-base font-semibold" style={{ color: "#003c46" }}>
                {treeInfo.species || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                Diameter: {treeInfo.diameter} cm | Height: {treeInfo.height} m
              </p>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-xl flex items-start space-x-4" style={{ backgroundColor: "#e3fff9" }}>
            <span className="text-4xl" style={{ color: "#003c46" }}>
              📋
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-700 mb-1">Insurance</h3>
              <p className="text-base font-semibold" style={{ color: "#003c46" }}>
                Claim Ref: {treeInfo.claimReference || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg border-t-4" style={{ borderColor: "#003c46" }}>
          <h2 className="text-2xl font-bold mb-6 text-[#003c46]">Remedial Solution Carbon Footprint, Tonnes of CO₂e</h2>

          {/* Solution Comparison Table */}
          <div className="mb-10 overflow-x-auto">
            <h3 className="text-xl font-bold mb-3 text-[#003c46]">Solution Comparison</h3>
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr style={{ backgroundColor: "#003c46", color: "white" }}>
                  <th className="p-3 text-left border border-gray-600">Solution Type</th>
                  <th className="p-3 text-center border border-gray-600">CO₂e (kg)</th>
                  <th className="p-3 text-center border border-gray-600">Trees to Plant</th>
                  <th className="p-3 text-center border border-gray-600">Est. Remediation Cost</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td
                      className="p-3 border font-semibold border-gray-300"
                      style={{ color: scenario.color || "#003c46" }}
                    >
                      {scenario.name}
                    </td>
                    <td className="p-3 border text-center border-gray-300">{(scenario.co2Tonnes * 1000).toFixed(2)}</td>
                    <td className="p-3 border text-center border-gray-300">
                      {Math.round(scenario.treesToPlant).toLocaleString()}
                    </td>
                    <td className="p-3 border text-center border-gray-300" style={{ color: "#4CAF50" }}>
                      £
                      {(scenario.co2Tonnes * FACTORS.REMEDIATION_COST_MULTIPLIER).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Carbon Credits Table */}
          <div className="overflow-x-auto">
            <h3 className="text-xl font-bold mb-3 text-[#003c46]">Carbon Offset Options</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-semibold">Total Emissions:</span>{" "}
                <span className="text-[#003c46] font-bold">{totalFootprintKg} kg CO₂e</span>
              </p>
              <a
                href="https://ecoclaim.ca/waste-diversion-tools#carbon-credits"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#003c46] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Buy Credits
              </a>
            </div>
          </div>

          {/* References Section */}
          <div id="references-section" className="mt-10 border-t pt-6 border-gray-200">
            <h3 className="text-xl font-bold mb-3 text-[#003c46]">Boundary Conditions, Footnotes & References</h3>

            {/* Boundary Conditions */}
            <div className="mb-6">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                INCLUDED (Scope 1, 2, 3 operational):
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                <li>Site visits: vehicle travel from office to property (IF paid for by the company)</li>
                <li>Monitoring visits: vehicle travel for level readings (IF paid for by the company)</li>
                <li>
                  Specialist surveys: travel for soil testing, drain surveys, arboricultural surveys, borehole drilling
                </li>
                <li>Contractor travel: days on site × miles × number of contractors</li>
                <li>Material transport: delivery of concrete, steel, HDPE, resin to site</li>
                <li>Equipment operation: excavators, drilling rigs, pumps (fuel consumption)</li>
                <li>Construction materials: embodied carbon in concrete, steel, HDPE, resin</li>
                <li>Tree removal: felling, chipping, stump grinding, waste disposal</li>
                <li>Tree carbon impacts: stored CO₂ release, lost future sequestration</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                EXCLUDED (indirect/office operations):
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                <li>Email correspondence</li>
                <li>Cloud storage and data centers</li>
                <li>Physical mail/courier services</li>
                <li>Office energy consumption</li>
                <li>Report production (printing, PDF generation)</li>
                <li>Tendering and administrative processes</li>
                <li>Telephone calls and video meetings</li>
                <li>Insurance processing overhead</li>
              </ul>
            </div>

            <div
              className="mb-6 bg-[#9bfee9] bg-opacity-30 rounded-lg p-4 border-l-4"
              style={{ borderColor: "#003c46" }}
            >
              <h4 className="font-semibold mb-2" style={{ color: "#003c46" }}>
                Key Principle:
              </h4>
              <p className="text-sm text-gray-700">
                If the company pays for the travel/activity and it's directly tied to the physical claim remediation,
                it's in scope. Office overhead is out of scope.
              </p>
            </div>

            <p className="text-sm text-gray-600 italic mb-6">
              This focuses the calculator on actionable carbon decisions about remediation methods and site operations.
            </p>

            {/* Data Sources */}
            <div className="mb-6 border-t pt-4">
              <h4 className="font-semibold mb-2" style={{ color: "#003c46" }}>
                Data Sources:
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <span className="font-medium">Travel Emissions (Large Petrol Car):</span>{" "}
                  <span className="text-gray-600">0.27841 kg CO₂e per km (0.448 kg CO₂e per mile)</span>
                  <br />
                  <a
                    href="https://assets.publishing.service.gov.uk/media/61ee74b7e90e0703805e2a40/conversion-factors-2021-full-set-advanced-users.xlsm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6bb6c4] hover:underline text-xs break-all"
                  >
                    DEFRA 2021 Conversion Factors
                  </a>
                </li>
              </ul>
            </div>

            {/* Tree Carbon Formula */}
            <div className="mb-6 border-t pt-4">
              <h4 className="font-semibold mb-2" style={{ color: "#003c46" }}>
                Tree Carbon Storage Formula:
              </h4>
              <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg font-mono">
                <p>kg CO₂ = 0.0001257 × D² × H</p>
                <p className="text-xs text-gray-500 ml-4">D = Diameter (inches), H = Height (feet)</p>
                <p className="text-xs text-gray-500 ml-4">Formula includes above and below ground biomass</p>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                Used in Felling scenario to calculate stored CO₂ released when tree is removed.
              </p>
            </div>

            {/* Emission Factors References */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2" style={{ color: "#003c46" }}>
                Emission Factors:
              </h4>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li>
                  <strong>Concrete Emissions:</strong> Based on UK industry averages for C30/37 concrete, approximately
                  0.4 tonnes CO₂e per cubic meter. (Source: UK Government GHG Conversion Factors)
                </li>
                <li>
                  <strong>Steel Emissions:</strong> Based on global industry averages for recycled and primary steel
                  production, approximately 2.5 tonnes CO₂e per tonne of finished steel. (Source: World Steel
                  Association)
                </li>
                <li>
                  <strong>Lost Sequestration:</strong> Simplified factor of 0.02 tonnes CO₂e per year per tree,
                  representing an average mature urban tree's annual carbon uptake rate. (Source: Arboricultural
                  Journal, 2021)
                </li>
                <li>
                  <strong>Plastic Barrier Material:</strong> Estimation based on HDPE production, incorporating raw
                  material extraction and manufacturing process emissions. (Source: Polymer & Carbon Research Institute)
                </li>
                <li>
                  <strong>Resin Injection Material:</strong> Estimated at 0.003 tonnes CO₂e per kg of resin, based on
                  polyurethane resin production lifecycle. (Source: Carbon Footprinting of Polyurethane Materials, 2020)
                </li>
                <li>
                  <strong>Carbon Offset Costs:</strong> Afforestation (£32/tonne) and Blue Carbon (£53/tonne) are
                  representative market averages for high-quality, verifiable offset schemes. (Source: Voluntary Carbon
                  Market Index, Q4 2023)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
