# /generate-prp

Generate a detailed PRP (Product Requirements Prompt) for a ce-remotion feature.

## Usage
/generate-prp init/<filename>.md

## Required Reading — Do This First
Before writing a single line of the PRP, read ALL of these in order:
1. `CLAUDE.md` — project rules, structure, code principles
2. `docs/decisions.md` — confirmed decisions (never override these)
3. `docs/task.md` — Remotion patterns, gotchas, animation recipes
4. `docs/planning.md` — scene storyboard and build order
5. The init file specified in $ARGUMENTS

## Research Phase
After reading the above:
1. Scan `src/components/` for existing reusable components to leverage
2. Scan `src/scenes/` for existing patterns to follow
3. If building a new scene, confirm it matches the storyboard in `docs/planning.md`
4. If building a component, confirm it matches the component list in `docs/decisions.md`

## *** CRITICAL ***
*** ULTRATHINK BEFORE WRITING THE PRP ***
*** PLAN THE FULL IMPLEMENTATION BEFORE COMMITTING TO IT ***

## PRP Output

Write the PRP to `prp/prp-<###>-<description>.md` with this structure:

```markdown
# PRP-###: <Feature Name>

## Source
- Init file: init/<filename>.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
One clear sentence describing what will be built.

## Scope
- Files to CREATE: list each with path
- Files to MODIFY: list each with path and what changes
- Files NOT touched: confirm what stays unchanged

## Remotion Patterns Used
List which patterns from docs/task.md apply (typewriter, spring, stagger, etc.)

## Implementation Steps
Numbered, atomic steps. Each step = one logical unit of work.

1. ...
2. ...

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Renders correctly in Remotion Studio (no errors in console)
- [ ] Matches timing spec in docs/planning.md (±1 second)
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
X/10 — brief note on any uncertainty
```

## After Writing
Tell the human:
- Where the PRP was saved
- Your confidence score and why
- Any decisions that need human confirmation before execution
