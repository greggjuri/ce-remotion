# planning.md — ce-remotion

Scene-by-scene storyboard, timing breakdown, and content plan.

---

## Overall Structure

| Scene | Title | Duration | Style |
|---|---|---|---|
| 1 | The Problem | ~8s | Dark / Terminal |
| 2 | The CE Files | ~7s | Light / Cards |
| 3 | CLAUDE.md Deep Dive | ~15s | Dark / Terminal |
| 4 | The PRP Workflow | ~20s | Light / Diagram |
| 5 | The Payoff | ~15s | Dark + Light split |
| 6 | Outro | ~10s | Light / Brand |
| **Total** | | **~75s** | |

---

## Scene 1 — The Problem (~8s)

**Goal:** Show what AI-assisted coding looks like *without* context engineering.

**Visual:**
- macOS-style dark terminal window slides in
- Typewriter: `claude "refactor the auth module"`
- Simulated AI response appears: generic, wrong assumptions, misses the project stack
- Red ✗ appears with label: *"AI without context is just autocomplete."*

**Key message:** Vague prompts produce vague results.

---

## Scene 2 — The CE Files (~7s)

**Goal:** Introduce the four CE artifacts as a system.

**Visual:**
- Light background
- Four file cards animate in one by one with a spring entrance:
  1. `CLAUDE.md` — *"Project rules & conventions"*
  2. `decisions.md` — *"Confirmed architectural choices"*
  3. `task.md` — *"Technical gotchas & patterns"*
  4. `PRP` — *"Scoped task with acceptance criteria"*
- Cards land in a 2×2 grid, each with an icon and one-line description

**Key message:** CE is a structured information environment, not just a prompt.

---

## Scene 3 — CLAUDE.md Deep Dive (~15s)

**Goal:** Show what a real CLAUDE.md looks like and what each section does.

**Visual:**
- Dark terminal window fills the frame
- File contents type out section by section:
  - `## Project Overview` — project name and goal
  - `## Stack` — tech choices
  - `## Code Principles` — conventions
  - `## Git Workflow` — auto-commit rule
- Annotation arrows (with labels) point at key sections as they appear

**Key message:** CLAUDE.md is the source of truth for every Claude Code session.

---

## Scene 4 — The PRP Workflow (~20s)

**Goal:** Explain the full CE loop: init → PRP → execute → commit.

**Visual:**
- Light background diagram
- Nodes animate in and connect sequentially:
  1. `Human + Claude.ai` → writes `init file`
  2. `init file` → `/generate-prp` → `PRP`
  3. `Human` reviews PRP → approves
  4. `Claude Code` runs `/execute-prp` → code written
  5. `git commit + push` → auto on completion
- Active node glows indigo as the flow progresses
- Arrows draw themselves between nodes

**Key message:** CE is a workflow, not just a file format.

---

## Scene 5 — The Payoff (~15s)

**Goal:** Show the same task from Scene 1, this time with CE in place.

**Visual:**
- Split: left side dark terminal (same prompt as Scene 1), right side light panel showing context files loaded
- Typewriter: `claude "refactor the auth module"` again
- This time: targeted, accurate response — references the actual stack and conventions
- Green ✓ with label: *"Right answer, first time."*
- Brief animated diff showing clean, context-aware output

**Key message:** Context engineering makes Claude Code behave like a senior dev who already knows your project.

---

## Scene 6 — Outro (~10s)

**Goal:** Brand close with call to action.

**Visual:**
- Clean light background
- `jurigregg.com` logo / wordmark fades in
- Text animates in: *"Context Engineering with Claude Code"*
- Subtext: *"Full guide at jurigregg.com"*
- Subtle fade to white

---

## Build Order (recommended)

Build scenes in this order to maximize reuse:

1. **Components first:** `Terminal`, `FileCard`, `DiagramNode`, `AnimatedArrow`, `CodeDiff`
2. **Scene 1** — validates Terminal component
3. **Scene 2** — validates FileCard component
4. **Scene 3** — extends Terminal with annotations
5. **Scene 4** — validates DiagramNode + AnimatedArrow
6. **Scene 5** — reuses Terminal + CodeDiff
7. **Scene 6** — simple, quick
8. **Master.tsx** — wire all scenes together with TIMINGS
