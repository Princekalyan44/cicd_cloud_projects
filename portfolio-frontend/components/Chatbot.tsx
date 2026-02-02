/**
 * Chatbot Widget Component
 * Floating AI chatbot that answers questions about your background
 * Communicates with backend chatbot service via API
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader } from 'lucide-react'
import { CHATBOT_CONFIG } from '@/lib/constants'

// Message type definition
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chatbot() {
  // Widget open/closed state
  const [isOpen, setIsOpen] = useState(false)
  
  // Chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Kalyan's AI assistant. Ask me anything about his experience, skills, or projects!",
      timestamp: new Date(),
    },
  ])
  
  // Current input text
  const [input, setInput] = useState('')
  
  // Loading state when waiting for response
  const [isLoading, setIsLoading] = useState(false)
  
  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call chatbot API
      // In production, this calls your backend chatbot service
      const response = await fetch(`${CHATBOT_CONFIG.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: 'web-' + Date.now(), // Simple session ID
        }),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      
      // Show error message in chat
      // For development, show fallback responses
      const fallbackResponse = getFallbackResponse(input)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback responses for development (before chatbot API is deployed)
  const getFallbackResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('experience') || q.includes('work')) {
      return "I have 3.5+ years of DevOps experience at Justdial Ltd., where I managed Kubernetes clusters, implemented CI/CD pipelines, and automated infrastructure with Terraform. I've worked extensively with AWS, Docker, and monitoring tools like Prometheus and Grafana."
    }
    
    if (q.includes('skills') || q.includes('technology') || q.includes('tech')) {
      return "My core skills include: Cloud (AWS, EKS), Containers (Docker, Kubernetes), CI/CD (Jenkins, GitLab, GitHub Actions), IaC (Terraform), Monitoring (Prometheus, Grafana), and Linux/RHEL administration. I'm also certified as an AWS Solutions Architect."
    }
    
    if (q.includes('project')) {
      return "My featured project is this enterprise CI/CD pipeline on AWS EKS! It includes a portfolio website with AI chatbot (powered by RAG), GitOps with ArgoCD, Istio service mesh, Vault for secrets, and complete observability with Prometheus and Grafana. It showcases modern DevOps practices."
    }
    
    if (q.includes('contact') || q.includes('hire') || q.includes('available')) {
      return "I'm currently open to DevOps opportunities! You can reach me via the contact form on this page, or connect with me on LinkedIn and GitHub. I'm based in Bangalore, India."
    }
    
    if (q.includes('kubernetes') || q.includes('k8s')) {
      return "I have extensive Kubernetes experience, managing 50+ microservices in production at Justdial. I work with EKS, Helm, service meshes, and am preparing for my CKA certification. I've handled cluster scaling, monitoring, and troubleshooting."
    }
    
    if (q.includes('aws') || q.includes('cloud')) {
      return "I'm AWS certified (Solutions Architect) with hands-on experience in EKS, EC2, S3, RDS, Lambda, and more. I've managed 100+ AWS resources using Terraform and implemented secure, scalable cloud architectures."
    }
    
    return "That's a great question! While my AI backend is being deployed, you can explore the Skills, Experience, and Projects sections above for detailed information. Or feel free to ask about my DevOps experience, technical skills, or projects!"
  }

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass rounded-lg shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="bg-primary-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-sm text-primary-100">Ask me anything!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-600 p-1 rounded"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-dark-text'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-dark-card px-4 py-2 rounded-lg flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-dark-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-border disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-dark-muted mt-2">
              Powered by AI • Responses may vary
            </p>
          </div>
        </div>
      )}
    </>
  )
}
