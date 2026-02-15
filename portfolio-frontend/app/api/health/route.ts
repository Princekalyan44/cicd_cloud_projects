/**
 * Health Check API Route
 * Used by Docker healthcheck and monitoring systems
 * Returns 200 OK if the application is running
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // Return success response with basic system info
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
