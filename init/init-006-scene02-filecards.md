# init-006: Scene 2 — The CE Files

## Overview
Build Scene 2 (~7 seconds) — a light background scene where the four CE file cards
animate in one by one, introducing the CE system as the solution to Scene 1's problem.
This is the "here's what changes everything" moment.

## Reference Files
- `docs/decisions.md` — colors, fonts, scene timing
- `docs/task.md` — spring animations, stagger pattern
- `docs/planning.md` — Scene 2 storyboard (2×2 grid, spring entrance per card)

---

## What To Build

### Files to create
- `src/scenes/Scene02FileCards.tsx`

### Files to modify
- `src/Root.tsx` — register `Scene02` standalone preview composition
- `src/Master.tsx` — add Scene02 as second Sequence after Scene01

---

## Scene Spec

### Duration
210 frames (7 seconds at 30fps)

### Background
`#f8fafc` — full canvas light background (AbsoluteFill)

---

## Animation Sequence

### Phase 1: Headline (frames 0–40)
- Text fades and scales in: `"The fix? Give Claude context."`
- Inter 700, 48px, color `#1e293b`
- Centered horizontally, positioned ~200px from top of canvas
- Scale from 0.92 → 1.0, opacity 0 → 1 over 25 frames
- Use `Easing.out(Easing.cubic)`

### Phase 2: Cards animate in (frames 40–130)
Four FileCards spring in to a 2×2 grid, centered on the canvas:

| Card | filename | description | icon | enterFrame |
|---|---|---|---|---|
| Top-left | `CLAUDE.md` | `Project rules & conventions` | `rules` | 40 |
| Top-right | `decisions.md` | `Confirmed architectural choices` | `decisions` | 60 |
| Bottom-left | `task.md` | `Technical gotchas & patterns` | `task` | 80 |
| Bottom-right | `PRP` | `Scoped task with acceptance criteria` | `prp` | 100 |

Grid layout:
- Card size: 380px × 200px
- Gap between cards: 32px horizontal, 28px vertical
- Grid centered horizontally and vertically (accounting for headline above)
- Grid top edge should sit ~80px below the headline text

### Phase 3: Subtitle fades in (frames 140–170)
- Text: `"A structured information environment for every session."`
- Inter 400, 20px, color `#64748b`
- Centered below the grid, ~40px below bottom card edge
- Fade in over 20 frames

### Phase 4: Hold (frames 170–210)
- Everything holds. Scene ends cleanly.

---

## Layout Geometry
All values are for 1920×1080 canvas:

- Headline: centered at x=960, y=180
- Grid center: x=960, y=580
- Grid total width: 380 + 32 + 380 = 792px → left edge at x=564
- Grid total height: 200 + 28 + 200 = 428px → top edge at y=366
- Card positions (top-left corner of each card):
  - Top-left:     x=564, y=366
  - Top-right:    x=976, y=366
  - Bottom-left:  x=564, y=594
  - Bottom-right: x=976, y=594
- Subtitle: centered at x=960, y=848

Use `position: absolute` for all elements within an `AbsoluteFill` container,
so layout is precise and not subject to flexbox reflow.

---

## Master.tsx Update

Add Scene02 to TIMINGS and as a Sequence. Scene01 ends at its current duration
(use the actual value from the existing TIMINGS.scene01.duration):

```tsx
const TIMINGS = {
  scene01: { from: 0,                                    duration: <existing> },
  scene02: { from: <scene01.from + scene01.duration>,    duration: 210 },
};
```

Update Master `durationInFrames` in Root.tsx to `TIMINGS.scene01.duration + 210`.

---

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas
- [ ] Headline `"The fix? Give Claude context."` fades/scales in at frame 0, Inter 700 48px `#1e293b`
- [ ] All four FileCards spring in at correct staggered enterFrames (40, 60, 80, 100)
- [ ] Cards arranged in correct 2×2 grid layout with 32px/28px gaps
- [ ] Cards use correct filenames, descriptions, icons and accent colors
- [ ] Subtitle `"A structured information environment for every session."` fades in at frame 140
- [ ] Everything holds cleanly through frame 210
- [ ] Scene02 visible as standalone composition in Remotion Studio
- [ ] Master composition updated — Scene02 plays after Scene01 with no gap
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
