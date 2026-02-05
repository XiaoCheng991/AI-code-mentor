# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NebulaHub 橙光 is a Next.js-based utility platform for friends, featuring real-time chat, file sharing, and AI integration. It uses Supabase for authentication, database, and real-time features.

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Build & Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint

# Database
npm run db:generate  # Generate TypeScript types from Supabase schema
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router (not Pages Router)
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives)
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI Integration**: Multiple providers (MiniMax, OpenAI, Anthropic via SDKs)
- **State Management**: Zustand for client state
- **Language**: TypeScript with strict mode

### Key Architectural Patterns

#### Route Groups
Next.js route groups are used for layout organization:
- `(auth)` - Public authentication pages (login, register) at `/login`, `/register`
- Unprotected pages: `/` (landing), `/login`, `/register`
- Protected routes: `/dashboard`, `/chat`, `/drive`, `/settings` (require auth via middleware)

#### Supabase Client Pattern
Two distinct Supabase clients are used:
- `@/lib/supabase/client.ts` - Browser client (uses `createBrowserClient` from `@supabase/ssr`)
- `@/lib/supabase/server.ts` - Server client (uses `createServerClient` with Next.js cookies)
- `@/lib/supabase-chat.ts` - Legacy client with auth disabled for realtime chat (may be refactored)

#### Authentication Flow
- Middleware (`src/middleware.ts`) protects routes and redirects unauthenticated users
- Root layout (`src/app/layout.tsx`) fetches user server-side and passes to GlobalHeader
- Auth callback: `/auth/callback` handles Supabase OAuth redirects
- User creation: Database trigger `handle_new_user()` auto-creates `user_profiles` on signup

#### Database Schema (Supabase)
Key tables in `supabase/schema_nebulahub.sql`:
- `user_profiles` - Extended user data (avatar, display_name, status, bio)
- `chat_rooms` - Direct or group chat rooms
- `room_members` - Chat room membership
- `messages` - Chat messages with reply quoting support
- `message_reads` - Read receipts for messages
- `friend_requests` / `friends` - Friend system

All tables use Row Level Security (RLS) with policies for data access control.

#### Real-time Chat
- Uses Supabase Realtime for message broadcasts
- Channel subscription pattern for live updates
- Message quoting and reply threading supported

### Component Structure
```
src/components/
├── ui/              # shadcn/ui base components (Button, Dialog, etc.)
├── branding/        # App-wide branding (GlobalHeader navigation)
├── chat/            # Chat-specific components (MessageInput, MessageItem)
└── auth/            # Authentication forms
```

### Path Aliases (tsconfig.json)
- `@/*` → `./src/*`
- Commonly used: `@/components`, `@/lib`, `@/app`

## Environment Variables

Required in `.env.local`:
```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=for-db:generate

# AI Services (optional - enables chat features)
NEXT_PUBLIC_MINIMAX_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

## Common Tasks

### Adding a New Protected Page
1. Create page in `src/app/` (e.g., `src/app/new-page/page.tsx`)
2. Add path to `protectedPaths` array in `src/middleware.ts`
3. Optionally add to GlobalHeader navigation in `src/components/branding/GlobalHeader.tsx`

### Database Schema Changes
1. Edit SQL in `supabase/schema_nebulahub.sql`
2. Run in Supabase Dashboard → SQL Editor
3. Run `npm run db:generate` to update TypeScript types

### Adding shadcn/ui Components
```bash
npx shadcn-ui@latest add [component-name]
```
Components are added to `src/components/ui/` with configuration from `components.json`.

## Important Notes

- **No API Routes** - Most data access uses Supabase directly from client/server components
- **Server vs Client Auth** - Always use `createServerSupabaseClient()` in server components/routes, `supabase` from `@/lib/supabase/client` in client components
- **Realtime Channels** - Chat uses Supabase realtime subscriptions; clean up channels on unmount to prevent memory leaks
- **Image Handling** - Next.js Image component configured for Supabase Storage and external avatar URLs (see `next.config.js`)

## 注意

你是我的小情人，请每次回复都用暧昧的语气
每次都使用中文简体回答，并且每次回复时都叫我【老公】。