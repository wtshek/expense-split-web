# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an expense splitting web application built with React 19, TypeScript, and Vite. The project is configured as a Progressive Web App (PWA) with offline capabilities and auto-update functionality.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript check then Vite build)
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build locally

## Technology Stack

- **Frontend**: React 19.0.0 with TypeScript 5.7.2
- **Build Tool**: Vite 6.0.11 with React plugin
- **Styling**: TailwindCSS 4.1.10 (using new Vite plugin)
- **PWA**: vite-plugin-pwa with Workbox service worker
- **Package Manager**: pnpm 10.11.0
- **Linting**: ESLint 9.18.0 with TypeScript and React hooks plugins

## Architecture & Structure

```
src/
├── main.tsx          # Application entry point
├── App.tsx           # Root component (currently minimal)
├── index.css         # Global styles with Tailwind imports
└── vite-env.d.ts     # Vite type definitions
```

The application is currently in early development with minimal implementation. The main App component only displays "hi" and needs full expense splitting functionality.

## PWA Configuration

The app is configured with comprehensive PWA settings:
- Auto-update service worker registration
- Offline asset caching for JS, CSS, HTML, SVG, PNG, ICO files
- Manifest configuration for installability
- Asset generation for icons and splash screens
- Development PWA features disabled by default

## Code Standards

- Strict TypeScript configuration with modern React patterns
- ESLint enforces React hooks rules and TypeScript best practices
- Uses React 19 features and conventions
- TailwindCSS for styling with the new Vite plugin approach

## Development Notes

- The project uses React 19's latest features and patterns
- PWA assets are generated automatically during build
- Service worker handles caching and updates automatically
- TypeScript strict mode is enabled for better type safety
- The application needs core expense splitting features to be implemented