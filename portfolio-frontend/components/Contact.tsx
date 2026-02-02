/**
 * Contact Section Component
 * Contact form and information
 */

'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { PERSONAL_INFO } from '@/lib/constants'

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  // Loading and success states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In production, this would send to an API endpoint or email service
      // For now, we'll simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For real implementation, you could use:
      // - AWS SES for email
      // - Form service like Formspree, Form.io
      // - Your own backend API
      
      console.log('Form submitted:', formData)
      
      setSubmitStatus('success')
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="section-padding bg-dark-card">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Have a project in mind or want to discuss DevOps solutions? Let's
            connect!
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <Mail className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-dark-muted hover:text-primary-500 transition-colors"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <Phone className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a
                      href={`tel:${PERSONAL_INFO.phone}`}
                      className="text-dark-muted hover:text-primary-500 transition-colors"
                    >
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <MapPin className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-dark-muted">{PERSONAL_INFO.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Work With Me */}
            <div className="glass rounded-lg p-6">
              <h4 className="font-semibold mb-4 text-primary-500">
                Why Work With Me?
              </h4>
              <ul className="space-y-3 text-dark-muted">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span>3.5+ years of production DevOps experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span>AWS certified with deep cloud expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span>Strong focus on automation and efficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span>Experience with enterprise-scale infrastructure</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="glass rounded-lg p-6 space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="block mb-2 font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-border disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                  ✗ Something went wrong. Please try again or email me directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
