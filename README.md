# DrawDay Solutions - Marketing Website

The Next.js marketing site for DrawDay at [drawday.app](https://www.drawday.app).

## Quick Start

```bash
pnpm install
pnpm dev        # Start dev server at localhost:3000
pnpm build      # Production build
```

## Project Structure

```
website/
├── apps/
│   └── website/              # Next.js 14 marketing site
├── packages/
│   ├── tailwind-config/      # Shared Tailwind CSS config
│   ├── eslint-config/        # Shared ESLint rules
│   ├── prettier-config/      # Shared Prettier rules
│   └── typescript-config/    # Shared TS config
├── package.json
├── pnpm-workspace.yaml
└── vercel.json
```

## Commands

```bash
pnpm dev            # Start website dev server
pnpm build          # Build website
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier --write
pnpm format:check   # Prettier --check
pnpm typecheck      # TypeScript validation
pnpm quality        # All checks (lint + format + typecheck)
```

## Deployment

Deployed to Vercel. See `vercel.json` for configuration.
