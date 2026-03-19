# PRP-007: Scene 3 — CLAUDE.md Deep Dive

## Source
- Init file: init/init-007-scene03-claudemd.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build Scene 3 (~15s) — a dark terminal scene that types out a condensed CLAUDE.md file section by section, with indigo annotation labels appearing in a right column to explain each section's purpose.

## Scope
- Files to CREATE:
  - `src/scenes/Scene03ClaudeMD.tsx` — the scene component (includes inline `Annotation` component)
- Files to MODIFY:
  - `src/Root.tsx` — register `Scene03` standalone preview; update Master `durationInFrames` to 1050 (600 + 450)
  - `src/Master.tsx` — add `scene03` to TIMINGS (from: 600, duration: 450) and as third Sequence
- Files NOT touched:
  - All components — unchanged (reuses existing `<Terminal />`)
  - Existing scenes — unchanged
  - All demo files — unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **Terminal component** (existing) — with `startFrame={40}`, `charsPerSecond={22}`, `title="CLAUDE.md"`, fixed height
- **Fade in** (task.md) — for headline, annotations, and caption
- **AbsoluteFill** — dark background, absolute positioning for all elements

## Implementation Steps

### Step 1: Create `src/scenes/Scene03ClaudeMD.tsx`

**Layout strategy:** All elements use `position: absolute` within an `AbsoluteFill`. The Terminal gets a fixed height (`560px`) so its dimensions don't shift as content types in, keeping annotation alignment stable.

**Coordinate system:**
- Canvas: 1920×1080, bg `#0f172a`
- Headline: centered at y=60
- Terminal: left=310, top=160, width=900px, height=560px
- Annotations: left=1270, Y positions computed to align with terminal sections
- Caption: centered at y=900

**Inline Annotation component:**
```tsx
interface AnnotationProps {
  text: string;
  appearFrame: number;
  top: number;
}
```
- Absolutely positioned at `left: 1270` (right column), `top` from prop
- Horizontal flex: 8px indigo circle (`#6366f1`) + 12px gap + text
- Text: Inter 400, 16px, color `#6366f1`
- Fade in over 15 frames starting at `appearFrame`
- Before `appearFrame`: invisible (`opacity: 0`)

**Terminal lines:**
```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: '## Project Overview' },
  { type: 'output', text: 'CE demo video for jurigregg.com blog.' },
  { type: 'output', text: 'Explains Context Engineering fundamentals.' },
  { type: 'gap' },
  { type: 'input',  text: '## Stack' },
  { type: 'output', text: 'Remotion 4.x + React + TypeScript' },
  { type: 'output', text: 'Tailwind CSS · Inter · JetBrains Mono' },
  { type: 'gap' },
  { type: 'input',  text: '## Code Principles' },
  { type: 'output', text: 'One component per file, named export' },
  { type: 'output', text: 'useCurrentFrame() for ALL animation' },
  { type: 'output', text: 'No hardcoded frame numbers' },
  { type: 'gap' },
  { type: 'input',  text: '## Git Workflow' },
  { type: 'output', text: 'git add -A && git commit && git push' },
  { type: 'output', text: 'After EVERY completed feature. No exceptions.' },
];
```

Terminal props: `startFrame={40}`, `charsPerSecond={22}`, `title="CLAUDE.md"`, `width="900px"`, `height="560px"`.

**Note on typing timing:** At 22 cps with 62 total input chars, typing completes by ~frame 126. The annotation frames (80, 140, 230, 330) are paced for readability, not synchronized to typing completion. Annotations 3 and 4 appear well after typing finishes, giving viewers time to read the terminal content.

**Annotation positions:**
The Terminal body starts at terminal_top (160) + title bar (40) + padding (24) = 224px. Each line is 28px tall. Section headers are at line indices 0, 4, 8, 13. Annotations are vertically centered on their section header line:

| # | Section | Line index | Y position (224 + idx×28 + 14) | appearFrame |
|---|---------|------------|--------------------------------|-------------|
| 1 | Project Overview | 0 | 238 | 80 |
| 2 | Stack | 4 | 350 | 140 |
| 3 | Code Principles | 8 | 462 | 230 |
| 4 | Git Workflow | 13 | 588 | 330 |

```tsx
const annotations = [
  { text: 'What this project is',          appearFrame: 80,  top: 238 },
  { text: 'Tech stack & dependencies',     appearFrame: 140, top: 350 },
  { text: 'How Claude should write code',  appearFrame: 230, top: 462 },
  { text: 'Keeps git history clean',       appearFrame: 330, top: 588 },
];
```

**Headline (frames 0–20):**
```tsx
const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Text: `"CLAUDE.md — your AI's source of truth"`
- Inter 600, 32px, color `#e2e8f0`
- Centered at y=60

**Caption (frames 370–395):**
```tsx
const captionLocalFrame = Math.max(0, frame - 370);
const captionOpacity = interpolate(captionLocalFrame, [0, 25], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
- Before frame 370: invisible (`opacity: 0`)
- Text: `"Claude Code reads this at the start of every session."`
- Inter 500, 22px, color `#94a3b8`
- Centered at y=900

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin'],
});
```

### Step 2: Modify `src/Master.tsx`

Update TIMINGS and add Scene03 Sequence:
```tsx
const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 450 },
};
```

Add Scene03 import and Sequence.

### Step 3: Modify `src/Root.tsx`

1. Import `Scene03ClaudeMD` and register standalone preview:
   ```tsx
   <Composition
     id="Scene03"
     component={Scene03ClaudeMD}
     durationInFrames={450}
     fps={30}
     width={1920}
     height={1080}
   />
   ```
2. Update Master `durationInFrames` to `1050` (600 + 450).

### Step 4: Verify in Remotion Studio

Select `Scene03` and verify:
- Dark background, headline fades in at frame 0
- Terminal springs in (entrance animation from frame 0)
- Content types out section by section starting at frame 40 at 22 cps
- Annotations appear at frames 80, 140, 230, 330 with indigo dot + text
- Annotations align vertically with their corresponding terminal sections
- Caption fades in at frame 370
- Everything holds through frame 450

Then select `Master` and verify Scene03 plays after Scene02.

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas
- [ ] Headline "CLAUDE.md — your AI's source of truth" fades in at frame 0, Inter 600 32px `#e2e8f0`
- [ ] Terminal springs in with title "CLAUDE.md", 900px wide, fixed 560px height
- [ ] Content types out section by section starting at frame 40 at 22 cps
- [ ] All four sections visible: Project Overview, Stack, Code Principles, Git Workflow
- [ ] Annotation 1 "What this project is" at frame 80, aligned with section 1
- [ ] Annotation 2 "Tech stack & dependencies" at frame 140, aligned with section 2
- [ ] Annotation 3 "How Claude should write code" at frame 230, aligned with section 3
- [ ] Annotation 4 "Keeps git history clean" at frame 330, aligned with section 4
- [ ] Each annotation has 8px indigo circle + Inter 400 16px `#6366f1` text, fades in over 15 frames
- [ ] Caption "Claude Code reads this at the start of every session." fades in at frame 370, Inter 500 22px `#94a3b8`
- [ ] Everything holds cleanly through frame 450
- [ ] Scene03 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene03 plays after Scene02 (from: 600), total Master duration 1050
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
8/10 — High confidence on the Terminal reuse and animation patterns. The main uncertainty is annotation Y alignment — the computed positions (238, 350, 462, 588) are based on terminal line height math (28px per line), but may need ±10px visual tuning in Studio to look perfectly aligned. The typing completes at ~frame 126 while annotations continue appearing until frame 330, which is intentional for readability pacing.
