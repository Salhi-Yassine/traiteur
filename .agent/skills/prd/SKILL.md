---
name: prd-architect
description: >
  Transform rough ideas, bullet-point PRDs, meeting notes, or existing documents into polished,
  client-ready Product Requirements Documents in Markdown format. Use this skill whenever a user
  wants to create, upgrade, professionalize, or restructure a PRD, product spec, feature brief,
  or any product planning document. Also trigger when the user mentions "make this look professional",
  "turn this into a PRD", "write a spec", "product requirements", "feature document", "client-ready
  document", "product brief", or anything involving turning rough product ideas into structured
  documentation. Even if the user just pastes a raw idea or messy notes and says "clean this up" or
  "make this proper" — this skill should trigger.
---

# PRD Architect

Transform raw product thinking into polished, enterprise-grade Product Requirements Documents that look like they came from a top-tier tech organization.

## Philosophy

The best PRDs aren't just formatted notes — they're persuasion documents. They convince stakeholders that the team deeply understands the problem, has explored alternatives, and has a clear path forward. This skill produces documents that a client reads and thinks: "These people know exactly what they're doing."

The output follows a Google/Meta-inspired structure: rigorous sections, clear success metrics, and deep technical architecture — because vague specs lead to vague products.

## Workflow

### Step 1: Assess the Input

Read what the user provides. It could be anything from a single sentence to an existing document. Classify it:

- **Raw idea** (1-5 sentences): Needs the most expansion. Ask 2-3 targeted clarifying questions before generating.
- **Bullet-point PRD**: Has structure but needs depth, polish, and missing sections.
- **Meeting notes / transcript**: Needs extraction, organization, and gap-filling.
- **Existing document**: Needs restructuring, professionalization, and gap analysis.

For raw ideas and very sparse inputs, ask clarifying questions — but keep it to a single round of 2-3 questions max. Focus on what you truly cannot infer: the target users, the core problem, and any known technical constraints. For everything else, make intelligent assumptions and flag them clearly in the document with `[Assumption — confirm with team]` markers so the client can validate.

### Step 2: Research & Enrich (if applicable)

If web search is available, use it to strengthen the document:
- Look up industry benchmarks for success metrics (e.g., typical conversion rates, load times)
- Find comparable products or features for competitive context
- Verify technical feasibility claims if the domain is specific

This is optional enrichment, not a blocker. Skip if the user seems to want speed over depth.

### Step 3: Generate the PRD

Create a comprehensive Markdown document following the structure in `references/prd-template.md`. Read that file before generating.

Key principles while writing:

**Be specific, not generic.** Instead of "improve user experience," write "reduce onboarding drop-off from 40% to under 15% by eliminating the 3-step verification flow." If you don't have real numbers, use realistic placeholders marked with `[TBD]`.

**Technical architecture is the star.** This section should be the most detailed in the document. Include system diagrams described in text/mermaid, API contracts, data models, integration points, and infrastructure considerations. Think like a senior engineer presenting to a CTO.

**Every requirement needs acceptance criteria.** Vague requirements are the #1 cause of scope creep. Each user story or requirement should have clear, testable acceptance criteria.

**Metrics are non-negotiable.** Every goal needs a measurable KPI. Every feature should tie back to a metric. Include a dedicated metrics/success section with baseline → target framing.

**Write for two audiences simultaneously.** The business stakeholders who care about outcomes and the engineering team who needs to build it. Use clear headers so each audience can navigate to what matters to them.

### Step 4: Output the Document

Save the final document as a `.md` file. The filename should follow the pattern:
```
PRD-[ProductName]-[YYYY-MM-DD].md
```

If the user provided a product or feature name, use it. Otherwise, derive one from the content.

After saving, present the file to the user. Keep post-generation commentary brief — the document speaks for itself.

### Step 5: Iterate if Needed

If the user requests changes:
- For structural changes (add/remove sections), regenerate the affected sections
- For content changes (update specific details), make targeted edits
- For style changes (more/less formal, different depth), adjust and regenerate

## Handling Edge Cases

**Contradictory requirements in the input**: Flag them explicitly in a "Open Questions" section rather than silently choosing one interpretation.

**Missing critical information**: Use `[TBD — needs input from stakeholder]` markers. Never invent business-critical numbers (revenue targets, user counts) without marking them as assumptions.

**Multi-product or multi-feature input**: If the input covers multiple distinct features or products, suggest splitting into separate PRDs and ask the user which to tackle first.

**Non-English input**: Generate the PRD in the same language as the input, maintaining the same structural template.

## What a Good Output Looks Like

The final document should:
- Be 8-20 pages when rendered (depending on complexity)
- Have a clear table of contents
- Include at least one technical diagram (mermaid syntax)
- Have numbered requirements with acceptance criteria
- Include a metrics table with baseline/target columns
- Read like it was written by a senior PM at a top tech company
- Be ready to send to a client with zero additional formatting

## Reference Files

Before generating any PRD, read the template:
- `references/prd-template.md` — The full document structure with section guidance
