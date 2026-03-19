# init-005: Scene 1 — The Problem

## Overview
Build the first real scene: a ~8 second scene that shows what AI-assisted coding looks
like WITHOUT context engineering. A terminal types out a vague prompt, gets a generic
useless response, and a red ✗ appears with a caption. Sets up the "why CE matters"
narrative for the whole video.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs, scene timing
- `docs/task.md` — animation patterns, TIMINGS constant approach
- `docs/planning.md` — Scene 1 storyboard

---

## What To Build

### Files to create
- `src/scenes/Scene01Problem.tsx` — the scene component

### Files to modify
- `src/Root.tsx` — register `Scene01Problem` as a standalone preview composition
- `src/Master.tsx` — create this file if it doesn't exist, add Scene01 as first Sequence

---

## Scene Spec

### Duration
240 frames (8 seconds at 30fps)

### Background
`#0f172a` — full canvas dark background (AbsoluteFill)

### Layout
Three vertical zones, centered horizontally:
1. **Terminal window** — center stage, ~1200px wide, ~320px tall, vertically centered slightly above middle
2. **Result indicator** — below terminal, red ✗ with label
3. **Caption** — below result indicator

---

## Animation Sequence

### Phase 1: Terminal entrance (frames 0–20)
- Terminal slides up and fades in (spring entrance built into the Terminal component)
- Terminal displays no content yet — just the empty window chrome

### Phase 2: Command typing (frames 20–80)
- Input line types out: `claude "refactor the auth module"`
- Typing speed: 18 chars/second (default)
- Cursor blinks after typing completes

### Phase 3: AI response appears (frames 90–150)
- Three output lines appear with 15-frame stagger between each:
  1. `Sure! What framework are you using?`
  2. `What does your folder structure look like?`
  3. `I need more context to help you.`
- Each line uses `type: 'output'` styling (muted `#94a3b8`)

### Phase 4: Result indicator (frames 160–200)
- Red ✗ symbol springs in below the terminal
  - Font size: 72px, color `#ef4444`
  - Spring entrance: `damping: 200, stiffness: 150`
  - translateY: 20 → 0, opacity: 0 → 1
- Label fades in 10 frames after the ✗:
  - Text: `"AI without context is just autocomplete."`
  - Inter 500, 22px, color `#94a3b8`
  - Fade in over 20 frames

### Phase 5: Hold (frames 200–240)
- Everything holds. Scene ends cleanly.

---

## Terminal Lines for This Scene

```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'What does your folder structure look like?' },
  { type: 'output', text: 'I need more context to help you.' },
];
```

Pass `startFrame={20}` to the Terminal component so typing begins at frame 20.

---

## Master.tsx

Create `src/Master.tsx` with a TIMINGS constant and Scene01 as the first Sequence.
Use the structure from `docs/task.md`:

```tsx
const TIMINGS = {
  scene01: { from: 0,   duration: 240 },
  // remaining scenes to be added in future inits
};
```

Register as a composition in `src/Root.tsx`:
```tsx
<Composition
  id="Master"
  component={Master}
  durationInFrames={240}   // will grow as scenes are added
  fps={30}
  width={1920}
  height={1080}
/>
```

Also register Scene01 as a standalone preview composition:
```tsx
<Composition
  id="Scene01"
  component={Scene01Problem}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas
- [ ] Terminal window is centered, ~1200px wide
- [ ] Terminal springs in cleanly at frame 0 (no bounce)
- [ ] Command types out starting at frame 20 at correct speed
- [ ] Three output lines appear with 15-frame stagger starting at frame 90
- [ ] Red ✗ springs in at frame 160, correct color `#ef4444`, 72px
- [ ] Caption fades in at frame 170, correct text and styling
- [ ] Everything holds cleanly through frame 240
- [ ] Scene01 visible as standalone composition in Remotion Studio
- [ ] Master composition visible in Remotion Studio with Scene01 playing correctly
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
