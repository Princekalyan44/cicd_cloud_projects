/**
 * Health Check API Route
 * Used by Kubernetes liveness and readiness probes
 */

import { NextResponse } from 'next/server'

// GET /api/health
// Returns 200 OK if the application is healthy
export async function GET() {
  // In a real application, you might check:
  // - Database connectivity
  // - External API availability
  // - Memory usage
  // - Disk space
  
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // Seconds since process started
      environment: process.env.NODE_ENV,
    },
    { status: 200 }
  )
}
