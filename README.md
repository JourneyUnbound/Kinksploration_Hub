# Journey Unbound™ Kinksploration™ Hub

The Journey Unbound™ Kinksploration™ Hub is a connected MVP application containing the Kinksploration™ Checklist and five interactive tools:

- Boundary Builder
- Scene Planner
- Contract Negotiator
- AfterCare Ally
- The Unwind

The repository is being developed from a set of AI-first Implementation Contracts that define the architecture, responsibilities, data flow, business rules, outputs, and acceptance criteria for each component.

## Repository Purpose

This repository contains the codebase for the Journey Unbound™ Kinksploration™ Hub MVP.

The application is designed as one cohesive system with:

- A shared data-access layer
- Database-driven catalog content
- Independent tool access
- Optional upstream data import
- Printable and shareable outputs
- Modular component responsibilities

## MVP Components

### Kinksploration™ Checklist

Collects structured user responses to Checklist activities, including:

- Fetish toggle
- Five-star rating
- Experience status
- Hard Limit
- Soft Limit
- Notes
- Mark Visited

The Checklist is the authoritative source for user activity responses.

### Boundary Builder

Uses Checklist activity data and associated NVC Needs to create Nonviolent Communication-based, consent-focused boundary statements.

### Scene Planner

Uses Kinksploration™ Checklist activity ratings to help users build structured scene plans.

### Contract Negotiator

Guides users through producing a complete contract using:

- Relationship Structure
- User-defined Clause Variables
- Consent Considerations
- Negotiated Agreements
- Hard Limit Boundary Statements
- NVC Sentence Structures
- Agreement Clauses

### AfterCare Ally

Helps users create structured aftercare plans from guided suggestions, selected scene activities, or a blank starting point.

### The Unwind

Supports independent or context-informed reflection using optional information from completed Journey Unbound™ tools.

## Architecture

The Journey Unbound™ Kinksploration™ Hub coordinates data flow between components.

The Hub itself does not consume catalog data. Catalogs are consumed by the Kinksploration™ Checklist and individual tools according to their Implementation Contracts.

All catalog content must remain database-driven.

No catalog content should be hard-coded into:

- Frontend components
- Tool workflows
- Business logic
- Validation rules
- Templates

Catalog access must be isolated behind a shared data-access layer so the underlying data source can be replaced without rewriting the tools.

## Data Sources

The MVP uses structured catalogs for:

- Activities
- Categories
- Activity Subgroups
- NVC Needs
- Boundaries
- Scene Templates
- Relationship Structures
- Agreement Clauses
- Consent Language
- Aftercare
- Reflection Prompts

Approved Journey Unbound™ seed data is supplied separately.

The application should include seed or import scripts capable of loading that supplied data without altering or inventing content.

## Implementation Contracts

The following documents are authoritative:

1. Journey Unbound™ Kinksploration™ Hub Implementation Contract
2. Kinksploration™ Checklist Implementation Contract
3. Boundary Builder Implementation Contract
4. Scene Planner Implementation Contract
5. Contract Negotiator Implementation Contract
6. AfterCare Ally Implementation Contract
7. The Unwind Implementation Contract

Where the code and a contract conflict, the Implementation Contract takes precedence.

Parking Lot items are excluded from the MVP unless explicitly promoted into the active contract.

## Language and Brand Standards

Use Canadian English throughout user-facing content.

Examples:

- behaviour
- colour
- centre
- customised
- prioritised

Always include the ™ symbol when displaying:

- Journey Unbound™
- Kinksploration™
- Selfsploration™

Use trauma-informed, consent-based, non-judgmental language.

Use Nonviolent Communication terminology and sentence structures where required by the Implementation Contracts.

## Development Principles

- Keep component responsibilities separate.
- Avoid duplicate business logic.
- Keep shared types and services centralized.
- Keep catalog adapters isolated.
- Align data order with the order in which the user moves through each workflow.
- Support each tool independently.
- Allow optional upstream imports where defined.
- Keep outputs editable after printing or sharing.
- Do not introduce user-facing AI.
- Do not implement Parking Lot items in the MVP.

## Expected Repository Structure

```text
src/
  components/
  tools/
    checklist/
    boundary-builder/
    scene-planner/
    contract-negotiator/
    aftercare-ally/
    the-unwind/
  services/
    catalog-data/
    persistence/
    outputs/
    validation/
  types/
  data/
  routes/
  styles/

database/
  schema/
  migrations/
  seeds/
  imports/

docs/
  implementation-contracts/

tests/
```

The final structure may vary by framework, but separation of responsibilities must remain intact.

## Local Development

Project-specific commands will be added once the application framework and package manager are established.

Expected commands:

```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Environment Variables

Create an `.env.example` file containing placeholders only.

Do not commit:

- API keys
- Database credentials
- Access tokens
- Production secrets

## Testing

Test both:

- The complete Kinksploration™ Hub flow
- Each tool independently

The complete flow is:

```text
Kinksploration™ Checklist
→ Boundary Builder
→ Scene Planner
→ Contract Negotiator
→ AfterCare Ally
→ The Unwind
```

Testing must confirm:

- Catalog content loads dynamically
- User responses persist
- Catalog relationships resolve correctly
- Hard Limit behaviour works
- Rating-based Scene Planner behaviour works
- Optional imports work
- Independent tool entry works
- Outputs can be saved, edited, printed, and shared
- Parking Lot items remain excluded
- No user-facing AI is introduced
- No catalog content is hard-coded

## MVP Deployment

The MVP is intended for testing and boutique outreach.

Production authentication, encryption, privacy, and security architecture will be defined separately before production release.

## Status

Active MVP implementation.

## Ownership

Journey Unbound™ is the intellectual property of its founder and sole product architect.

All product architecture, terminology, workflows, Implementation Contracts, catalog structures, content, and brand assets remain proprietary.
