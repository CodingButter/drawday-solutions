# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DrawDay Spinner - A Chrome Extension monorepo for conducting live draws in UK competitions. Features a client-side browser extension that operates entirely locally without external network calls, plus a marketing website.

## Architecture

### Monorepo Structure (pnpm workspaces)

- **apps/extension**: Chrome extension with options page and side panel
- **apps/website**: Next.js marketing website
- **packages/**:
  - `storage`: Chrome storage API abstraction layer
  - `csv-parser`: CSV parsing with intelligent column mapping
  - `spinner-physics`: Animation physics calculations
  - `spinners`: Spinner wheel React components
  - `contexts`: Shared React contexts
  - `hooks`: Shared React hooks
  - `ui`: Shared UI components
  - `utils`: Shared utilities
  - `types`: Shared TypeScript types
  - Config packages: `eslint-config`, `prettier-config`, `typescript-config`, `tailwind-config`

### Extension Architecture (Three-Layer)

1. **Presentation Layer**: React components with shadcn/ui, styled with Tailwind CSS v4
2. **Business Logic Layer**: React contexts for state management, custom hooks for business logic
3. **Data Layer**: Abstracted wrapper around chrome.storage.local API

### Key Technical Decisions

- **Tailwind CSS v4**: Using new CSS-based configuration with @theme directive
- **Build System**: Vite for extension, Next.js for website, tsup for packages
- **Storage**: chrome.storage.local with abstraction layer for future backend migration
- **Performance**: Dynamic rendering for large participant lists (>100 entries), must maintain 60fps animations

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Run all apps in parallel
pnpm --filter @raffle-spinner/extension dev   # Extension only
pnpm --filter @raffle-spinner/website dev     # Website only

# Building
pnpm build                  # Build all packages and extension
pnpm build:website          # Build packages and website (no extension)

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix ESLint issues
pnpm format                # Format with Prettier
pnpm format:check          # Check Prettier formatting
pnpm typecheck             # TypeScript type checking
pnpm quality               # Run all quality checks (lint, format:check, typecheck)

# Extension Specific
pnpm --filter @raffle-spinner/extension build    # Build extension for production
pnpm --filter @raffle-spinner/extension icons    # Generate icon sizes

# Clean
pnpm clean                 # Clean all build artifacts
```

## Testing

```bash
# Run tests for specific packages
pnpm --filter @raffle-spinner/extension test
pnpm --filter @raffle-spinner/csv-parser test
```

## Data Structures

### Competition Object
```typescript
{
  id: string;
  name: string;
  participants: Array<{
    firstName: string;
    lastName: string;
    ticketNumber: string; // unique
  }>;
  winners?: Array<{
    participant: Participant;
    timestamp: number;
  }>;
}
```

### Settings Structure
```typescript
{
  minSpinDuration: number; // seconds
  decelerationRate: 'slow' | 'medium' | 'fast';
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}
```

## Critical Implementation Requirements

1. **CSV Import**: 
   - Must intelligently pre-select column mappings based on header names
   - Check for duplicate ticket numbers, allow user to cancel or proceed
   - Support various delimiters and formats

2. **Performance**:
   - Spinner must maintain 60fps with 5000+ participants
   - Only render visible segments for large lists
   - Pre-calculate winner before animation starts
   - Load times must be under 2 seconds

3. **Chrome Extension**:
   - Manifest V3 compliant
   - Side panel for spinner display
   - Options page for configuration
   - All data stored locally in chrome.storage.local

4. **Build Process**:
   - Extension build creates `drawday-spinner-extension.zip` ready for Chrome Web Store
   - Automatic icon generation from source `icon.png`
   - Built files output to `apps/extension/DrawDaySpinner/`

## Git Workflow

- Main branch: `main` (production)
- Development branch: `development`
- Feature branches: `feature/*`
- Pre-commit hooks run lint-staged and typecheck

## Deployment

- **Extension**: Manual upload to Chrome Web Store from built zip file
- **Website**: Deployed to Vercel (see `vercel.json` configuration)

## Package Dependencies

When adding dependencies:
- Workspace packages use `workspace:*` protocol
- Shared configs are in respective packages
- Extension uses Vite with @tailwindcss/vite plugin
- Website uses Next.js with standard Tailwind setup