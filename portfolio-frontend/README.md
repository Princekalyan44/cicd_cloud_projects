# Portfolio Frontend

Modern, responsive portfolio website built with Next.js and React.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **AI Chatbot**: Integrated chatbot for visitor interactions
- **Animations**: Smooth transitions with Framer Motion
- **SEO Optimized**: Meta tags and semantic HTML
- **Fast Loading**: Optimized bundle and lazy loading

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
portfolio-frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── api/               # API routes
│       └── health/        # Health check endpoint
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── Skills.tsx        # Skills display
│   ├── Experience.tsx    # Work experience
│   ├── Projects.tsx      # Project showcase
│   ├── Chatbot.tsx       # AI chatbot widget
│   └── ...
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   └── constants.ts      # Constants
├── public/               # Static assets
│   ├── images/
│   └── favicon.ico
├── styles/               # Global styles
│   └── globals.css
├── Dockerfile            # Container image definition
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # TailwindCSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build image
docker build -t portfolio-frontend .

# Run container
docker run -p 3000:3000 portfolio-frontend
```

## Environment Variables

```bash
# Chatbot API endpoint
CHATBOT_API_URL=http://chatbot-service:8080

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Components

### Hero Section
Introduction with name, role, and call-to-action buttons.

### Skills Section
Visual display of technical skills with proficiency levels.

### Experience Timeline
Work history with responsibilities and achievements.

### Projects Showcase
Highlighted projects with descriptions and tech stack.

### Chatbot Widget
Floating chat widget that communicates with backend chatbot service.

## API Integration

The frontend communicates with the chatbot service via REST API:

```typescript
// Example: Send message to chatbot
POST /api/chat
{
  "message": "What is your experience?",
  "sessionId": "unique-session-id"
}

// Response
{
  "response": "I have 3.5+ years of DevOps experience...",
  "timestamp": "2026-02-02T10:00:00Z"
}
```

## Deployment

The application is automatically deployed via GitHub Actions:

1. Code pushed to `main` branch
2. CI pipeline builds Docker image
3. Image pushed to ECR
4. Kubernetes manifest updated
5. ArgoCD deploys to EKS cluster

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: < 200KB (gzipped)
