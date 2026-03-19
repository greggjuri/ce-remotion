# PRP-010: Scene 6 — Outro

## Source
- Init file: init/init-010-scene06-outro.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 6 (~10s) — a clean light outro with the video title "Context Engineering", subtitle "with Claude Code", domain "jurigregg.com", and a fade to white ending.

## Scope
- Files to CREATE:
  - `src/scenes/Scene06Outro.tsx` — the scene component
- Files to MODIFY:
  - `src/Root.tsx` — register `Scene06` standalone preview; update Master `durationInFrames` to 2595 (2295 + 300)
  - `src/Master.tsx` — add `scene06` to TIMINGS (from: 2295, duration: 300) and as sixth Sequence
- Files NOT touched:
  - All components — unchanged
  - Existing scenes — unchanged
  - All demo files — unchanged

## Remotion Patterns Used
- **Fade in** (task.md) — for accent line (via width scale), title, subtitle, domain, and fade-to-white overlay
- **AbsoluteFill** — light background, absolute positioning, white overlay for fade out

## Implementation Steps

### Step 1: Create `src/scenes/Scene06Outro.tsx`

**Layout:** All elements use `position: absolute` within an `AbsoluteFill` with `backgroundColor: '#f8fafc'`. All text centered at x=960 via `left: '50%', transform: 'translateX(-50%)'`.

**Accent line (frames 0–20):**
```tsx
const lineWidth = interpolate(frame, [0, 20], [0, 80], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- 3px tall, `#6366f1`, centered at y=420
- Use `width: lineWidth` on a div, centered via `left: '50%', transform: 'translateX(-50%)'`

**Main title (frames 20–45):**
```tsx
const titleLocalFrame = Math.max(0, frame - 20);
const titleOpacity = interpolate(titleLocalFrame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"Context Engineering"`
- Inter 800, 72px, color `#1e293b`, centered at y=500
- Before frame 20: invisible

**Subtitle (frames 45–70):**
```tsx
const subtitleLocalFrame = Math.max(0, frame - 45);
const subtitleOpacity = interpolate(subtitleLocalFrame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"with Claude Code"`
- Inter 400, 36px, color `#6366f1`, centered at y=580
- Before frame 45: invisible

**Domain (frames 90–115):**
```tsx
const domainLocalFrame = Math.max(0, frame - 90);
const domainOpacity = interpolate(domainLocalFrame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"jurigregg.com"`
- Inter 500, 22px, color `#94a3b8`, centered at y=660
- Before frame 90: invisible

**Fade to white (frames 270–300):**
```tsx
const fadeLocalFrame = Math.max(0, frame - 270);
const fadeOpacity = interpolate(fadeLocalFrame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- White `AbsoluteFill` overlay on top of everything, `backgroundColor: '#ffffff'`, `opacity: fadeOpacity`
- Only render when `frame >= 270`

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '500', '800'],
  subsets: ['latin'],
});
```

### Step 2: Modify `src/Master.tsx`

Update TIMINGS and add Scene06 Sequence:
```tsx
const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 645 },
  scene04: { from: 1245, duration: 600 },
  scene05: { from: 1845, duration: 450 },
  scene06: { from: 2295, duration: 300 },
};
```

Remove the `// remaining scenes` comment — all scenes are now implemented.

### Step 3: Modify `src/Root.tsx`

1. Import `Scene06Outro` and register standalone preview:
   ```tsx
   <Composition
     id="Scene06"
     component={Scene06Outro}
     durationInFrames={300}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
2. Update Master `durationInFrames` to `2595`.

### Step 4: Verify in Remotion Studio

Select `Scene06` and verify:
- Light background
- Accent line scales in from 0 to 80px at frame 0
- "Context Engineering" fades in at frame 20
- "with Claude Code" fades in at frame 45
- "jurigregg.com" fades in at frame 90
- Everything holds from 120 to 270
- Canvas fades to white over frames 270–300
- Clean white at final frame

Then select `Master` and verify the full 6-scene video plays end to end.

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas
- [ ] Indigo accent line (80px × 3px, `#6366f1`) scales in from 0 width at frame 0
- [ ] "Context Engineering" fades in at frame 20, Inter 800 72px `#1e293b`
- [ ] "with Claude Code" fades in at frame 45, Inter 400 36px `#6366f1`
- [ ] "jurigregg.com" fades in at frame 90, Inter 500 22px `#94a3b8`
- [ ] Everything holds cleanly from frame 120 through frame 270
- [ ] Canvas fades to white over frames 270–300 (white overlay, opacity 0→1)
- [ ] Scene06 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene06 plays after Scene05 (from: 2295), total duration 2595
- [ ] All 6 scenes play end-to-end in Master composition
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
10/10 — Very high confidence. The simplest scene in the video — four fade-in text elements, a scaling line, and a white overlay fade. No components to reuse, no complex layout, no coordinate math. Pure animation basics.
