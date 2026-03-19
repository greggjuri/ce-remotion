# PRP-003: DiagramNode + AnimatedArrow Components

## Source
- Init file: init/init-003-diagram-components.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build `<DiagramNode />` and `<AnimatedArrow />` components — the building blocks for Scene 4's PRP workflow flowchart — and validate them together in a 5-node horizontal chain demo.

## Scope
- Files to CREATE:
  - `src/components/DiagramNode.tsx` — rounded-rect node with label, sublabel, icon, and active glow
  - `src/components/AnimatedArrow.tsx` — SVG arrow that draws itself between two points
  - `src/DiagramDemo.tsx` — demo composition with 5-node chain + 4 arrows
- Files to MODIFY:
  - `src/Root.tsx` — register `DiagramDemo` composition; update Inter font loading to include weight `'600'` (needed for node label semi-bold)
- Files NOT touched:
  - `src/components/Terminal.tsx`, `src/components/FileCard.tsx` — unchanged
  - `src/TerminalDemo.tsx`, `src/FileCardDemo.tsx` — unchanged
  - All `docs/` files — read-only reference

## Remotion Patterns Used
- **Spring slide-in** (task.md) — `spring()` with `damping: 200, stiffness: 120` for node entrances, driven by `enterFrame` prop (same pattern as FileCard)
- **Fade in** (task.md) — opacity via `interpolate()` on the spring value
- **Easing** — `Easing.out(Easing.cubic)` for the arrow draw animation (imported from `remotion`)
- **Font loading** (task.md) — `@remotion/google-fonts/Inter` with `'normal'` style, updated weights `['400', '600', '700']`

## Implementation Steps

### Step 1: Create `src/components/DiagramNode.tsx`

**Types:**
```tsx
interface DiagramNodeProps {
  label: string;
  sublabel?: string;
  icon?: string;
  enterFrame: number;
  active?: boolean;      // default: false
  width?: number;        // default: 280
  height?: number;       // default: 80
}
```

**Entrance animation** — identical pattern to FileCard but with smaller translateY (20px instead of 40px):
```tsx
const localFrame = Math.max(0, frame - enterFrame);
const springValue = spring({
  frame: localFrame,
  fps,
  config: { damping: 200, stiffness: 120 },
});
const translateY = interpolate(springValue, [0, 1], [20, 0]);
const opacity = interpolate(springValue, [0, 1], [0, 1]);
```

Nodes before `enterFrame` are fully invisible (`opacity: 0`, `pointerEvents: 'none'`).

**Rendering:**
- Outer div: animated `transform` + `opacity`, visibility check
- Card container: set `width` and `height` from props
  - Background: `#ffffff`
  - Border: `1.5px solid #e2e8f0`
  - Border radius: `12px`
  - Box shadow (inactive): `0 2px 12px rgba(0,0,0,0.06)`
  - Box shadow (active): `0 0 0 2px #6366f1, 0 4px 20px rgba(99,102,241,0.25)`
  - Padding: `16px 24px`
  - Layout: `display: flex, alignItems: center, gap: 12px`
- Icon circle (if `icon` prop present):
  - 36px circle, background `#f1f5f9`, centered, font-size 18px
- Text stack (right of icon):
  - Label: Inter 600, 15px, color `#1e293b`
  - Sublabel (if present): Inter 400, 12px, color `#94a3b8`, margin-top 2px

**Font loading:**
```tsx
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});
```

### Step 2: Create `src/components/AnimatedArrow.tsx`

**Types:**
```tsx
interface AnimatedArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawFrame: number;
  drawDuration?: number;  // default: 20
  color?: string;         // default: '#cbd5e1'
}
```

**SVG container:** absolutely positioned, fills parent, `pointerEvents: 'none'`.

**Line drawing animation:**
```tsx
const dx = x2 - x1;
const dy = y2 - y1;
const length = Math.sqrt(dx * dx + dy * dy);

const localFrame = Math.max(0, frame - drawFrame);
const progress = interpolate(
  localFrame,
  [0, drawDuration],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
);
const dashOffset = length * (1 - progress);
```

Apply to `<line>` element:
- `stroke={color}`, `strokeWidth={2}`, `strokeLinecap="round"`
- `strokeDasharray={length}`, `strokeDashoffset={dashOffset}`

**Arrowhead:**
- SVG `<polygon>` triangle: 8px wide, 10px long
- Direction angle: `Math.atan2(dy, dx) * (180 / Math.PI)`
- **Critical — tip must land exactly at `(x2, y2)`:** Define the polygon points so the tip is at origin `(0, 0)` and the base extends behind it: `points="0,0 -10,-4 -10,4"`. Then use `transform={`translate(${x2}, ${y2}) rotate(${angle})`}` to place and rotate it. This ensures the tip is always at the arrow endpoint regardless of rotation. Do NOT define points at `(x2, y2)` directly and rotate around a separate origin — that causes off-by-pixel errors.
- Fade in with last 20% of draw progress: `opacity = interpolate(progress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })`

**Visibility:** entire SVG invisible before `drawFrame` (same `frame >= drawFrame` check).

### Step 3: Create `src/DiagramDemo.tsx`

Render 5 nodes in a horizontal chain connected by 4 arrows on a `#f8fafc` background.

**Node data:**
```tsx
const nodes = [
  { label: 'Human + Claude.ai', sublabel: 'writes init file',    icon: '✍',  enterFrame: 10 },
  { label: 'init file',         sublabel: 'feature spec',        icon: '📄', enterFrame: 30 },
  { label: 'Claude Code',       sublabel: '/generate-prp',       icon: '⚡',  enterFrame: 50 },
  { label: 'PRP',               sublabel: 'reviewed + approved',  icon: '✓', enterFrame: 70 },
  { label: 'git push',          sublabel: 'auto on completion',  icon: '🚀', enterFrame: 90 },
];
```

Third node (`Claude Code`) gets `active={true}`.

**Layout computation:**
- Node dimensions: 280px wide, 80px tall
- Canvas: 1920x1080
- 5 nodes evenly spaced horizontally, centered vertically
- Compute `nodeX[i]` and `nodeY` for each node (all same Y since horizontal chain)
- Use a container with `position: relative` so the arrow SVG overlays correctly

**Arrow positioning:**
- Each arrow connects right edge of node N to left edge of node N+1
  - `x1 = nodeX[i] + nodeWidth`, `y1 = nodeY + nodeHeight / 2`
  - `x2 = nodeX[i+1]`, `y2 = nodeY + nodeHeight / 2`
- `drawFrame = enterFrame of destination node - 5` (arrow starts drawing 5 frames before next node appears)

### Step 4: Modify `src/Root.tsx`

1. Update Inter font loading to include weight `'600'`:
   ```tsx
   loadInter('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
   ```
2. Import `DiagramDemo` and register the composition:
   ```tsx
   <Composition
     id="DiagramDemo"
     component={DiagramDemo}
     durationInFrames={240}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

### Step 5: Verify in Remotion Studio

Run `npm run dev`, select `DiagramDemo`, and verify:
- Nodes spring in one by one with staggered timing
- No bounce on entrance
- Arrows draw themselves between nodes with eased cubic curve
- Arrowheads appear and point in the correct direction
- Third node (`Claude Code`) has indigo glow
- Nodes before their enterFrame are invisible
- All 5 nodes and 4 arrows visible by the end
- Colors, fonts, spacing match the spec
- No TypeScript or console errors

## Acceptance Criteria
- [ ] DiagramNode renders with correct visual design (white bg, 1.5px `#e2e8f0` border, 12px radius, shadow)
- [ ] Icon circle renders correctly (36px, `#f1f5f9` bg, 18px font)
- [ ] Label uses Inter 600, 15px, `#1e293b`
- [ ] Sublabel uses Inter 400, 12px, `#94a3b8`
- [ ] Active node shows indigo glow box-shadow (`0 0 0 2px #6366f1, 0 4px 20px rgba(99,102,241,0.25)`)
- [ ] Inactive nodes show subtle shadow (`0 2px 12px rgba(0,0,0,0.06)`)
- [ ] DiagramNode spring entrance plays correctly — no bounce (damping 200, stiffness 120, translateY 20→0)
- [ ] Nodes before their `enterFrame` are fully invisible
- [ ] AnimatedArrow draws itself from start to end over `drawDuration` frames
- [ ] Arrow uses `Easing.out(Easing.cubic)` for the draw curve
- [ ] Arrow stroke is 2px, rounded linecap, color `#cbd5e1`
- [ ] Arrowhead appears pointing in correct direction, fades in during last 20% of draw
- [ ] Arrow SVG is absolutely positioned and doesn't affect layout
- [ ] All 5 nodes stagger in correctly in DiagramDemo
- [ ] All 4 arrows draw between correct node pairs
- [ ] Active glow visible on the third node (`Claude Code`)
- [ ] Background of demo is `#f8fafc`
- [ ] Inter font weight 600 loaded in Root.tsx
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
8/10 — High confidence on DiagramNode (follows same pattern as FileCard). Moderate confidence on AnimatedArrow — the SVG `strokeDasharray` drawing trick is well-established, but the arrowhead polygon positioning/rotation requires care with coordinate math. The demo layout computation (5 nodes evenly spaced with absolute-position arrow overlays) adds some geometry that needs to be verified visually in Studio. No architectural decisions needed.
