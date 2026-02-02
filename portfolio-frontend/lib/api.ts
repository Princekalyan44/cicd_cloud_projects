/**
 * API Client Library
 * Centralized functions for making API calls to backend services
 * Includes error handling and type safety
 */

import axios, { AxiosError } from 'axios'

// Base configuration for API client
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:8080',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log errors to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message)
    }
    return Promise.reject(error)
  }
)

// Type definitions
export interface ChatMessage {
  message: string
  sessionId: string
}

export interface ChatResponse {
  response: string
  sources?: string[]
  timestamp: string
}

/**
 * Send a message to the chatbot
 * @param message - User's message
 * @param sessionId - Unique session identifier
 * @returns Bot's response
 */
export async function sendChatMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  try {
    const response = await apiClient.post<ChatResponse>('/chat', {
      message,
      sessionId,
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to send message to chatbot')
  }
}

/**
 * Check health of chatbot service
 * @returns Health status
 */
export async function checkChatbotHealth(): Promise<{ status: string }> {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Chatbot service is unavailable')
  }
}

export default apiClient
