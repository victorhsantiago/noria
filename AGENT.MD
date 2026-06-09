# AGENT.md

This file provides guidance for AI coding agents working on Noria.

## Project Overview

Noria is a platform for organizing recurring group activities.

The product was originally inspired by tabletop RPG groups but is designed for any recurring social activity:

- RPG campaigns
- Board game nights
- Book clubs
- Sports teams
- Study groups
- Friend groups

The primary goal is reducing the friction involved in organizing events.

---

# Product Principles

## Keep things simple

Favor simple solutions over complex ones.

Avoid introducing abstractions before they are needed.

---

## Mobile-first

Most users will interact with Noria from mobile devices.

Every UI should be designed for small screens first.

---

## Human language

The product should feel friendly and conversational.

Prefer:

- "Who's coming?"
- "Can't make it"
- "Still deciding"

Avoid:

- "Participant attendance status"
- "Meeting resource allocation"

---

## Minimize user effort

Creating and sharing an event should take less than one minute.

Every feature should be evaluated against this principle.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- React Aria Components
- Tanstack Query

## Database

- Supabase

## Monorepo

- pnpm Workspaces
- Turborepo

## Validation

- Zod

---

# Repository Structure

```txt
apps/
  web/

packages/
  database/
  schemas/
  ui/
  config/
  eslint-config/
```

---

# Architectural Guidelines

---

## Keep business logic outside UI

Avoid business logic inside React components.

Prefer:

```ts
services/
repositories/
actions/
```

over large component files.

---

## Shared contracts

All shared contracts must live in:

```txt
packages/schemas
```

Example:

```ts
export const EventSchema = ...
export type Event = z.infer<typeof EventSchema>
```

Do not duplicate interfaces across frontend and backend.

---

# Code Style

## TypeScript

Use strict typing.

Avoid:

```ts
any;
```

Prefer:

```ts
unknown;
```

or proper types.

---

## Functional programming

Favor functional patterns over classes.

Prefer:

```ts
export function createEvent() {}
```

over:

```ts
class EventService {}
```

unless a class provides clear value.

---

## Naming

Use descriptive names.

Good:

```ts
createEvent;
getUpcomingEvents;
updateRsvp;
```

Avoid:

```ts
handleData;
processStuff;
manager;
helper;
```

---

# Testing

Test behavior, not implementation details.

Prioritize:

1. Critical business rules
2. User workflows
3. Edge cases

Avoid excessive mocking.

---

# MVP Scope

The MVP focuses on events.

Users can:

- Create events
- Update events
- Cancel events
- Share invitation links
- RSVP to events
- Search events

Groups, campaigns, and integrations are future features and should not influence current architecture.

---

# Future Features

Planned but not part of MVP:

- Groups
- Campaigns
- Discord integration
- Calendar synchronization
- Notifications
- Event templates
- Recurring event management

Do not prematurely optimize for these features.

---

# Decision Framework

When making implementation decisions:

1. Simpler solution wins.
2. Less code wins.
3. Better mobile experience wins.
4. Better user experience wins.
5. Faster delivery wins.

Favor pragmatism over theoretical perfection.

## Avoid unnecessary OOP

Prefer functions, modules and composition.

Do not introduce service classes, factories, builders,
or dependency injection containers unless there is a
clear and demonstrated need.
