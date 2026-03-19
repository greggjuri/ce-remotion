# PRP-004: CodeDiff Component

## Source
- Init file: init/init-004-codediff-component.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build a reusable `<CodeDiff />` component that displays a before/after code diff with staggered line reveals and per-line fade-in — the last reusable component before scene work begins, used in Scene 5.

## Scope
- Files to CREATE:
  - `src/components/CodeDiff.tsx` — the CodeDiff component
  - `src/CodeDiffDemo.tsx` — demo composition with two side-by-side diff blocks
- Files to MODIFY:
  - `src/Root.tsx` — register `CodeDiffDemo` composition; update Inter font loading to include weight `'500'` (needed for title bar text)
- Files NOT touched:
  - All existing components and demos — unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **Staggered list reveal** (task.md) — lines appear one by one based on `enterFrame + i * lineDelayFrames`
- **Fade in** (task.md) — each line fades in over 6 frames on appearance
- **Spring slide-in** (task.md) — whole block slides up with `spring({ damping: 200, stiffness: 100 })`, translateY 30→0
- **Font loading** (task.md) — JetBrains Mono for diff body, Inter for title bar

## Implementation Steps

### Step 1: Create `src/components/CodeDiff.tsx`

**Types:**
```tsx
type DiffLine =
  | { type: 'removed'; text: string }
  | { type: 'added';   text: string }
  | { type: 'context'; text: string }
  | { type: 'header';  text: string };

interface CodeDiffProps {
  lines: DiffLine[];
  enterFrame?: number;         // default: 0
  lineDelayFrames?: number;    // default: 3
  title?: string;              // optional title above diff body
}
```

**Line type styling map:**
```tsx
const LINE_STYLES: Record<DiffLine['type'], { bg: string; color: string; prefix: string }> = {
  removed: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', prefix: '- ' },
  added:   { bg: 'rgba(34,197,94,0.15)', color: '#86efac', prefix: '+ ' },
  context: { bg: 'transparent',          color: '#94a3b8', prefix: '  ' },
  header:  { bg: 'transparent',          color: '#60a5fa', prefix: '   ' },
};
```

**Entrance animation** — whole block spring slide-in:
```tsx
const springValue = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
const translateY = interpolate(springValue, [0, 1], [30, 0]);
const blockOpacity = interpolate(springValue, [0, 1], [0, 1]);
```

**Staggered line reveal with per-line fade:**
```tsx
// Line i is visible if: frame >= enterFrame + i * lineDelayFrames
// Each line fades in over 6 frames from its reveal moment
const lineRevealFrame = enterFrame + i * lineDelayFrames;
const lineAge = frame - lineRevealFrame;
const lineOpacity = interpolate(lineAge, [0, 6], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

Only render lines where `frame >= lineRevealFrame`.

**Rendering:**
- Outer div: spring translateY + blockOpacity
- Container: `#0f172a` background, 12px border radius, overflow hidden
- Title bar (if `title` prop): `#1e2433` background, 12px horizontal padding, 10px vertical padding, Inter 500 13px `#8b9ab0`
- Body: 20px padding, JetBrains Mono 14px, line-height 1.7
- Each line div: full-width, 2px horizontal padding, 1px border-radius, background and text color from `LINE_STYLES`, prefixed with the line type prefix

**Font loading** — load both fonts in the component (idempotent):
```tsx
const { fontFamily: monoFont } = loadJetBrains('normal', { weights: ['400'], subsets: ['latin'] });
const { fontFamily: interFont } = loadInter('normal', { weights: ['500'], subsets: ['latin'] });
```

### Step 2: Create `src/CodeDiffDemo.tsx`

Two diff blocks side by side on a `#0f172a` background, centered in the canvas.

**Content:**
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

**Layout:**
- Outer container: full canvas, flex, centered, `#0f172a` background, 48px gap between blocks
- Each block column: ~800px wide
- Above each CodeDiff block: a label in Inter 500, 12px, `#64748b`, uppercase, 8px margin-bottom (e.g., "WITHOUT CE" / "WITH CE")
- Left block: `title="Without CE"`, `enterFrame: 10`
- Right block: `title="With CE"`, `enterFrame: 40`

### Step 3: Modify `src/Root.tsx`

1. Update Inter font loading to include weight `'500'`:
   ```tsx
   loadInter('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
   ```
2. Import `CodeDiffDemo` and register the composition:
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

### Step 4: Verify in Remotion Studio

Run `npm run dev`, select `CodeDiffDemo`, and verify:
- Left diff block enters at frame 10, right at frame 40
- Lines stagger in one by one with 3-frame delay, each fading over 6 frames
- Red removed lines have correct tint background and `#fca5a5` text
- Green added lines have correct tint background and `#86efac` text
- Context lines are muted, header lines are blue
- Spring entrance on each block (no bounce)
- Title bars render correctly
- JetBrains Mono 14px in diff body
- No TypeScript or console errors

## Acceptance Criteria
- [ ] `removed` lines: red background tint `rgba(239,68,68,0.15)`, text `#fca5a5`, prefix `- `
- [ ] `added` lines: green background tint `rgba(34,197,94,0.15)`, text `#86efac`, prefix `+ `
- [ ] `context` lines: transparent background, text `#94a3b8`, prefix `  `
- [ ] `header` lines: transparent background, text `#60a5fa`
- [ ] Lines appear one by one with `lineDelayFrames` (default 3) stagger timing
- [ ] Each line fades in over 6 frames on appearance
- [ ] Whole block slides up with spring entrance (damping 200, stiffness 100, translateY 30→0) — no bounce
- [ ] Title bar renders with `#1e2433` bg, Inter 500 13px `#8b9ab0` when `title` prop provided
- [ ] Diff body uses JetBrains Mono 14px, line-height 1.7
- [ ] Container has `#0f172a` background, 12px border radius
- [ ] Two diff blocks visible side by side in `CodeDiffDemo` with 48px gap
- [ ] Left block enters at frame 10, right block at frame 40
- [ ] Demo background is `#0f172a`
- [ ] Inter font weight 500 loaded in Root.tsx
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. The init spec is fully prescriptive with exact colors, timing, and styling. The stagger + per-line fade pattern is well-documented in task.md. The only minor complexity is the side-by-side demo layout, but it's straightforward flexbox. This is the last reusable component — after this, scene work begins.
