import { NextResponse } from "next/server"

interface ValidateHarvestRequest {
    harvestId: string
    W_kg: number
    sensorData: {
        water_temperature: number
        light_PAR: number
        inorganic_nitrogen: number
        total_phosphorus: number
        secchi_depth: number
    }
}

export async function POST(request: Request) {
    const body: ValidateHarvestRequest = await request.json()
    const { W_kg, sensorData } = body

    // Mock validation logic
    const isValid =
        sensorData.water_temperature >= 10 &&
        sensorData.water_temperature <= 25 &&
        sensorData.light_PAR >= 200 &&
        sensorData.inorganic_nitrogen >= 0.5 &&
        sensorData.total_phosphorus >= 0.05 &&
        sensorData.secchi_depth >= 3

    // Mock nutrient removal calculations
    const nutrientRemovals = {
        N_kg: W_kg * 0.02, // 2% of wet weight
        P_kg: W_kg * 0.002, // 0.2% of wet weight
        C_kg: W_kg * 0.1, // 10% of wet weight
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
        isValid,
        message: isValid
            ? "Harvest data is within expected ranges"
            : "Harvest data shows unusual values",
        nutrientRemovals: isValid ? nutrientRemovals : undefined,
    })
} 