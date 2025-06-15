import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    try {
        const harvestsPath = join(process.cwd(), 'src', 'app', 'data', 'harvests.json')
        const data = await readFile(harvestsPath, 'utf-8')
        const harvests = JSON.parse(data)

        return NextResponse.json(harvests)
    } catch (error: any) {
        console.error('Error reading harvests:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to read harvests' },
            { status: 500 }
        )
    }
} 