# init-010: Scene 6 — Outro

## Overview
Build Scene 6 (~10 seconds) — a clean light background outro that closes the video
with the jurigregg.com brand, the video title, and a call to action. Simple, elegant,
no animation complexity. Let the message land cleanly.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs
- `docs/task.md` — fade in pattern
- `docs/planning.md` — Scene 6 storyboard

---

## What To Build

### Files to create
- `src/scenes/Scene06Outro.tsx`

### Files to modify
- `src/Root.tsx` — register `Scene06` standalone preview, update Master duration
- `src/Master.tsx` — add Scene06 to TIMINGS as sixth and final Sequence

---

## Scene Spec

### Duration
300 frames (10 seconds at 30fps)

### Background
`#f8fafc` — full canvas light background

---

## Animation Sequence

### Phase 1: Indigo accent line (frames 0–20)
- A horizontal line, 80px wide, 3px tall, color `#6366f1`
- Centered at x=960, y=420
- Scales in from width 0 → 80px over 20 frames
- Use `interpolate(frame, [0, 20], [0, 80], { extrapolateRight: 'clamp' })`

### Phase 2: Main title (frames 20–50)
- Text: `"Context Engineering"`
- Inter 800, 72px, color `#1e293b`
- Centered at x=960, y=500
- Fade in over 25 frames starting at frame 20

### Phase 3: Subtitle (frames 45–70)
- Text: `"with Claude Code"`
- Inter 400, 36px, color `#6366f1`
- Centered at x=960, y=580
- Fade in over 25 frames starting at frame 45

### Phase 4: Domain (frames 90–120)
- Text: `"jurigregg.com"`
- Inter 500, 22px, color `#94a3b8`
- Centered at x=960, y=660
- Fade in over 25 frames starting at frame 90

### Phase 5: Hold (frames 120–270)
- Everything holds cleanly for ~5 seconds

### Phase 6: Fade to white (frames 270–300)
- Entire canvas fades to white: overlay div, white background, opacity 0→1 over 30 frames
- Clean ending

---

## Layout (absolute positioning)
- Canvas: 1920×1080, background `#f8fafc`
- Accent line: centered x=960, y=420
- Main title: centered x=960, y=500
- Subtitle: centered x=960, y=580
- Domain: centered x=960, y=660
- Fade overlay: AbsoluteFill, white, z-index above all

---

## Master.tsx Update

```tsx
const TIMINGS = {
  scene01: { from: 0,    duration: 330  },
  scene02: { from: 330,  duration: 270  },
  scene03: { from: 600,  duration: 645  },
  scene04: { from: 1245, duration: 600  },
  scene05: { from: 1845, duration: 450  },
  scene06: { from: 2295, duration: 300  },
};
```

Update Master `durationInFrames` in Root.tsx to `2295 + 300 = 2595`.

---

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas
- [ ] Indigo accent line (80px × 3px, `#6366f1`) scales in at frame 0
- [ ] "Context Engineering" fades in at frame 20, Inter 800 72px `#1e293b`
- [ ] "with Claude Code" fades in at frame 45, Inter 400 36px `#6366f1`
- [ ] "jurigregg.com" fades in at frame 90, Inter 500 22px `#94a3b8`
- [ ] Everything holds cleanly through frame 270
- [ ] Canvas fades to white over frames 270–300
- [ ] Scene06 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene06 plays after Scene05 (from: 2295), total duration 2595
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
