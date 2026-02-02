/**
 * API Client Library
 * Centralized functions for making API calls to backend services
 */

import { CHATBOT_CONFIG } from './constants'

// Chat API types
interface ChatRequest {
  message: string
  sessionId: string
}

interface ChatResponse {
  response: string
  sources?: string[]
  timestamp: string
}

/**
 * Send a message to the chatbot API
 * @param message - User's question
 * @param sessionId - Unique session identifier
 * @returns Chatbot response
 */
export async function sendChatMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${CHATBOT_CONFIG.apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      } as ChatRequest),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    return data
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
}

/**
 * Check health of backend services
 * Useful for monitoring and status pages
 */
export async function checkHealth(): Promise<{
  frontend: boolean
  chatbot: boolean
}> {
  const health = {
    frontend: true, // If this runs, frontend is healthy
    chatbot: false,
  }

  try {
    // Check chatbot service health
    const response = await fetch(`${CHATBOT_CONFIG.apiUrl}/health`, {
      method: 'GET',
    })
    health.chatbot = response.ok
  } catch (error) {
    console.error('Health check failed:', error)
  }

  return health
}

/**
 * Contact form submission
 * In production, this would send to an email service or backend API
 * @param formData - Contact form data
 */
export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  try {
    // TODO: Implement actual email sending
    // Options:
    // 1. AWS SES (Simple Email Service)
    // 2. SendGrid
    // 3. Formspree
    // 4. Your own backend API

    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Contact form submitted:', formData)

    return {
      success: true,
      message: 'Message sent successfully!',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
    }
  }
}
