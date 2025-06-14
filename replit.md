# EliteShop - Premium E-Commerce Platform

## Overview

EliteShop is a full-stack e-commerce application built with modern web technologies. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database using Drizzle ORM. The application provides a complete shopping experience with product browsing, cart management, wishlist functionality, and checkout process.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React Context for cart/wishlist
- **Animations**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Simple session-based approach for cart/wishlist
- **Build System**: Vite for frontend, esbuild for backend

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling via @neondatabase/serverless

## Key Components

### Database Schema
The application uses five main tables:
- **categories**: Product categories with icons and colors
- **products**: Main product catalog with pricing, ratings, and stock status
- **reviews**: Customer reviews and ratings for products
- **cart_items**: Session-based shopping cart storage
- **wishlist_items**: Session-based wishlist functionality

### Frontend Components
- **Product Management**: Product grid, cards, and detail views
- **Shopping Features**: Cart modal, wishlist integration
- **UI Components**: Comprehensive component library based on Radix UI
- **Layout**: Responsive header, footer, and navigation
- **Pages**: Home, products listing, product detail, and checkout

### Backend Services
- **Storage Layer**: Abstracted storage interface (currently in-memory implementation)
- **API Routes**: RESTful endpoints for products, cart, wishlist, and reviews
- **Session Handling**: Simple session ID generation for anonymous users
- **Error Handling**: Centralized error handling middleware

## Data Flow

1. **Product Browsing**: Users browse products by category or search
2. **Product Details**: Detailed product views with reviews and ratings
3. **Cart Management**: Add/remove items with quantity management
4. **Wishlist**: Save products for later consideration
5. **Checkout**: Complete purchase flow with form validation

The application follows a typical client-server architecture where:
- Frontend makes API calls using TanStack Query
- Backend processes requests and interacts with database
- Session-based state management for anonymous users
- Real-time updates through query invalidation

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Express.js for backend API
- PostgreSQL with Drizzle ORM

### UI and Styling
- Radix UI components for accessible primitives
- Tailwind CSS for utility-first styling
- Framer Motion for animations
- Lucide React for icons

### Development Tools
- Vite for frontend development and building
- TypeScript for type safety
- ESBuild for backend bundling
- Drizzle Kit for database migrations

### Third-party Services
- Neon Database for PostgreSQL hosting
- Replit for development environment

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- Runs on Node.js 20 with Vite dev server
- Hot reloading for both frontend and backend
- PostgreSQL database integration
- Port 5000 for local development

### Production Build
- Frontend: Vite build to static assets
- Backend: esbuild bundle to single Node.js file
- Static file serving through Express
- Environment variable configuration for database

### Configuration Files
- `.replit`: Replit-specific configuration
- `vite.config.ts`: Frontend build configuration
- `drizzle.config.ts`: Database configuration
- `tsconfig.json`: TypeScript configuration

The deployment uses Replit's autoscale feature with proper build and start commands configured for production deployment.

## Changelog
- June 14, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.