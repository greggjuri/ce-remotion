# PRP-009: Scene 5 — The Payoff

## Source
- Init file: init/init-009-scene05-payoff.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 5 (~15s) — the payoff scene mirroring Scene 1's prompt but with CE in place, showing a targeted response, a code diff, and a green ✓ with "Right answer. First time."

## Scope
- Files to CREATE:
  - `src/scenes/Scene05Payoff.tsx` — the scene component
- Files to MODIFY:
  - `src/Root.tsx` — register `Scene05` standalone preview; update Master `durationInFrames` to 2295 (1845 + 450)
  - `src/Master.tsx` — add `scene05` to TIMINGS (from: 1845, duration: 450) and as fifth Sequence
- Files NOT touched:
  - All components — unchanged (reuses existing `<Terminal />` and `<CodeDiff />`)
  - Existing scenes — unchanged
  - All demo files — unchanged

## Remotion Patterns Used
- **Terminal component** (existing) — with `startFrame={25}`, `charsPerSecond={22}`, `outputDelayFrames={8}`
- **CodeDiff component** (existing) — with `enterFrame={0}`, `lineDelayFrames={4}`, wrapped in `<Sequence from={160}>` to delay entrance
- **Spring slide-in** (task.md) — for the green ✓, `damping: 200, stiffness: 150`
- **Fade in** (task.md) — for headline (with scale), caption
- **Easing** — `Easing.out(Easing.cubic)` for headline scale entrance
- **AbsoluteFill** — dark background, absolute positioning

## Implementation Steps

### Step 1: Create `src/scenes/Scene05Payoff.tsx`

**Layout:** All elements use `position: absolute` within an `AbsoluteFill` with `backgroundColor: '#0f172a'`.

**Coordinate system (1920×1080):**
- Headline: centered at y=100
- Terminal: centered, top=200, width=1200px
- CodeDiff: centered, top=520, width=1200px (wrapped in `<Sequence from={160}>`)
- ✓ symbol: centered at y=870
- Caption: centered at y=940

**Headline (frames 0–25):**
```tsx
const headlineProgress = interpolate(frame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.cubic),
});
const headlineScale = interpolate(headlineProgress, [0, 1], [0.92, 1]);
const headlineOpacity = headlineProgress;
```
- Text: `"Now, with CE in place."`
- Inter 700, 48px, color `#e2e8f0`

**Terminal (frame 0, typing at frame 25):**
Render directly (no Sequence) — spring entrance starts at frame 0 (concurrent with headline). Typing starts at `startFrame={25}`.
```tsx
const terminalLines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: '✓ Reading CLAUDE.md...' },
  { type: 'output', text: '✓ Stack: Next.js + Prisma + TypeScript' },
  { type: 'output', text: '✓ Auth pattern: JWT with refresh tokens' },
  { type: 'output', text: '' },
  { type: 'output', text: 'Refactoring src/lib/auth.ts...' },
];
```
Props: `startFrame={25}`, `charsPerSecond={22}`, `outputDelayFrames={8}`, `width="1200px"`, `height="auto"`.

**CodeDiff (frame 160):**
Wrap in `<Sequence from={160}>` so the CodeDiff's spring entrance and line stagger begin at scene frame 160. Pass `enterFrame={0}`, `lineDelayFrames={4}`.
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
Width container: 1200px, centered, top=520.

**Green ✓ (frame 330):**
```tsx
const checkLocalFrame = Math.max(0, frame - 330);
const checkSpring = spring({
  frame: checkLocalFrame,
  fps,
  config: { damping: 200, stiffness: 150 },
});
const checkTranslateY = interpolate(checkSpring, [0, 1], [20, 0]);
const checkOpacity = interpolate(checkSpring, [0, 1], [0, 1]);
```
- Before frame 330: invisible
- `✓` character, 72px, `#22c55e`, centered at y=870

**Caption (frame 350):**
```tsx
const captionLocalFrame = Math.max(0, frame - 350);
const captionOpacity = interpolate(captionLocalFrame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Before frame 350: invisible
- Text: `"Right answer. First time."`
- Inter 600, 28px, color `#e2e8f0`, centered at y=940

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
});
```

### Step 2: Modify `src/Master.tsx`

Update TIMINGS and add Scene05 Sequence:
```tsx
const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 645 },
  scene04: { from: 1245, duration: 600 },
  scene05: { from: 1845, duration: 450 },
};
```

### Step 3: Modify `src/Root.tsx`

1. Import `Scene05Payoff` and register standalone preview:
   ```tsx
   <Composition
     id="Scene05"
     component={Scene05Payoff}
     durationInFrames={450}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
2. Update Master `durationInFrames` to `2295`.

### Step 4: Verify in Remotion Studio

Select `Scene05` and verify:
- Dark background, headline scales/fades in
- Terminal springs in, types the same prompt, gets targeted CE-aware response
- CodeDiff slides up at frame 160 with red/green diff lines staggering in
- Green ✓ springs in at frame 330
- Caption fades in at frame 350
- Everything holds through frame 450

Then select `Master` and verify Scene05 plays after Scene04.

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas
- [ ] Headline "Now, with CE in place." scales/fades in (0.92→1.0) at frame 0, Inter 700 48px `#e2e8f0`
- [ ] Terminal springs in, title "bash", width 1200px
- [ ] Same prompt types out: `claude "refactor the auth module"` at 22 cps, startFrame 25
- [ ] Output lines show CE-aware response with `outputDelayFrames={8}` stagger
- [ ] CodeDiff slides up at frame 160 via `<Sequence from={160}>`
- [ ] Diff lines show correct content (removed jsonwebtoken, added jose + prisma + auth function)
- [ ] Diff lines stagger with 4-frame delay
- [ ] Green ✓ springs in at frame 330, color `#22c55e`, 72px, damping 200 stiffness 150
- [ ] Caption "Right answer. First time." fades in at frame 350, Inter 600 28px `#e2e8f0`
- [ ] Everything holds cleanly through frame 450
- [ ] Scene05 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene05 plays after Scene04 (from: 1845), total duration 2295
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. Reuses proven Terminal and CodeDiff components. The only nuance is wrapping CodeDiff in `<Sequence from={160}>` to delay its entrance — this resets the child's frame to 0 at scene frame 160, which is the correct approach. The layout is straightforward absolute positioning with centered elements.
