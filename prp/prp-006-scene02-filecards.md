# PRP-006: Scene 2 — The CE Files

## Source
- Init file: init/init-006-scene02-filecards.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 2 (~7s) — a light background scene where four CE file cards animate in to a 2x2 grid with a headline above and subtitle below, introducing the CE system as the answer to Scene 1's problem.

## Scope
- Files to CREATE:
  - `src/scenes/Scene02FileCards.tsx` — the scene component
- Files to MODIFY:
  - `src/Root.tsx` — register `Scene02` standalone preview composition; update Master `durationInFrames` to 540 (330 + 210)
  - `src/Master.tsx` — add `scene02` to TIMINGS and as second Sequence
- Files NOT touched:
  - All components — unchanged (reuses existing `<FileCard />`)
  - `src/scenes/Scene01Problem.tsx` — unchanged
  - All demo files — unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **FileCard component** (existing) — with staggered `enterFrame` values (40, 60, 80, 100)
- **Fade in** (task.md) — for headline (with scale) and subtitle
- **Easing** — `Easing.out(Easing.cubic)` for headline scale entrance
- **AbsoluteFill** — light background, absolute positioning for all elements

## Implementation Steps

### Step 1: Create `src/scenes/Scene02FileCards.tsx`

Use `AbsoluteFill` with `backgroundColor: '#f8fafc'`. All elements use `position: absolute` with exact pixel coordinates from the init spec.

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
- Text: `"The fix? Give Claude context."`
- Inter 700, 48px, color `#1e293b`
- Centered at x=960, y=180 (use `left: '50%', transform: 'translateX(-50%)'`, `top: 180`)

**Cards (frames 40–100):**
Four FileCard instances at exact positions:

| Position | filename | description | icon | enterFrame | left | top |
|---|---|---|---|---|---|---|
| Top-left | `CLAUDE.md` | `Project rules & conventions` | `rules` | 40 | 564 | 366 |
| Top-right | `decisions.md` | `Confirmed architectural choices` | `decisions` | 60 | 976 | 366 |
| Bottom-left | `task.md` | `Technical gotchas & patterns` | `task` | 80 | 564 | 594 |
| Bottom-right | `PRP` | `Scoped task with acceptance criteria` | `prp` | 100 | 976 | 594 |

Each card wrapped in a `<div style={{ position: 'absolute', left, top }}>`.

**Subtitle (frames 140–160):**
```tsx
const subtitleLocalFrame = Math.max(0, frame - 140);
const subtitleOpacity = interpolate(subtitleLocalFrame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"A structured information environment for every session."`
- Inter 400, 20px, color `#64748b`
- Centered at x=960, y=848
- Before frame 140: invisible (`opacity: 0`)

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});
```

### Step 2: Modify `src/Master.tsx`

Update TIMINGS and add Scene02 Sequence:
```tsx
const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 210 },
};
```

Add Scene02 import and Sequence:
```tsx
<Sequence from={TIMINGS.scene02.from} durationInFrames={TIMINGS.scene02.duration}>
  <Scene02FileCards />
</Sequence>
```

### Step 3: Modify `src/Root.tsx`

1. Import `Scene02FileCards` and register standalone preview:
   ```tsx
   <Composition
     id="Scene02"
     component={Scene02FileCards}
     durationInFrames={210}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
2. Update Master `durationInFrames` to `540` (330 + 210).

### Step 4: Verify in Remotion Studio

Select `Scene02` in Studio and verify:
- Light `#f8fafc` background
- Headline fades/scales in over first 25 frames
- Cards spring in at frames 40, 60, 80, 100 — no bounce
- 2x2 grid layout matches spec (32px horizontal gap, 28px vertical gap)
- Subtitle fades in at frame 140
- Everything holds through frame 210

Then select `Master` and verify Scene02 plays immediately after Scene01.

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas (AbsoluteFill)
- [ ] Headline "The fix? Give Claude context." fades/scales in (0.92→1.0) at frame 0, Inter 700 48px `#1e293b`
- [ ] Headline uses `Easing.out(Easing.cubic)` for the entrance
- [ ] All four FileCards spring in at correct staggered enterFrames (40, 60, 80, 100)
- [ ] Cards arranged in correct 2x2 grid: 380x200 cards, 32px horizontal gap, 28px vertical gap
- [ ] Card positions match spec: TL(564,366), TR(976,366), BL(564,594), BR(976,594)
- [ ] Cards use correct filenames, descriptions, icons (rules, decisions, task, prp)
- [ ] Subtitle "A structured information environment for every session." fades in at frame 140, Inter 400 20px `#64748b`
- [ ] Everything holds cleanly through frame 210
- [ ] Scene02 visible as standalone composition in Remotion Studio
- [ ] Master composition updated — Scene02 plays after Scene01 (from: 330), total duration 540
- [ ] TIMINGS constant in Master.tsx updated with scene02
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
10/10 — Very high confidence. The init spec provides exact pixel coordinates for every element. The FileCard component already handles its own animation. The scene is pure layout + three simple animations (headline scale/fade, card stagger via FileCard props, subtitle fade). No new components, no complex logic.
