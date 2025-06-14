import { NextResponse } from "next/server"

export async function POST() {
    // Mock sensor data
    const mockSensorData = {
        water_temperature: 18.5,
        light_PAR: 350,
        inorganic_nitrogen: 1.2,
        total_phosphorus: 0.15,
        secchi_depth: 6.5,
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(mockSensorData)
} 