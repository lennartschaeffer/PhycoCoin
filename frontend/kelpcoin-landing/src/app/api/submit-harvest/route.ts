import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
    try {
        const { harvestData } = await request.json()

        if (!harvestData) {
            return NextResponse.json(
                { error: 'Missing harvest data' },
                { status: 400 }
            )
        }

        // Add submission timestamp
        harvestData.submittedAt = new Date().toISOString()

        // Read existing harvests
        const harvestsPath = join(process.cwd(), 'src', 'app', 'data', 'harvests.json')
        let harvests = []

        try {
            const existingData = await readFile(harvestsPath, 'utf-8')
            harvests = JSON.parse(existingData)
        } catch (error) {
            // File doesn't exist or is empty, start with empty array
        }

        // Add new harvest
        harvests.push(harvestData)

        // Save updated harvests
        await writeFile(harvestsPath, JSON.stringify(harvests, null, 2))

        return NextResponse.json({
            success: true,
            message: 'Harvest submitted successfully',
            harvestData
        })

    } catch (error: any) {
        console.error('Error submitting harvest:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to submit harvest' },
            { status: 500 }
        )
    }
} 