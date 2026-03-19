# PRP-005: Scene 1 — The Problem

## Source
- Init file: init/init-005-scene01-problem.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 1 (~8s) — a dark terminal scene showing a vague AI prompt getting a useless response, capped by a red ✗ and caption, to set up the "why CE matters" narrative.

## Scope
- Files to CREATE:
  - `src/scenes/Scene01Problem.tsx` — the scene component
  - `src/Master.tsx` — master composition with TIMINGS, Scene01 as first Sequence
- Files to MODIFY:
  - `src/components/Terminal.tsx` — add `outputDelayFrames` prop to support staggered output line reveals (needed for 15-frame stagger between outputs)
  - `src/Root.tsx` — register `Scene01` standalone preview and `Master` compositions
- Files NOT touched:
  - All other components (`FileCard`, `DiagramNode`, `AnimatedArrow`, `CodeDiff`) — unchanged
  - All demo files — unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **Terminal component** (existing) — with `startFrame={20}` and new `outputDelayFrames={15}`
- **Spring slide-in** (task.md) — for the red ✗ indicator, `damping: 200, stiffness: 150`
- **Fade in** (task.md) — for the caption text, 20-frame fade
- **AbsoluteFill** — dark background fills canvas

## Implementation Steps

### Step 1: Enhance `src/components/Terminal.tsx` — add `outputDelayFrames` prop

Add a new optional prop `outputDelayFrames?: number` (default: `0`) to `TerminalProps`.

In the line timing computation loop, when processing an `output` line, add `outputDelayFrames` to `frameOffset` **before** setting the line's `startAt`:

```tsx
} else if (line.type === 'output') {
  frameOffset += outputDelayFrames;
  lineStates.push({ line, startAt: frameOffset, duration: 0 });
} else {
  // gap — no delay
  lineStates.push({ line, startAt: frameOffset, duration: 0 });
}
```

This is backward compatible — default `0` preserves current behavior. With `outputDelayFrames={15}`:
- Input "claude..." (33 chars, startFrame=20): types from frame 20 to ~75
- Output 1: appears at frame 75 + 15 = 90
- Output 2: appears at frame 90 + 15 = 105
- Output 3: appears at frame 105 + 15 = 120

This matches the init spec exactly.

### Step 2: Create `src/scenes/Scene01Problem.tsx`

**Terminal lines:**
```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'What does your folder structure look like?' },
  { type: 'output', text: 'I need more context to help you.' },
];
```

**Layout (all inline styles, no Tailwind for animated values):**
- `AbsoluteFill` with `backgroundColor: '#0f172a'`
- Centered column layout using flex
- Terminal: `width="1200px"`, `height="auto"`, `startFrame={20}`, `outputDelayFrames={15}`
- Position terminal slightly above vertical center (e.g., `marginTop: -60px` or `paddingBottom` offset)

**Red ✗ result indicator (frame 160):**
```tsx
const xLocalFrame = Math.max(0, frame - 160);
const xSpring = spring({
  frame: xLocalFrame,
  fps,
  config: { damping: 200, stiffness: 150 },
});
const xTranslateY = interpolate(xSpring, [0, 1], [20, 0]);
const xOpacity = interpolate(xSpring, [0, 1], [0, 1]);
```
- Before frame 160: invisible (`opacity: 0`)
- Render: `✗` character, 72px, `#ef4444`, centered below terminal, margin-top 32px

**Caption (frame 170):**
```tsx
const captionLocalFrame = Math.max(0, frame - 170);
const captionOpacity = interpolate(captionLocalFrame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Before frame 170: invisible (`opacity: 0`)
- Text: `"AI without context is just autocomplete."`
- Inter 500, 22px, `#94a3b8`, centered, margin-top 16px

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['500'],
  subsets: ['latin'],
});
```

### Step 3: Create `src/Master.tsx`

Simple master composition using `Sequence`:
```tsx
import { useVideoConfig, Sequence, AbsoluteFill } from 'remotion';
import { Scene01Problem } from './scenes/Scene01Problem';

const TIMINGS = {
  scene01: { from: 0, duration: 240 },
  // remaining scenes added in future PRPs
};

export const Master: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={TIMINGS.scene01.from} durationInFrames={TIMINGS.scene01.duration}>
        <Scene01Problem />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Step 4: Modify `src/Root.tsx`

Import and register both new compositions:
```tsx
// Scene01 standalone preview
<Composition
  id="Scene01"
  component={Scene01Problem}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
/>

// Master composition
<Composition
  id="Master"
  component={Master}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
/>
```

Master `durationInFrames` starts at 240 and will grow as scenes are added.

### Step 5: Verify in Remotion Studio

Select `Scene01` in Studio and verify:
- Terminal springs in at frame 0 (no bounce)
- Command types out starting at frame 20
- Output lines appear staggered at frames ~90, ~105, ~120
- Red ✗ springs in at frame 160
- Caption fades in at frame 170
- Everything holds through frame 240
- No elements visible before their entrance frame

Then select `Master` and verify Scene01 plays identically.

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas (AbsoluteFill)
- [ ] Terminal window is centered, ~1200px wide
- [ ] Terminal springs in cleanly at frame 0 (no bounce)
- [ ] Command types out starting at frame 20 at ~18 chars/second
- [ ] Three output lines appear with ~15-frame stagger starting at ~frame 90
- [ ] Red ✗ springs in at frame 160, color `#ef4444`, 72px, damping 200 stiffness 150
- [ ] Caption fades in at frame 170, text "AI without context is just autocomplete.", Inter 500, 22px, `#94a3b8`
- [ ] Everything holds cleanly through frame 240
- [ ] Terminal `outputDelayFrames` prop is backward compatible (default 0)
- [ ] Scene01 visible as standalone composition in Remotion Studio
- [ ] Master composition visible with Scene01 playing correctly
- [ ] Matches timing spec in docs/planning.md (Scene 1 = ~8s = 240 frames)
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. The scene reuses the existing Terminal component with one small backward-compatible enhancement. The ✗ and caption are simple spring/fade animations. Master.tsx is minimal scaffolding. The only thing to watch is the exact frame timing — the input typing duration depends on character count and cps, so the output stagger start frame (~75 + 15 = 90) is approximate and will work out naturally from the Terminal's internal computation.
