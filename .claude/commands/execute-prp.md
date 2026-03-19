# /execute-prp

Execute an approved PRP to implement a ce-remotion feature.

## Usage
/execute-prp prp/<filename>.md

## Required Reading — Do This First
Before writing any code, read ALL of these in order:
1. `CLAUDE.md` — rules, structure, git workflow
2. `docs/decisions.md` — confirmed decisions (never override)
3. `docs/task.md` — Remotion animation patterns and gotchas
4. The PRP file specified in $ARGUMENTS

## Pre-Execution Checklist
- [ ] PRP has been reviewed and approved by human
- [ ] All files listed in PRP "Scope" section are accounted for
- [ ] No decisions in the PRP conflict with `docs/decisions.md`

## *** CRITICAL ***
*** ULTRATHINK BEFORE WRITING ANY CODE ***
*** FOLLOW THE PRP STEPS EXACTLY — DO NOT IMPROVISE ***

## Execution Rules

### Remotion-Specific
- Every animated value MUST use `useCurrentFrame()` — no timers or effects
- Always clamp `interpolate()` — extrapolateLeft and extrapolateRight: 'clamp'
- Use `spring()` with `damping: 200, stiffness: 100` for entrances (no bounce)
- Never hardcode frame numbers — use `fps × seconds`
- Test each component in isolation before wiring into Master.tsx

### Code Quality
- One component per file, named export
- TypeScript — no `any` types
- Tailwind for layout only, inline styles for all animation
- Follow naming conventions from CLAUDE.md

### Verification
After implementing each step, verify in Remotion Studio:
- No TypeScript/console errors
- Animation plays correctly from frame 0
- No elements visible before their entrance
- Timing matches docs/planning.md spec

## Post-Execution — MANDATORY

### 1. Run acceptance criteria
Check off every item in the PRP's Acceptance Criteria section.

### 2. Git commit and push
```bash
git add -A && git commit -m "feat: <short description of what was built>" && git push origin main
```
This is required. Do not skip. Do not ask — just do it.

### 3. Report to human
- What was built
- Files created/modified
- Confirmation that git push succeeded
- Any deviations from the PRP (and why)
- What the next init file should cover
