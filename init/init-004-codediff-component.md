# init-004: CodeDiff Component

## Overview
Build a reusable `<CodeDiff />` component that displays a before/after code diff with
red removed lines and green added lines — used in Scene 5 (The Payoff) to show the
contrast between a vague AI response and a context-aware one.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs
- `docs/task.md` — stagger pattern, fade in, spring animations
- `docs/planning.md` — Scene 5 storyboard

---

## What To Build

### Files to create
- `src/components/CodeDiff.tsx` — the CodeDiff component
- `src/CodeDiffDemo.tsx` — demo composition for isolated preview

### Files to modify
- `src/Root.tsx` — register `CodeDiffDemo` composition

---

## CodeDiff Component Spec

### Props
```tsx
type DiffLine =
  | { type: 'removed'; text: string }   // red, prefixed with "- "
  | { type: 'added';   text: string }   // green, prefixed with "+ "
  | { type: 'context'; text: string }   // neutral, prefixed with "  "
  | { type: 'header';  text: string }   // file header line, muted blue

interface CodeDiffProps {
  lines: DiffLine[];
  enterFrame?: number;        // Frame at which diff starts appearing (default: 0)
  lineDelayFrames?: number;   // Frames between each line appearing (default: 3)
  title?: string;             // Optional title above the diff block
}
```

### Visual Design
- Outer container: `#0f172a` background, 12px border radius, overflow hidden
- Optional title bar: `#1e2433` background, 12px horizontal padding, 10px vertical padding
  - Title text: Inter 500, 13px, `#8b9ab0`
- Diff body: 20px padding
- Font: JetBrains Mono, 14px, line-height 1.7

### Line Type Styling
| type    | background                  | text color  | prefix |
|---------|-----------------------------|-------------|--------|
| removed | `rgba(239,68,68,0.15)`     | `#fca5a5`   | `- `   |
| added   | `rgba(34,197,94,0.15)`     | `#86efac`   | `+ `   |
| context | transparent                 | `#94a3b8`   | `  `   |
| header  | transparent                 | `#60a5fa`   | `    ` |

Each line: full-width, 2px horizontal padding inside the colored background, 1px border-radius.

### Animation
Lines appear one by one using the stagger pattern from `docs/task.md`:
```tsx
const visibleLines = lines.filter((_, i) =>
  frame >= enterFrame + i * lineDelayFrames
);
```

Each newly visible line fades in over 6 frames:
```tsx
// For line i, its local reveal frame is: enterFrame + i * lineDelayFrames
const lineAge = frame - (enterFrame + i * lineDelayFrames);
const lineOpacity = interpolate(lineAge, [0, 6], [0, 1], {
  extrapolateRight: 'clamp'
});
```

### Entrance Animation
The whole diff block slides up and fades in on mount:
```tsx
const springValue = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
const translateY = interpolate(springValue, [0, 1], [30, 0]);
const opacity = interpolate(springValue, [0, 1], [0, 1]);
```

---

## CodeDiffDemo Composition

Register in `src/Root.tsx`:
```tsx
<Composition
  id="CodeDiffDemo"
  component={CodeDiffDemo}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
/>
```

Create `src/CodeDiffDemo.tsx` that renders two diff blocks side by side on a `#0f172a`
background — representing "before CE" (bad) and "after CE" (good):

```tsx
const beforeLines: DiffLine[] = [
  { type: 'header',  text: '// AI response WITHOUT context engineering' },
  { type: 'removed', text: 'function refactorAuth() {' },
  { type: 'removed', text: '  // What framework are you using?' },
  { type: 'removed', text: '  // What does your folder structure look like?' },
  { type: 'removed', text: '  // I need more information to help.' },
  { type: 'removed', text: '}' },
];

const afterLines: DiffLine[] = [
  { type: 'header',  text: '// AI response WITH context engineering' },
  { type: 'added',   text: 'import { useAuth } from "@/lib/auth";' },
  { type: 'added',   text: 'import { db } from "@/lib/prisma";' },
  { type: 'context', text: '' },
  { type: 'added',   text: 'export async function refreshToken(' },
  { type: 'added',   text: '  userId: string' },
  { type: 'added',   text: '): Promise<AuthToken> {' },
  { type: 'added',   text: '  const user = await db.user.findUnique({' },
  { type: 'added',   text: '    where: { id: userId },' },
  { type: 'added',   text: '  });' },
  { type: 'added',   text: '}' },
];
```

- Left block: `beforeLines`, title `"Without CE"`, `enterFrame: 10`
- Right block: `afterLines`, title `"With CE"`, `enterFrame: 40`
- Both blocks: ~800px wide, centered vertically, 48px gap between them
- Background label above each block: small Inter 500 text, `#64748b`, uppercase

---

## Acceptance Criteria
- [ ] `removed` lines render with red background tint and `#fca5a5` text, prefixed `- `
- [ ] `added` lines render with green background tint and `#86efac` text, prefixed `+ `
- [ ] `context` lines render with transparent background and `#94a3b8` text
- [ ] `header` lines render in `#60a5fa`
- [ ] Lines appear one by one with correct stagger timing
- [ ] Each line fades in over 6 frames on appearance
- [ ] Whole block slides up with spring entrance (no bounce)
- [ ] Optional title bar renders correctly when `title` prop provided
- [ ] Font is JetBrains Mono 14px throughout the diff body
- [ ] Two diff blocks visible side by side in `CodeDiffDemo`
- [ ] `beforeLines` block enters at frame 10, `afterLines` at frame 40
- [ ] Background of demo is `#0f172a`
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
