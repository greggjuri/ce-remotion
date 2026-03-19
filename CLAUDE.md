# CLAUDE.md — ce-remotion

## Project Overview
A Remotion video explaining Context Engineering (CE) fundamentals with Claude Code.
Covers CLAUDE.md, decisions.md, task.md, and PRPs. Published to jurigregg.com blog.

## Stack
- Remotion 4.x with React + TypeScript
- Tailwind CSS (via Remotion's Tailwind integration)
- Fonts: JetBrains Mono (terminal scenes), Inter (diagram scenes)
- Node.js via nvm on MacBook Air M1

## Directory Structure
```
ce-remotion/
├── CLAUDE.md                    # This file — rules for Claude Code
├── docs/
│   ├── decisions.md             # Confirmed architectural/design decisions
│   ├── task.md                  # Technical gotchas and implementation notes
│   ├── planning.md              # Scene storyboard and video structure
│   └── testing.md               # Testing and review checklist
├── init/                        # Feature specs (human + Claude.ai authored)
├── prp/                         # PRPs (Code generates, human reviews)
├── .claude/
│   └── commands/
│       ├── generate-prp.md
│       └── execute-prp.md
├── src/
│   ├── Root.tsx                 # Registers all compositions
│   ├── Master.tsx               # Master composition — assembles all scenes
│   ├── scenes/                  # One file per scene
│   │   ├── Scene01Problem.tsx
│   │   ├── Scene02FileCards.tsx
│   │   ├── Scene03ClaudeMD.tsx
│   │   ├── Scene04PRPFlow.tsx
│   │   ├── Scene05Payoff.tsx
│   │   └── Scene06Outro.tsx
│   └── components/              # Reusable components
│       ├── Terminal.tsx
│       ├── FileCard.tsx
│       ├── DiagramNode.tsx
│       ├── AnimatedArrow.tsx
│       └── CodeDiff.tsx
├── public/                      # Static assets (logos, fonts)
├── out/                         # Rendered video output (gitignored)
└── README.md
```

## Required Reading
Before ANY task, read these files in order:
1. `docs/decisions.md` — confirmed decisions, never override these
2. `docs/task.md` — technical gotchas, patterns to follow
3. `docs/planning.md` — scene structure and timing reference
4. The current `init/` file for the feature being built

## Git Workflow
After EVERY completed feature (scene, component, or fix):
```bash
git add -A && git commit -m "feat: <description>" && git push origin main
```
This is non-negotiable. Every scene and component completion gets its own commit.
Use conventional commit format: feat, fix, refactor, docs, style, chore.

## Code Principles
- One component per file, exported as named export
- Use `useCurrentFrame()` and `useVideoConfig()` for all animation — no timers, no useEffect
- Use `interpolate()` with `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` always
- Use `spring()` for entrance animations with high damping to eliminate bounce
- Never hardcode frame numbers — derive from fps × seconds
- Keep scenes self-contained; Master.tsx handles sequencing only
- Tailwind for layout only — animations always via inline styles

## Composition Specs
- Width: 1920, Height: 1080 (16:9)
- FPS: 30
- Total target: ~75 seconds (2250 frames)
- Render command: `npx remotion render Master out/ce-remotion.mp4`
