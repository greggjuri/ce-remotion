# init-007: Scene 3 — CLAUDE.md Deep Dive

## Overview
Build Scene 3 (~15 seconds) — a dark terminal scene that shows the contents of a real
CLAUDE.md file typing out section by section, with annotation labels appearing beside
key sections to explain what each part does. This is the most content-heavy scene.

## Reference Files
- `docs/decisions.md` — colors, fonts, scene timing
- `docs/task.md` — typewriter pattern, stagger pattern, spring animations
- `docs/planning.md` — Scene 3 storyboard

---

## What To Build

### Files to create
- `src/scenes/Scene03ClaudeMD.tsx`

### Files to modify
- `src/Root.tsx` — register `Scene03` standalone preview, update Master duration
- `src/Master.tsx` — add Scene03 to TIMINGS and as third Sequence

---

## Scene Spec

### Duration
450 frames (15 seconds at 30fps)

### Background
`#0f172a` — full canvas dark background

---

## Layout
Split layout — two columns within a centered container:

- Left column: Terminal window showing CLAUDE.md contents (~900px wide)
- Right column: Annotation labels that appear beside key sections (~340px wide)
- Gap between columns: 60px
- Total content width: 1300px, centered at x=960
- Content vertically centered on canvas

---

## Animation Sequence

### Phase 1: Scene headline (frames 0–30)
- Text fades in: `"CLAUDE.md — your AI's source of truth"`
- Inter 600, 32px, color `#e2e8f0`
- Positioned at top center: x=960, y=80
- Fade in over 20 frames

### Phase 2: Terminal entrance (frames 15–40)
- Terminal window slides up (spring entrance, built into Terminal component)
- Terminal title: `"CLAUDE.md"`
- Terminal starts empty

### Phase 3: Content types out in sections (frames 40–360)
The terminal types out a condensed but realistic CLAUDE.md, section by section.
Each section is an `input` line (for the section header) followed by `output` lines
(for the content). Use `outputDelayFrames={0}` — content appears instantly after
each header.

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

Pass `startFrame={40}` and `charsPerSecond={22}` to the Terminal.

### Phase 4: Annotations appear (right column)
Annotations are simple text labels with a small connecting line/dot, positioned
to align with their corresponding terminal section. Each fades in when its
section finishes typing.

| Annotation | Appears at frame | Text |
|---|---|---|
| 1 | 80  | `"What this project is"` |
| 2 | 140 | `"Tech stack & dependencies"` |
| 3 | 230 | `"How Claude should write code"` |
| 4 | 330 | `"Keeps git history clean"` |

Each annotation:
- Inter 400, 16px, color `#6366f1` (indigo)
- Small indigo dot (8px circle) to the left of text
- Fade in over 15 frames
- Vertical position aligns with its corresponding terminal section

### Phase 5: Final caption (frames 370–420)
- Text: `"Claude Code reads this at the start of every session."`
- Inter 500, 22px, color `#94a3b8`
- Centered below the terminal, y≈900
- Fade in over 25 frames

### Phase 6: Hold (frames 420–450)
- Everything holds cleanly.

---

## Annotation Component (inline, not a separate file)

Define a small inline `Annotation` component inside Scene03ClaudeMD.tsx:

```tsx
interface AnnotationProps {
  text: string;
  appearFrame: number;
  top: number;         // absolute y position
}
```

Renders:
- Absolutely positioned in the right column
- Small indigo dot + text in a horizontal flex row
- Fades in at `appearFrame`

---

## Master.tsx Update

```tsx
const TIMINGS = {
  scene01: { from: 0,   duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 450 },
};
```

Update Master `durationInFrames` in Root.tsx to `600 + 450 = 1050`.

---

## Acceptance Criteria
- [ ] Dark `#0f172a` background fills the canvas
- [ ] Scene headline fades in at frame 0, Inter 600 32px `#e2e8f0`
- [ ] Terminal springs in at frame 15 with title `"CLAUDE.md"`
- [ ] Content types out section by section starting at frame 40 at 22 cps
- [ ] All four sections visible and fully typed by ~frame 360
- [ ] Four annotations appear at correct frames (80, 140, 230, 330)
- [ ] Each annotation has indigo dot + Inter 400 16px `#6366f1` text
- [ ] Annotations are positioned in right column aligned with their sections
- [ ] Final caption fades in at frame 370, Inter 500 22px `#94a3b8`
- [ ] Everything holds cleanly through frame 450
- [ ] Scene03 visible as standalone composition in Remotion Studio
- [ ] Master updated — Scene03 plays after Scene02, total Master duration 1050
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
