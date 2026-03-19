# init-008: Scene 4 — The PRP Workflow

## Overview
Build Scene 4 (~20 seconds) — a light background scene that animates a flowchart
showing the full CE workflow: Human + Claude.ai writes an init file → Claude Code
generates a PRP → Human reviews → Claude Code executes → git push. Nodes light up
sequentially as arrows draw between them, making the workflow feel alive.

## Reference Files
- `docs/decisions.md` — colors, fonts, scene timing
- `docs/task.md` — DiagramNode/AnimatedArrow patterns, spring animations
- `docs/planning.md` — Scene 4 storyboard

---

## What To Build

### Files to create
- `src/scenes/Scene04PRPFlow.tsx`

### Files to modify
- `src/Root.tsx` — register `Scene04` standalone preview, update Master duration
- `src/Master.tsx` — add Scene04 to TIMINGS as fourth Sequence

---

## Scene Spec

### Duration
600 frames (20 seconds at 30fps)

### Background
`#f8fafc` — full canvas light background

---

## Layout
Two rows of nodes, centered on canvas:

**Row 1 (top):** 3 nodes horizontally
**Row 2 (bottom):** 2 nodes horizontally, centered under Row 1

This L-shaped flow feels more natural than a single horizontal chain at this scale.

```
[ Human + Claude.ai ] → [ init file ] → [ Claude Code ]
                                               ↓
                              [ git push ] ← [ PRP ]
```

### Node positions (1920×1080 canvas)
All nodes: 300px wide, 90px tall

Row 1 Y: 380
Row 2 Y: 540

| Node | label | sublabel | icon | left | top |
|---|---|---|---|---|---|
| 1 | `Human + Claude.ai` | `writes init file` | `✍` | 310 | 380 |
| 2 | `init file` | `feature spec` | `📄` | 810 | 380 |
| 3 | `Claude Code` | `/generate-prp` | `⚡` | 1310 | 380 |
| 4 | `PRP` | `reviewed & approved` | `✓` | 1310 | 540 |
| 5 | `git push` | `auto on completion` | `🚀` | 810 | 540 |

---

## Animation Sequence

### Phase 1: Headline (frames 0–25)
- Text: `"The CE Workflow"`
- Inter 700, 48px, color `#1e293b`
- Centered at x=960, y=160
- Scale 0.92→1.0, opacity 0→1 over 25 frames, Easing.out(Easing.cubic)

### Phase 2: Nodes and arrows animate in sequentially
Each node springs in, then its outgoing arrow draws, then the next node springs in.
60 frames between each node entrance (2 seconds each step — gives audience time to read).

| Step | What happens | Frame |
|---|---|---|
| Node 1 enters | Human + Claude.ai springs in | 40 |
| Arrow 1 draws | Node1 → Node2 | 70 |
| Node 2 enters | init file springs in | 100 |
| Arrow 2 draws | Node2 → Node3 | 130 |
| Node 3 enters | Claude Code springs in, active glow | 160 |
| Arrow 3 draws | Node3 → Node4 (vertical) | 190 |
| Node 4 enters | PRP springs in | 220 |
| Arrow 4 draws | Node4 → Node5 (horizontal, right to left) | 250 |
| Node 5 enters | git push springs in | 280 |

### Arrow specs
All arrows: `drawDuration={25}`, color `#cbd5e1`

Arrow coordinates (connect right/bottom edges to left/top edges):
- Arrow 1: x1=610, y1=425, x2=810, y2=425 (Node1 right → Node2 left)
- Arrow 2: x1=1110, y1=425, x2=1310, y2=425 (Node2 right → Node3 left)
- Arrow 3: x1=1460, y1=470, x2=1460, y2=540 (Node3 bottom → Node4 top)
- Arrow 4: x1=1310, y1=585, x2=1110, y2=585 (Node4 left → Node5 right, reversed)

### Active state
- Node 3 (Claude Code): `active={true}` — indigo glow
- All other nodes: `active={false}`

### Phase 3: Step labels appear (frames 300–420)
After all nodes are visible, four small step labels fade in below the diagram
to explain the workflow in plain language. One label per step, staggered by 30 frames.

Labels appear centered below their corresponding nodes:

| Label | text | x | y | appearFrame |
|---|---|---|---|---|
| 1 | `"1. Define the task"` | 460 | 680 | 300 |
| 2 | `"2. Generate a PRP"` | 1460 | 680 | 330 |
| 3 | `"3. Review & approve"` | 1460 | 740 | 360 |
| 4 | `"4. Execute & commit"` | 960 | 740 | 390 |

Each label: Inter 400, 16px, color `#64748b`, fade in over 20 frames.

### Phase 4: Caption (frames 440–470)
- Text: `"Every feature. Same process. Always."`
- Inter 600, 26px, color `#1e293b`
- Centered at x=960, y=860
- Fade in over 25 frames

### Phase 5: Hold (frames 470–600)
- Everything holds cleanly.

---

## Master.tsx Update

```tsx
const TIMINGS = {
  scene01: { from: 0,    duration: 330 },
  scene02: { from: 330,  duration: 270 },
  scene03: { from: 600,  duration: 645 },
  scene04: { from: 1245, duration: 600 },
};
```

Update Master `durationInFrames` in Root.tsx to `1245 + 600 = 1845`.

---

## Acceptance Criteria
- [ ] Light `#f8fafc` background fills the canvas
- [ ] Headline "The CE Workflow" scales/fades in at frame 0, Inter 700 48px `#1e293b`
- [ ] All 5 nodes render with correct labels, sublabels, icons at correct positions
- [ ] Nodes spring in at correct frames: 40, 100, 160, 220, 280
- [ ] Node 3 (Claude Code) has active indigo glow
- [ ] All 4 arrows draw between correct node pairs at correct frames: 70, 130, 190, 250
- [ ] Arrow 3 is vertical (Node3 bottom → Node4 top)
- [ ] Arrow 4 goes right-to-left (Node4 left → Node5 right)
- [ ] Step labels fade in at frames 300, 330, 360, 390 at correct positions
- [ ] Caption "Every feature. Same process. Always." fades in at frame 440
- [ ] Everything holds cleanly through frame 600
- [ ] Scene04 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene04 plays after Scene03 (from: 1245), total duration 1845
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
