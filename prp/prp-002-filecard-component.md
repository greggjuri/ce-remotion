# PRP-002: FileCard Component

## Source
- Init file: init/init-002-filecard-component.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build a reusable `<FileCard />` component that displays a CE file as an animated card with icon, filename, description, and spring entrance — used in Scene 2's 2x2 grid reveal.

## Scope
- Files to CREATE:
  - `src/components/FileCard.tsx` — the FileCard component
  - `src/FileCardDemo.tsx` — demo composition for isolated preview
- Files to MODIFY:
  - `src/Root.tsx` — register `FileCardDemo` composition; update Inter font loading to include weight `'700'` (needed for filename bold text)
- Files NOT touched:
  - `src/components/Terminal.tsx` — existing component, unchanged
  - `src/TerminalDemo.tsx` — existing demo, unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **Spring slide-in** (task.md) — `spring()` with high damping for each card's entrance, driven by `enterFrame` prop. Note: init spec uses `stiffness: 120` (slightly snappier than the default 100) — follow the init spec.
- **Font loading** (task.md) — `@remotion/google-fonts/Inter` with `'normal'` style, weights `['400', '700']`, subsets `['latin']`

## Implementation Steps

### Step 1: Create `src/components/FileCard.tsx`

Define the types and component:

```tsx
type FileCardIcon = 'rules' | 'decisions' | 'task' | 'prp';

interface FileCardProps {
  filename: string;
  description: string;
  icon: FileCardIcon;
  enterFrame: number;
}
```

**Icon + accent color mapping:**
| icon        | symbol | accent              |
|-------------|--------|---------------------|
| `rules`     | `⚙`   | `#6366f1` (indigo)  |
| `decisions` | `✓`   | `#22c55e` (green)   |
| `task`      | `⚡`   | `#f59e0b` (amber)   |
| `prp`       | `▶`   | `#3b82f6` (blue)    |

**Entrance animation logic:**
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const localFrame = Math.max(0, frame - enterFrame);
const springValue = spring({
  frame: localFrame,
  fps,
  config: { damping: 200, stiffness: 120 },
});
const translateY = interpolate(springValue, [0, 1], [40, 0]);
const opacity = interpolate(springValue, [0, 1], [0, 1]);
```

Cards before their `enterFrame` are fully invisible: `opacity: 0`, `pointerEvents: 'none'`.

**Rendering:**
- Outer div: animated `transform: translateY(...)` + `opacity`, applies visibility check
- Card container: white `#ffffff` background, 1px solid `#e2e8f0` border, 16px border radius, box shadow `0 4px 24px rgba(0,0,0,0.08)`, 32px padding, ~380px width, ~200px height
- Icon circle: 48px, accent color background at 15% opacity (use hex-to-rgba conversion), icon character centered in accent color, 22px font size
- Filename: Inter 700, 20px, color `#1e293b`, margin-top 16px
- Description: Inter 400, 14px, color `#64748b`, margin-top 8px

**Font loading:**
Load Inter with both weights `['400', '700']` inside the component (idempotent with Root.tsx):
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});
```

**Accent opacity helper:**
For the 15% opacity background, convert hex accent to rgba. A simple approach: use the accent hex as the color and set background opacity via a hardcoded map (since there are only 4 values), or use inline rgba strings directly:
```tsx
const ICON_CONFIG: Record<FileCardIcon, { symbol: string; accent: string; bgAccent: string }> = {
  rules:     { symbol: '⚙', accent: '#6366f1', bgAccent: 'rgba(99, 102, 241, 0.15)' },
  decisions: { symbol: '✓', accent: '#22c55e', bgAccent: 'rgba(34, 197, 94, 0.15)' },
  task:      { symbol: '⚡', accent: '#f59e0b', bgAccent: 'rgba(245, 158, 11, 0.15)' },
  prp:       { symbol: '▶', accent: '#3b82f6', bgAccent: 'rgba(59, 130, 246, 0.15)' },
};
```

### Step 2: Create `src/FileCardDemo.tsx`

Render all four cards in a 2x2 grid, centered on `#f8fafc` background:

```tsx
const cards = [
  { filename: 'CLAUDE.md',    description: 'Project rules & conventions',         icon: 'rules'     as const, enterFrame: 10 },
  { filename: 'decisions.md', description: 'Confirmed architectural choices',     icon: 'decisions' as const, enterFrame: 25 },
  { filename: 'task.md',      description: 'Technical gotchas & patterns',        icon: 'task'      as const, enterFrame: 40 },
  { filename: 'PRP',          description: 'Scoped task with acceptance criteria', icon: 'prp'      as const, enterFrame: 55 },
];
```

Grid layout: use CSS grid or flexbox — 2 columns, 32px gap, centered in the 1920x1080 canvas.

### Step 3: Modify `src/Root.tsx`

1. Update Inter font loading to include weight `'700'`:
   ```tsx
   loadInter('normal', { weights: ['400', '700'], subsets: ['latin'] });
   ```
2. Import `FileCardDemo` and register the composition:
   ```tsx
   <Composition
     id="FileCardDemo"
     component={FileCardDemo}
     durationInFrames={180}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

### Step 4: Verify in Remotion Studio

Run `npm run dev`, select `FileCardDemo`, and verify:
- Cards spring in one at a time with ~15-frame stagger
- No bounce on entrance
- Cards before their enterFrame are invisible
- Icon circles have correct accent colors with 15% opacity background
- Filename is bold, description is regular weight
- Colors, fonts, spacing match the spec
- No TypeScript or console errors

## Acceptance Criteria
- [ ] Card renders with correct visual design (white bg, 1px `#e2e8f0` border, 16px radius, box shadow)
- [ ] Icon circle uses correct accent color per `icon` prop at 15% opacity background
- [ ] Icon symbol matches the mapping (⚙, ✓, ⚡, ▶)
- [ ] Filename uses Inter 700, 20px, color `#1e293b`
- [ ] Description uses Inter 400, 14px, color `#64748b`
- [ ] Spring entrance animation plays correctly — no bounce (damping 200, stiffness 120)
- [ ] Cards before their `enterFrame` are fully invisible (opacity 0)
- [ ] All four cards visible and correctly staggered in `FileCardDemo`
- [ ] 2x2 grid layout with 32px gap, centered on canvas
- [ ] Background of demo is `#f8fafc`
- [ ] Inter font weight 700 loaded in Root.tsx
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. The init spec is fully prescriptive with exact colors, sizes, and animation config. The only minor detail is the icon rendering — emoji/symbols can render slightly differently across platforms, but at 22px on a 1920x1080 canvas they'll be fine. No architectural decisions needed.
