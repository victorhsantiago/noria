# Noria

Noria is a platform for organising regular group activities.

Inspired by the challenges of coordinating tabletop RPG sessions, Noria aims to help any group stay connected and organised, whether it's a roleplaying campaign, board game night, book club, study group, sports team or regular meet-up.

The goal is to reduce the time spent on planning and communicating, so that groups can spend more time enjoying activities together.

## Vision

Organising recurring activities is surprisingly difficult.

Groups often rely on a mix of messaging apps, spreadsheets, calendars, polls, and shared documents. Information becomes fragmented, availability changes, and important details get lost in chat history.

Noria provides a central place where groups can:

- Organise events
- Coordinate availability
- Track attendance
- Share notes and updates
- Maintain continuity between meetings

## MVP Features

### Group Management

- Create groups
- Invite members
- Manage membership

### Events

- Create events
- RSVP (Yes / No / Maybe)
- Track attendance

### Scheduling

- Availability polls
- Date selection
- Recurring events

### Communication

- Event notes
- Announcements
- Session summaries

## Future Features

- Campaign management for RPG groups
- Character and player profiles
- Discord integration
- Google Calendar integration
- Notifications and reminders
- Mobile applications
- Community discovery

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend

- Next.js Route Handlers / Server Actions
- Supabase
- PostgreSQL

### Monorepo

- pnpm Workspaces
- Turborepo

### Shared Packages

- Zod
- Shared schemas and types

## Project Structure

```txt
noria/
├── apps/
│   └── web/
│
├── packages/
│   ├── database/
│   ├── schemas/
│   ├── ui/
│   └── config/
│
├── pnpm-workspace.yaml
└── turbo.json
```

## Development

### Requirements

- Node.js 22+
- pnpm
- Docker

### Install dependencies

```bash
pnpm install
```

### Start Supabase (Database & Services)

```bash
pnpm --filter database db:start
```

### Generate Database Types

```bash
pnpm --filter database db:types
```

### Start development environment

```bash
pnpm dev
```

## Guiding Principles

### Build for groups, not individuals

Every feature should help people coordinate and collaborate.

### Reduce friction

Scheduling an event should take seconds, not minutes.

### Mobile-first experience

Most users will interact with Noria from their phones.

### Keep it simple

Avoid feature creep. Solve the core coordination problem before expanding into adjacent areas.

### Community over complexity

Noria should feel welcoming and lightweight, not like project management software.

## Name

A _noria_ is a water wheel that continuously lifts and moves water.

The name reflects the idea of helping groups maintain momentum and keep activities moving forward.
