# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run prettier
npm run prettier:fix

# Run all quality checks
npm run quality
npm run quality:fix

# Testing
npm run test
npm run test:watch
npm run test:coverage
```

### AI Development & Testing
```bash
# Test autonomous generation
npm run test:autonomous

# Generate all test apps
npm run generate:all

# Bundle analysis
npm run analyze
```

## Architecture Overview

### Core System Design
MATURA is an AI-powered application generation platform built on Next.js 14 with App Router. The system follows a **6-phase development workflow** (FreeTalk → InsightRefine → SketchView → UXBuild → CodePlayground → ReleaseBoard) and uses intelligent design pattern selection.

### Key Architectural Components

1. **Intelligent Generation System**
   - `lib/intelligent-design-analyzer.ts` - Extracts structured data (Why/Who/What/How/Impact) from user input
   - `lib/intelligent-figma-selector.ts` - Automatically selects optimal Figma templates with scoring
   - `lib/smart-ui-selector.ts` - AI-powered UI pattern selection from 6 premium design patterns
   - `lib/dynamic-customization-engine.ts` - Dynamic UI customization based on analysis

2. **State Management Architecture**
   - **Zustand** (`lib/stores/`) - Global state management
   - **React Query** - Server state with 5-second refetch intervals for real-time updates
   - **Local Storage** - Persistent user preferences and chat history
   - **Context Providers** (`components/providers/`) - MaturaProvider, ThemeProvider, QueryProvider

3. **Database & Schema Management**
   - **Supabase** integration with `generated_apps` table for app persistence
   - **Dynamic schema inference** via `/api/infer-schema` using OpenAI GPT-4
   - **Fallback schema generation** for 6 common app types
   - **Generic CRUD service factory** for different app types

4. **API Route Structure**
   - `/api/generate-simple` - Basic app generation
   - `/api/intelligent-generate` - Advanced AI-powered generation with design analysis
   - `/api/infer-schema` - Database schema inference from user input
   - `/api/create-table` - Table creation and app storage
   - `/api/crud/[table]` - Dynamic CRUD operations

### Component Architecture

1. **Main Generator Components**
   - `SimpleGenerator` - Primary interface, manages basic generation workflow
   - `IntelligentDesignGenerator` - Advanced generation with design reasoning
   - `TableCreator` - Dynamic table creation with schema inference

2. **Phase-Based Components** (`components/phases/`)
   - Each phase has its own component implementing the 6-phase workflow
   - Components communicate through MaturaState and context providers

3. **UI System**
   - Built on shadcn/ui with custom theming
   - `components/ui/themed-*` - Custom themed components
   - Responsive design with Tailwind CSS

## Key Development Patterns

### Schema Inference System
The system automatically infers database schemas from natural language input:
1. **OpenAI GPT-4** attempts intelligent schema generation
2. **Rule-based fallback** for 6 common app types (task management, finance, etc.)
3. **Validation and error handling** with comprehensive logging

### Intelligent Design Selection
The platform uses AI to select optimal design patterns:
1. **User input analysis** extracts requirements and context
2. **Pattern matching** against 6 premium design patterns
3. **Confidence scoring** for design decisions
4. **Dynamic customization** based on analysis results

### Real-time Data Management
- **React Query** handles all server state with optimistic updates
- **5-second refetch intervals** for live app management
- **Error boundaries** and retry logic for graceful degradation
- **Local storage persistence** for offline capabilities

## Environment Variables

### Required
- `GEMINI_API_KEY` - Gemini AI API key for intelligent generation
- `OPENAI_API_KEY` - OpenAI API key for schema inference and GPT-4 features

### Optional
- `FIGMA_API_KEY` - Figma API integration for design system extraction
- `DEFAULT_FIGMA_FILE_ID` - Default Figma file for design templates
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Code Quality Standards

### TypeScript Configuration
- Strict type checking enabled
- `ignoreBuildErrors: true` for development flexibility
- External packages configured for server components

### Code Style
- **ESLint** with Next.js configuration
- **Prettier** for consistent formatting
- **Husky** pre-commit hooks for quality enforcement
- **lint-staged** for staged file linting

## Testing Strategy

### Component Testing
- **Jest** with jsdom environment
- **React Testing Library** for component testing
- **Coverage reports** for quality assurance

### AI Integration Testing
- `/components/FigmaIntegrationTest.tsx` - Figma API testing tool
- `scripts/test-autonomous-generation.ts` - Autonomous generation testing
- Mock data services for development and testing

## Deployment Configuration

### Vercel Deployment
- **Standalone output** for optimized builds
- **Environment variable** configuration required
- **CORS headers** configured for API routes
- **Function runtime** using `@vercel/node`

### Key Files
- `vercel.json` - Deployment configuration
- `next.config.js` - Next.js configuration with environment variables
- `.env.example` - Environment variable template

## Data Flow Architecture

### App Generation Flow
1. User input → Schema inference → Design pattern selection → UI generation → App storage
2. **SimpleGenerator** handles basic flow
3. **IntelligentDesignGenerator** adds AI-powered design analysis
4. **TableCreator** manages dynamic table creation

### State Management Flow
1. **User interactions** update local component state
2. **Form submissions** trigger API calls
3. **React Query** manages server state and caching
4. **Zustand stores** handle global application state
5. **Local storage** persists user preferences

## Performance Considerations

### Optimization Strategies
- **React Query caching** reduces API calls
- **Optimistic updates** improve perceived performance
- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** available via `npm run analyze`

### Monitoring
- **Error boundaries** for graceful error handling
- **Comprehensive logging** for debugging
- **Performance metrics** in development mode