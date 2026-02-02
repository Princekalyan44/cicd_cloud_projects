/**
 * Health Check API Route
 * Used by Docker and Kubernetes to verify the application is running
 * 
 * Endpoint: GET /api/health
 * Response: { status: 'ok', timestamp: '...' }
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // Return 200 OK with health status
  return NextResponse.json(
    {
      status: 'ok',
      service: 'portfolio-frontend',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}
