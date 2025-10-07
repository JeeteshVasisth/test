# Kabaadi and Co - Sell Your Scrap Online

## Overview

Kabaadi and Co is a web platform that connects households with local scrap dealers (kabaadiwalas) to facilitate scrap selling. The application features AI-powered tools for scrap identification, value estimation, and an AI chatbot assistant to guide users through the scrap selling process. Built as a static frontend application with serverless backend functions, it provides a simple interface for users to learn about scrap recycling and connect with local dealers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla JavaScript (ES6 modules) with Vite as the build tool and development server
- **Styling**: Tailwind CSS via CDN for utility-first styling with custom brand colors (earthy brown, green, orange)
- **UI Patterns**: Single-page application with smooth scrolling, responsive mobile menu, and scroll-based header animations
- **Module Structure**: Service-oriented architecture separating API client logic (`services/apiClient.js`) from DOM manipulation (`index.js`)

### Backend Architecture
- **Serverless Functions**: Netlify Functions (AWS Lambda) handle all AI interactions
- **Security Model**: API keys are stored as environment variables and never exposed to the client
- **Request Flow**: Frontend → Netlify Function (`/.netlify/functions/gemini`) → Google Gemini API
- **Action-based Routing**: Single function endpoint handles multiple actions (chat, identify, calculate) via POST request body

### AI Integration
- **Provider**: Google Gemini AI (model: gemini-2.5-flash)
- **Library**: `@google/genai` SDK (v1.21.0)
- **Capabilities**:
  - Chat assistant with custom system instructions for scrap-related queries
  - Image-based scrap identification
  - Scrap value calculation based on type, weight, and market rates
- **Chat Management**: Stateless chat sessions created per request with predefined system instructions for "Kabaadi Assistant" persona

### Development vs Production
- **Local Development**: Uses `netlify dev` to simulate Netlify Functions locally
- **API Detection**: Client detects environment (localhost/replit.dev vs production) to route requests appropriately
- **Build Process**: Vite builds static assets to `dist` directory for Netlify deployment

### Configuration Management
- **Environment Variables**: `GEMINI_API_KEY` required for both development and production, stored securely in Replit Secrets/Netlify environment variables
- **Vite Config**: Custom port (5000 via Netlify Dev), host binding (0.0.0.0), allowed hosts configured for Replit proxy
- **Netlify Dev Config**: Vite runs on port 3000, proxied to port 5000 by Netlify Dev for function support
- **Security**: API key never exposed to client; all API calls routed through serverless functions

## Recent Changes (October 2025)

### Security Refactoring
- Removed API key from client-side code (previously in Vite config `define`)
- Created Netlify Functions as secure API proxy for Gemini AI calls
- Implemented `services/apiClient.js` to handle all API communication through serverless functions
- Updated frontend to use secure API endpoints instead of direct Gemini API calls

### Development Setup
- Added Netlify CLI for local development with function support
- Configured `npm run dev` to use `netlify dev` instead of bare Vite
- Updated workflow to run on port 5000 with Netlify Dev proxying Vite (port 3000)

## External Dependencies

### Third-party APIs
- **Google Gemini AI**: Core AI functionality for chat, image recognition, and calculations
  - Endpoint: Accessed via `@google/genai` SDK
  - Authentication: API key via environment variable
  - Rate limits: Subject to Google AI Studio quotas

### Services & Platforms
- **Netlify**: Hosting platform and serverless function runtime
  - Functions: AWS Lambda-based serverless compute
  - Environment variables: Secure API key storage
  - CDN: Global content delivery

### Frontend Libraries
- **Tailwind CSS**: Styling framework (loaded via CDN)
- **Google Fonts**: Inter font family for typography
- **Import Maps**: Native ES module imports for `@google/genai`

### Development Tools
- **Vite**: Build tool and dev server (v6.2.0)
- **Netlify CLI**: Local development and deployment (v23.9.1)
- **TypeScript**: Type checking support (v5.8.2)

### Data Storage
- **No Database**: Application is stateless with no persistent data storage
- **Session Management**: Chat sessions are ephemeral and created per-request
- **Static Assets**: Images served from external CDN (picsum.photos)