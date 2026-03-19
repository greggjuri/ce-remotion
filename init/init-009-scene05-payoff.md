# init-009: Scene 5 — The Payoff

## Overview
Build Scene 5 (~15 seconds) — the payoff scene that mirrors Scene 1 but with CE in
place. The same vague prompt now produces a targeted, accurate response. A side-by-side
comparison shows the CodeDiff before/after, ending with a green ✓ and a strong closer.

## Reference Files
- `docs/decisions.md` — colors, fonts, scene timing
- `docs/task.md` — typewriter, spring, fade patterns
- `docs/planning.md` — Scene 5 storyboard

---

## What To Build

### Files to create
- `src/scenes/Scene05Payoff.tsx`

### Files to modify
- `src/Root.tsx` — register `Scene05` standalone preview, update Master duration
- `src/Master.tsx` — add Scene05 to TIMINGS as fifth Sequence

---

## Scene Spec

### Duration
450 frames (15 seconds at 30fps)

### Background
`#0f172a` — full canvas dark background

---

## Animation Sequence

### Phase 1: Headline (frames 0–25)
- Text: `"Now, with CE in place."`
- Inter 700, 48px, color `#e2e8f0`
- Centered at x=960, y=100
- Scale 0.92→1.0, opacity 0→1 over 25 frames, Easing.out(Easing.cubic)

### Phase 2: Terminal enters (frames 15–120)
- Terminal window springs in at frame 15
- Title: `"bash"`, width: `"1200px"`
- Same prompt as Scene 1 types out, but this time the response is targeted:

```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: '✓ Reading CLAUDE.md...' },
  { type: 'output', text: '✓ Stack: Next.js + Prisma + TypeScript' },
  { type: 'output', text: '✓ Auth pattern: JWT with refresh tokens' },
  { type: 'output', text: '' },
  { type: 'output', text: 'Refactoring src/lib/auth.ts...' },
];
```

- `startFrame={25}`, `charsPerSecond={22}`, `outputDelayFrames={8}`
- Terminal positioned at: centered horizontally, y=200

### Phase 3: CodeDiff slides up (frames 160–300)
- CodeDiff block slides up from below the terminal
- `enterFrame={160}`, `lineDelayFrames={4}`
- Width: 1200px, centered horizontally below terminal, y=520

```tsx
const diffLines: DiffLine[] = [
  { type: 'header',  text: '// src/lib/auth.ts — refactored with context' },
  { type: 'removed', text: 'import jwt from "jsonwebtoken";' },
  { type: 'added',   text: 'import { SignJWT, jwtVerify } from "jose";' },
  { type: 'added',   text: 'import { db } from "@/lib/prisma";' },
  { type: 'context', text: '' },
  { type: 'added',   text: 'export async function refreshToken(userId: string) {' },
  { type: 'added',   text: '  const user = await db.user.findUnique({' },
  { type: 'added',   text: '    where: { id: userId },' },
  { type: 'added',   text: '  });' },
  { type: 'added',   text: '  return new SignJWT({ sub: userId })' },
  { type: 'added',   text: '    .setExpirationTime("1h")' },
  { type: 'added',   text: '    .sign(process.env.JWT_SECRET!);' },
  { type: 'added',   text: '}' },
];
```

### Phase 4: Green ✓ and caption (frames 330–380)
- Green ✓ springs in at frame 330
  - Font size: 72px, color `#22c55e`
  - Spring: `damping: 200, stiffness: 150`
  - translateY: 20→0, opacity: 0→1
  - Positioned: centered, below the CodeDiff block, y=900

- Caption fades in at frame 350:
  - Text: `"Right answer. First time."`
  - Inter 600, 28px, color `#e2e8f0`
  - Centered below the ✓, y=960
  - Fade in over 20 frames

### Phase 5: Hold (frames 380–450)
- Everything holds cleanly.

---

## Layout (absolute positioning)
- Canvas: 1920×1080, background `#0f172a`
- Headline: centered x=960, y=100
- Terminal: centered x=960, top=200, width=1200px
- CodeDiff: centered x=960, top=520, width=1200px
- ✓ symbol: centered x=960, y=870
- Caption: centered x=960, y=940

---

## Master.tsx Update

```tsx
const TIMINGS = {
  scene01: { from: 0,    duration: 330  },
  scene02: { from: 330,  duration: 270  },
  scene03: { from: 600,  duration: 645  },
  scene04: { from: 1245, duration: 600  },
  scene05: { from: 1845, duration: 450  },
};
```

Update Master `durationInFrames` in Root.tsx to `1845 + 450 = 2295`.

---

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas
- [ ] Headline "Now, with CE in place." scales/fades in at frame 0, Inter 700 48px `#e2e8f0`
- [ ] Terminal springs in at frame 15, title "bash", width 1200px
- [ ] Same prompt types out: `claude "refactor the auth module"`
- [ ] Output lines show CE-aware response (reading CLAUDE.md, correct stack references)
- [ ] CodeDiff slides up at frame 160 with correct diff lines (removed jsonwebtoken, added jose + prisma)
- [ ] Diff lines stagger in correctly with 4-frame delay
- [ ] Green ✓ springs in at frame 330, color `#22c55e`, 72px
- [ ] Caption "Right answer. First time." fades in at frame 350, Inter 600 28px `#e2e8f0`
- [ ] Everything holds cleanly through frame 450
- [ ] Scene05 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene05 plays after Scene04 (from: 1845), total duration 2295
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
