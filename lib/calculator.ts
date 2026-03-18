// Calculation engine and constants for Tree Subsidence Carbon Calculator

export interface EmissionFactors {
  CONCRETE: number
  STEEL: number
  LOST_SEQUESTRATION_PER_YEAR: number
  PLASTIC_PER_M3: number
  RESIN_PER_KG: number
  MILES_PER_TONNE: number
  TREES_PER_TONNE: number
  AFFORESTATION_COST_PER_TONNE: number
  BLUE_CARBON_COST_PER_TONNE: number
  REMEDIATION_COST_MULTIPLIER: number
  TRAVEL_KG_CO2_PER_KM: number
}

export const FACTORS: EmissionFactors = {
  CONCRETE: 0.4, // tonnes CO2 / m³
  STEEL: 2.5, // tonnes CO2 / tonne
  LOST_SEQUESTRATION_PER_YEAR: 0.02, // tonnes CO2 / year
  PLASTIC_PER_M3: 1.5, // tonnes CO2e / m³ for barrier material
  RESIN_PER_KG: 0.003, // tonnes CO2 / kg resin
  MILES_PER_TONNE: 3500, // Miles driven equivalent per tonne CO2
  TREES_PER_TONNE: 12, // Trees needed to offset per tonne CO2
  AFFORESTATION_COST_PER_TONNE: 32, // £32 per tonne
  BLUE_CARBON_COST_PER_TONNE: 53, // £53 per tonne
  REMEDIATION_COST_MULTIPLIER: 25000,
  TRAVEL_KG_CO2_PER_KM: 0.27841,
}

export const MILES_TO_KM = 1.60934

export function calculateTreeCarbonStorage(diameterInches: number, heightFeet: number, quantity: number): number {
  // This formula already includes above and below ground biomass
  const kgCO2 = 0.0001257 * Math.pow(diameterInches, 2) * heightFeet
  // Convert to tonnes and multiply by quantity
  return (kgCO2 / 1000) * quantity
}

export const SCENARIOS_META = {
  felling: { name: "Felling & repair", color: "#003c46" },
  underpinning: { name: "Underpinning", color: "#6bb6c4" },
  barrier: { name: "Root barrier", color: "#9bfee9" },
  resin: { name: "Resin injection", color: "#ffbe0b" },
}

export type ScenarioType = keyof typeof SCENARIOS_META

export interface FellingData {
  sc_concrete: number
  sc_steel: number
  lost_years: number
  site_visit_miles: number
}

export interface UnderpinningData {
  up_length: number
  up_width: number
  up_depth: number
  up_steel: number
  site_visit_miles: number
}

export interface BarrierData {
  barrier_length: number
  barrier_depth: number
  barrier_thickness: number
  site_visit_miles: number
}

export interface ResinData {
  resin_length: number
  resin_spacing: number
  resin_per_point: number
  site_visit_miles: number
}

export type ScenarioData = FellingData | UnderpinningData | BarrierData | ResinData

export interface CalculationResult {
  co2Tonnes: number
  milesEquivalent: number
  treesToPlant: number
  offsetCostAfforestation: number
  offsetCostBlueCarbon: number
  percentOfClaimCost: number
}

export const initialScenarioData = {
  felling: { sc_concrete: 5, sc_steel: 0.2, lost_years: 20, site_visit_miles: 0 },
  underpinning: { up_length: 5, up_width: 0.6, up_depth: 0.9, up_steel: 0.1, site_visit_miles: 0 },
  barrier: { barrier_length: 10, barrier_depth: 1, barrier_thickness: 1, site_visit_miles: 0 },
  resin: { resin_length: 10, resin_spacing: 1, resin_per_point: 5, site_visit_miles: 0 },
}

export function calculateSingleScenario(
  type: ScenarioType,
  data: any,
  treeInfo?: { diameter: number; height: number; quantity: number },
): CalculationResult {
  let co2Tonnes = 0

  const travelMiles = Number(data.site_visit_miles) || 0
  const travelKm = travelMiles * MILES_TO_KM
  const travelEmissions = (travelKm * FACTORS.TRAVEL_KG_CO2_PER_KM) / 1000 // convert kg to tonnes

  if (type === "felling") {
    const concreteEmissions = Number(data.sc_concrete) || 0
    const steelEmissions = Number(data.sc_steel) || 0
    const lostYears = Number(data.lost_years) || 0

    let treeCarbonRelease = 0
    const quantity = treeInfo ? Number(treeInfo.quantity) || 0 : 0

    if (treeInfo) {
      const diameter = Number(treeInfo.diameter) || 0
      const height = Number(treeInfo.height) || 0

      // Only calculate if we have valid tree dimensions and quantity
      if (diameter > 0 && height > 0 && quantity > 0) {
        treeCarbonRelease = calculateTreeCarbonStorage(diameter, height, quantity)
      }
    }

    const lostSequestration = lostYears * FACTORS.LOST_SEQUESTRATION_PER_YEAR * quantity

    co2Tonnes =
      concreteEmissions * FACTORS.CONCRETE +
      steelEmissions * FACTORS.STEEL +
      lostSequestration +
      treeCarbonRelease +
      travelEmissions
  } else if (type === "underpinning") {
    const volume = (Number(data.up_length) || 0) * (Number(data.up_width) || 0) * (Number(data.up_depth) || 0)
    const concreteEmissions = volume * FACTORS.CONCRETE
    const steelEmissions = (Number(data.up_steel) || 0) * FACTORS.STEEL
    co2Tonnes = concreteEmissions + steelEmissions + travelEmissions
  } else if (type === "barrier") {
    const area = (Number(data.barrier_length) || 0) * (Number(data.barrier_depth) || 0)
    const volume = area * ((Number(data.barrier_thickness) || 0) / 1000) // mm to m
    co2Tonnes = volume * FACTORS.PLASTIC_PER_M3 + travelEmissions
  } else if (type === "resin") {
    const length = Number(data.resin_length) || 0
    const spacing = Number(data.resin_spacing) || 1
    const resinPerPoint = Number(data.resin_per_point) || 0

    if (length > 0 && spacing > 0 && resinPerPoint > 0) {
      const injectionPoints = length / spacing
      const totalResin = injectionPoints * resinPerPoint
      co2Tonnes = totalResin * FACTORS.RESIN_PER_KG + travelEmissions
    } else {
      co2Tonnes = travelEmissions
    }
  }

  return {
    co2Tonnes: co2Tonnes,
    milesEquivalent: Math.round(co2Tonnes * FACTORS.MILES_PER_TONNE),
    treesToPlant: Math.round(co2Tonnes * FACTORS.TREES_PER_TONNE),
    offsetCostAfforestation: Math.round(co2Tonnes * FACTORS.AFFORESTATION_COST_PER_TONNE),
    offsetCostBlueCarbon: Math.round(co2Tonnes * FACTORS.BLUE_CARBON_COST_PER_TONNE),
    percentOfClaimCost: type === "felling" ? 2 : type === "barrier" ? 0.5 : type === "underpinning" ? 0.45 : 0.6,
  }
}

export interface PropertyInfo {
  type: string
  damageDate: string
  location: string
}

export interface TreeInfo {
  species: string
  ownership: string
  claimReference: string
  diameter: number
  height: number
  quantity: number // Added quantity of trees field
  postalCode: string // Added postal code field
  damageDate: string // Added damage date field
}

export interface Scenario extends CalculationResult {
  id: number
  type: ScenarioType
  name: string
  color: string
  data: ScenarioData
}

export interface SavedCalculation {
  id: string
  name: string
  timestamp: number
  propertyInfo: PropertyInfo
  treeInfo: TreeInfo
  scenarios: Scenario[]
}
