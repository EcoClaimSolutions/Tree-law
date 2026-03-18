// Export utilities for generating printable reports and PDFs

import { type PropertyInfo, type TreeInfo, type Scenario, FACTORS } from "./calculator"
import jsPDF from "jspdf"

export function exportToPrint(propertyInfo: PropertyInfo, treeInfo: TreeInfo, scenarios: Scenario[]) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const totalCO2 = scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0).toFixed(2)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tree Subsidence Carbon Calculator Report</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Inter', Arial, sans-serif;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { color: #003c46; font-size: 28px; margin-bottom: 10px; }
    h2 { color: #003c46; font-size: 22px; margin-top: 30px; margin-bottom: 15px; }
    h3 { color: #003c46; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
    .header { border-bottom: 3px solid #003c46; padding-bottom: 10px; margin-bottom: 30px; }
    .summary { background: #e3fff9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #003c46; }
    .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
    .card { background: #e3fff9; padding: 15px; border-radius: 8px; }
    .card h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; color: #666; }
    .card p { margin: 5px 0; color: #003c46; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
    th { background: #003c46; color: white; font-weight: 600; }
    tr:nth-child(even) { background: #f9f9f9; }
    .references { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .references li { margin-bottom: 10px; }
    .print-btn { background: #003c46; color: white; border: none; padding: 12px 24px; font-size: 16px; cursor: pointer; border-radius: 8px; margin-bottom: 20px; }
    .print-btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Print Report</button>
  
  <div class="header">
    <h1>Tree Subsidence Carbon Calculator Report</h1>
    <p style="color: #666;">Generated on ${new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>

  <div class="summary">
    <h2>Executive Summary</h2>
    <p>This analysis evaluates the environmental impact of various tree subsidence remediation options. The total cumulative carbon footprint for the proposed solutions is <strong>${totalCO2} tonnes of CO₂e</strong>. Adopting low-carbon intervention methods, such as Root Barrier or Resin Injection, significantly reduces the environmental cost compared to traditional construction and tree removal methods.</p>
  </div>

  <div class="card-grid">
    <div class="card">
      <h3>Property Profile</h3>
      <p>${propertyInfo.type || "N/A"}</p>
      <p style="font-size: 14px; font-weight: normal;">Damage: ${propertyInfo.damageDate || "N/A"}</p>
      <p style="font-size: 14px; font-weight: normal;">Location: ${propertyInfo.location || "N/A"}</p>
    </div>
    <div class="card">
      <h3>Tree Information</h3>
      <p>${treeInfo.species.join(", ") || "N/A"}</p>
      <p style="font-size: 14px; font-weight: normal;">Diameter: ${treeInfo.diameter} cm | Height: ${treeInfo.height} m</p>
    </div>
    <div class="card">
      <h3>Ownership / Protection</h3>
      <p>${treeInfo.ownership || "N/A"}</p>
      <p style="font-size: 14px; font-weight: normal;">TPO: ${treeInfo.tpo || "None"}</p>
    </div>
  </div>

  <h2>Remedial Solution Carbon Footprint</h2>
  
  <h3>Solution Comparison</h3>
  <table>
    <thead>
      <tr>
        <th>Solution Type</th>
        <th style="text-align: center;">CO₂e (tonnes)</th>
        <th style="text-align: center;">Car Equivalent (miles)</th>
        <th style="text-align: center;">Trees to Plant</th>
        <th style="text-align: center;">Est. Remediation Cost</th>
      </tr>
    </thead>
    <tbody>
      ${scenarios
        .map(
          (scenario) => `
        <tr>
          <td style="color: ${scenario.color}; font-weight: 600;">${scenario.name}</td>
          <td style="text-align: center;">${scenario.co2Tonnes}</td>
          <td style="text-align: center;">${scenario.milesEquivalent.toLocaleString()}</td>
          <td style="text-align: center;">${scenario.treesToPlant.toLocaleString()}</td>
          <td style="text-align: center; color: #4CAF50;">£${(scenario.co2Tonnes * FACTORS.REMEDIATION_COST_MULTIPLIER).toLocaleString()}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <h3>Carbon Offset Options</h3>
  <table>
    <thead>
      <tr>
        <th>Solution Type</th>
        <th style="text-align: center;">Afforestation Cost</th>
        <th style="text-align: center;">Blue Carbon Cost</th>
        <th style="text-align: center;">% of Claim Cost</th>
      </tr>
    </thead>
    <tbody>
      ${scenarios
        .map(
          (scenario) => `
        <tr>
          <td style="color: ${scenario.color}; font-weight: 600;">${scenario.name}</td>
          <td style="text-align: center;">£${scenario.offsetCostAfforestation.toLocaleString()}</td>
          <td style="text-align: center;">£${scenario.offsetCostBlueCarbon.toLocaleString()}</td>
          <td style="text-align: center;">${scenario.percentOfClaimCost}%</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="references">
    <h3>References and Emission Factors</h3>
    <ul>
      <li><strong>Concrete Emissions:</strong> Based on UK industry averages for C30/37 concrete, approximately 0.4 tonnes CO₂e per cubic meter. (Source: UK Government GHG Conversion Factors)</li>
      <li><strong>Steel Emissions:</strong> Based on global industry averages for recycled and primary steel production, approximately 2.5 tonnes CO₂e per tonne of finished steel. (Source: World Steel Association)</li>
      <li><strong>Lost Sequestration:</strong> Simplified factor of 0.02 tonnes CO₂e per year per tree, representing an average mature urban tree's annual carbon uptake rate. (Source: Arboricultural Journal, 2021)</li>
      <li><strong>Plastic Barrier Material:</strong> Estimation based on HDPE production, incorporating raw material extraction and manufacturing process emissions.</li>
      <li><strong>Resin Injection Material:</strong> Estimated at 0.003 tonnes CO₂e per kg of resin, based on polyurethane resin production lifecycle.</li>
      <li><strong>Carbon Offset Costs:</strong> Afforestation (£32/tonne) and Blue Carbon (£53/tonne) are representative market averages for high-quality, verifiable offset schemes. (Source: Voluntary Carbon Market Index, Q4 2023)</li>
    </ul>
  </div>
</body>
</html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

export function exportToPDF(propertyInfo: PropertyInfo, treeInfo: TreeInfo, scenarios: Scenario[]) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPosition = margin

  const logoImg = new window.Image()
  logoImg.crossOrigin = "anonymous"
  logoImg.src = "/tree-law-logo.jpg"

  logoImg.onload = () => {
    // Add logo at top left
    doc.addImage(logoImg, "JPEG", margin, yPosition, 40, 13)
    generateRestOfPDF()
  }

  logoImg.onerror = () => {
    console.error("[v0] Failed to load logo")
    generateRestOfPDF()
  }

  const generateRestOfPDF = () => {
    yPosition += 20

    // Header
    doc.setFontSize(18)
    doc.setTextColor(0, 60, 70)
    doc.text("Tree Subsidence Carbon Calculator Report", margin, yPosition)
    yPosition += 6

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}`,
      margin,
      yPosition,
    )
    yPosition += 12

    // Executive Summary
    doc.setFontSize(12)
    doc.setTextColor(0, 60, 70)
    doc.text("Executive Summary", margin, yPosition)
    yPosition += 6

    const totalCO2Kg = scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0) * 1000
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    const summaryText = `This analysis evaluates the environmental impact of various tree subsidence remediation options. The total cumulative carbon footprint for the proposed solutions is ${totalCO2Kg.toFixed(2)} kg of CO₂e. Adopting low-carbon intervention methods significantly reduces environmental costs.`
    const splitSummary = doc.splitTextToSize(summaryText, maxWidth)
    doc.text(splitSummary, margin, yPosition)
    yPosition += splitSummary.length * 4 + 8

    // Tree Parameters
    doc.setFontSize(11)
    doc.setTextColor(0, 60, 70)
    doc.text("1. Tree Parameters", margin, yPosition)
    yPosition += 6

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)

    const params = [
      `Quantity of trees: ${treeInfo.quantity || "N/A"}`,
      `Species: ${treeInfo.species.join(", ") || "N/A"}`,
      `Diameter at breast height: ${treeInfo.diameter} cm`,
      `Height: ${treeInfo.height} m`,
      `Date Damage Noticed: ${treeInfo.damageDate || "N/A"}`,
      `Postal Code: ${treeInfo.postalCode || "N/A"}`,
      `Tree Ownership: ${treeInfo.ownership || "N/A"}`,
      `Claim Reference: ${treeInfo.claimReference || "N/A"}`,
    ]

    params.forEach((param) => {
      const lines = doc.splitTextToSize(param, maxWidth)
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * 5
    })

    yPosition += 8

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = margin
    }

    // Solution Comparison Table
    doc.setFontSize(11)
    doc.setTextColor(0, 60, 70)
    doc.text("Solution Comparison", margin, yPosition)
    yPosition += 6

    // Table header
    doc.setFillColor(0, 60, 70)
    doc.rect(margin, yPosition, maxWidth, 7, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text("Solution", margin + 2, yPosition + 4.5)
    doc.text("CO₂e (kg)", margin + 50, yPosition + 4.5)
    doc.text("Trees", margin + 85, yPosition + 4.5)
    doc.text("Cost", margin + 115, yPosition + 4.5)
    yPosition += 7

    // Table rows
    doc.setTextColor(0, 0, 0)
    scenarios.forEach((scenario, idx) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }

      if (idx % 2 === 0) {
        doc.setFillColor(249, 249, 249)
        doc.rect(margin, yPosition, maxWidth, 6, "F")
      }

      doc.setFontSize(8)
      const scenarioName = scenario.name.length > 18 ? scenario.name.substring(0, 16) + "..." : scenario.name
      doc.text(scenarioName, margin + 2, yPosition + 4)
      doc.text((scenario.co2Tonnes * 1000).toFixed(1), margin + 50, yPosition + 4)
      doc.text(Math.round(scenario.treesToPlant).toString(), margin + 85, yPosition + 4)
      doc.text(`£${(scenario.co2Tonnes * FACTORS.REMEDIATION_COST_MULTIPLIER).toFixed(0)}`, margin + 115, yPosition + 4)
      yPosition += 6
    })

    yPosition += 10

    // Carbon Offset
    if (yPosition > pageHeight - 25) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(11)
    doc.setTextColor(0, 60, 70)
    doc.text("Carbon Offset Options", margin, yPosition)
    yPosition += 6

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total Emissions: ${totalCO2Kg.toFixed(2)} kg CO₂e`, margin, yPosition)
    yPosition += 5
    doc.setTextColor(0, 100, 200)
    doc.textWithLink("Buy Credits", margin, yPosition, {
      url: "https://ecoclaim.ca/waste-diversion-tools#carbon-credits",
    })

    // Footer on all pages
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)

      const footerText = "Powered by "
      const linkText = "EcoClaim"
      const footerWidth = doc.getTextWidth(footerText)
      const linkWidth = doc.getTextWidth(linkText)
      const totalWidth = footerWidth + linkWidth
      const startX = (pageWidth - totalWidth) / 2

      doc.text(footerText, startX, pageHeight - 10)
      doc.setTextColor(0, 100, 200)
      doc.textWithLink(linkText, startX + footerWidth, pageHeight - 10, { url: "https://www.ecoclaim.ca" })
    }

    // Save PDF
    doc.save(`tree-subsidence-report-${Date.now()}.pdf`)
  }
}

export function exportToJSON(
  propertyInfo: PropertyInfo,
  treeInfo: TreeInfo,
  scenarios: Scenario[],
  calculationName: string,
) {
  const data = {
    name: calculationName,
    exportDate: new Date().toISOString(),
    propertyInfo,
    treeInfo,
    scenarios,
    totalCO2: scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0).toFixed(2),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `tree-subsidence-calc-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
