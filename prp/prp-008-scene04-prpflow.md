# PRP-008: Scene 4 — The PRP Workflow

## Source
- Init file: init/init-008-scene04-prpflow.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 4 (~20s) — a light background flowchart scene where 5 DiagramNodes and 4 AnimatedArrows animate in sequentially to show the CE workflow (init → PRP → execute → commit), with step labels and a caption.

## Scope
- Files to CREATE:
  - `src/scenes/Scene04PRPFlow.tsx` — the scene component
- Files to MODIFY:
  - `src/Root.tsx` — register `Scene04` standalone preview; update Master `durationInFrames` to 1845 (1245 + 600)
  - `src/Master.tsx` — add `scene04` to TIMINGS (from: 1245, duration: 600) and as fourth Sequence
- Files NOT touched:
  - All components — unchanged (reuses existing `<DiagramNode />` and `<AnimatedArrow />`)
  - Existing scenes — unchanged
  - All demo files — unchanged

## Remotion Patterns Used
- **DiagramNode component** (existing) — with staggered `enterFrame` values, `active` prop for Node 3, `width={300}` `height={90}` (non-default)
- **AnimatedArrow component** (existing) — with `drawDuration={25}`, connecting node edges
- **Fade in** (task.md) — for headline (with scale), step labels, and caption
- **Easing** — `Easing.out(Easing.cubic)` for headline scale entrance
- **AbsoluteFill** — light background, absolute positioning for all elements

## Implementation Steps

### Step 1: Create `src/scenes/Scene04PRPFlow.tsx`

**Layout:** AbsoluteFill with `backgroundColor: '#f8fafc'`, `position: relative` for arrow SVG overlays. All nodes and labels use `position: absolute`.

**Node data (300×90 nodes):**

| # | label | sublabel | icon | enterFrame | left | top | active |
|---|---|---|---|---|---|---|---|
| 1 | `Human + Claude.ai` | `writes init file` | `✍` | 40 | 310 | 380 | false |
| 2 | `init file` | `feature spec` | `📄` | 100 | 810 | 380 | false |
| 3 | `Claude Code` | `/generate-prp` | `⚡` | 160 | 1310 | 380 | true |
| 4 | `PRP` | `reviewed & approved` | `✓` | 220 | 1310 | 540 | false |
| 5 | `git push` | `auto on completion` | `🚀` | 280 | 810 | 540 | false |

Each wrapped in `<div style={{ position: 'absolute', left, top }}>`.

**Arrow data (drawDuration=25, color=#cbd5e1):**

| # | x1 | y1 | x2 | y2 | drawFrame | Notes |
|---|---|---|---|---|---|---|
| 1 | 610 | 425 | 810 | 425 | 70 | Node1 right → Node2 left |
| 2 | 1110 | 425 | 1310 | 425 | 130 | Node2 right → Node3 left |
| 3 | 1460 | 470 | 1460 | 540 | 190 | Node3 bottom → Node4 top (vertical) |
| 4 | 1310 | 585 | 1110 | 585 | 250 | Node4 left → Node5 right (right-to-left) |

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
- Text: `"The CE Workflow"`
- Inter 700, 48px, color `#1e293b`
- Centered at x=960, y=160

**Step labels (frames 300–390):**
Inline component or direct rendering, each fading in over 20 frames:

| # | text | x | y | appearFrame |
|---|---|---|---|---|
| 1 | `"1. Define the task"` | 460 | 680 | 300 |
| 2 | `"2. Generate a PRP"` | 1460 | 680 | 330 |
| 3 | `"3. Review & approve"` | 1460 | 740 | 360 |
| 4 | `"4. Execute & commit"` | 960 | 740 | 390 |

Each: Inter 400, 16px, color `#64748b`, centered on their x position.

**Caption (frames 440–465):**
```tsx
const captionLocalFrame = Math.max(0, frame - 440);
const captionOpacity = interpolate(captionLocalFrame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"Every feature. Same process. Always."`
- Inter 600, 26px, color `#1e293b`
- Centered at x=960, y=860

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});
```

### Step 2: Modify `src/Master.tsx`

Update TIMINGS and add Scene04 Sequence:
```tsx
const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 645 },
  scene04: { from: 1245, duration: 600 },
};
```

### Step 3: Modify `src/Root.tsx`

1. Import `Scene04PRPFlow` and register standalone preview:
   ```tsx
   <Composition
     id="Scene04"
     component={Scene04PRPFlow}
     durationInFrames={600}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
2. Update Master `durationInFrames` to `1845`.

### Step 4: Verify in Remotion Studio

Select `Scene04` and verify:
- Light background, headline scales/fades in
- Nodes spring in sequentially at 60-frame intervals: 40, 100, 160, 220, 280
- Node 3 (Claude Code) has indigo active glow
- Arrows draw between correct node pairs at correct frames
- Arrow 3 is vertical, Arrow 4 goes right-to-left
- Step labels fade in staggered at 300, 330, 360, 390
- Caption fades in at 440
- Everything holds through 600

Then select `Master` and verify Scene04 plays after Scene03.

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas
- [ ] Headline "The CE Workflow" scales/fades in (0.92→1.0) at frame 0, Inter 700 48px `#1e293b`
- [ ] All 5 nodes render with correct labels, sublabels, icons at correct positions
- [ ] Nodes are 300×90 (non-default DiagramNode size)
- [ ] Nodes spring in at correct frames: 40, 100, 160, 220, 280 (60-frame intervals)
- [ ] Node 3 (Claude Code) has active indigo glow
- [ ] Arrow 1: horizontal, Node1 right → Node2 left, drawFrame 70
- [ ] Arrow 2: horizontal, Node2 right → Node3 left, drawFrame 130
- [ ] Arrow 3: vertical, Node3 bottom → Node4 top, drawFrame 190
- [ ] Arrow 4: horizontal right-to-left, Node4 left → Node5 right, drawFrame 250
- [ ] All arrows: drawDuration=25, color `#cbd5e1`
- [ ] Step labels fade in at 300, 330, 360, 390 — Inter 400 16px `#64748b`
- [ ] Caption "Every feature. Same process. Always." fades in at frame 440, Inter 600 26px `#1e293b`
- [ ] Everything holds cleanly through frame 600
- [ ] Scene04 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene04 plays after Scene03 (from: 1245), total duration 1845
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. The init spec provides exact coordinates for all elements. Both DiagramNode and AnimatedArrow are proven components (validated in DiagramDemo). The only thing to watch is Arrow 4's right-to-left direction — the AnimatedArrow arrowhead rotation should handle this automatically since `Math.atan2` computes the correct angle for any direction, and the arrowhead polygon was designed to work regardless of rotation.
