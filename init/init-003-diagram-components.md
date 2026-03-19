# init-003: DiagramNode + AnimatedArrow Components

## Overview
Build two tightly coupled reusable components:
- `<DiagramNode />` — a rounded rectangle with label, sublabel, and icon, used as a step in the PRP workflow diagram
- `<AnimatedArrow />` — an SVG arrow that draws itself between two points

These are the core building blocks for Scene 4 (PRP Flow Diagram). Build and validate
them together in a single demo composition before scene work begins.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs
- `docs/task.md` — spring animations, stagger pattern, fade in
- `docs/planning.md` — Scene 4 storyboard (5-node flow diagram)

---

## What To Build

### Files to create
- `src/components/DiagramNode.tsx`
- `src/components/AnimatedArrow.tsx`
- `src/DiagramDemo.tsx` — demo composition

### Files to modify
- `src/Root.tsx` — register `DiagramDemo` composition

---

## DiagramNode Spec

### Props
```tsx
interface DiagramNodeProps {
  label: string;           // Main text e.g. "Claude Code"
  sublabel?: string;       // Smaller text below label e.g. "/execute-prp"
  icon?: string;           // Emoji or symbol e.g. "⚡"
  enterFrame: number;      // Frame at which node springs in
  active?: boolean;        // If true, node glows with indigo accent (default: false)
  width?: number;          // Default: 280
  height?: number;         // Default: 80
}
```

### Visual Design
- Background: white `#ffffff`
- Border: 1.5px solid `#e2e8f0`
- Border radius: 12px
- Box shadow (inactive): `0 2px 12px rgba(0,0,0,0.06)`
- Box shadow (active): `0 0 0 2px #6366f1, 0 4px 20px rgba(99,102,241,0.25)`
- Padding: 16px 24px
- Layout: horizontal flex, icon on left, text stack on right
  - Icon: 36px circle, `#f1f5f9` background, centered, font-size 18px
  - Label: Inter 600, 15px, color `#1e293b`
  - Sublabel (if present): Inter 400, 12px, color `#94a3b8`, margin-top 2px

### Animation
- Entrance: same spring pattern as FileCard
  ```tsx
  const localFrame = Math.max(0, frame - enterFrame);
  const springValue = spring({ frame: localFrame, fps, config: { damping: 200, stiffness: 120 } });
  const translateY = interpolate(springValue, [0, 1], [20, 0]);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  ```
- Active glow: when `active` is true, apply the active box shadow. No animation on the glow itself — it's controlled externally by the parent scene via the `active` prop.

---

## AnimatedArrow Spec

### Props
```tsx
interface AnimatedArrowProps {
  x1: number;         // Start X (absolute px)
  y1: number;         // Start Y (absolute px)
  x2: number;         // End X (absolute px)
  y2: number;         // End Y (absolute px)
  drawFrame: number;  // Frame at which the arrow starts drawing
  drawDuration?: number; // Frames to complete drawing (default: 20)
  color?: string;     // Default: '#cbd5e1' (light slate)
}
```

### Visual Design
- SVG element, absolutely positioned, fills the parent container (`position: absolute, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'`)
- Arrow line: 2px stroke, rounded linecap, color from prop
- Arrowhead: small filled triangle at the end point, pointing in the direction of travel
- Use SVG `strokeDasharray` + `strokeDashoffset` trick for the drawing animation

### Drawing Animation
```tsx
// Calculate total line length
const dx = x2 - x1;
const dy = y2 - y1;
const length = Math.sqrt(dx * dx + dy * dy);

// Animate stroke
const localFrame = Math.max(0, frame - drawFrame);
const progress = interpolate(
  localFrame,
  [0, drawDuration],
  [0, 1],
  { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
);
const dashOffset = length * (1 - progress);
// Apply: strokeDasharray={length} strokeDashoffset={dashOffset}
```

### Arrowhead
Use a simple SVG `<polygon>` at (x2, y2), rotated to match the arrow direction:
```tsx
const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
// Arrowhead: small triangle, 8px wide, 10px long
// Rotate to match direction using transform="rotate(angle, x2, y2)"
// Fade in with the last 20% of draw progress
```

---

## DiagramDemo Composition

Register in `src/Root.tsx`:
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

Create `src/DiagramDemo.tsx` that renders a simplified version of the Scene 4 flow:
5 nodes in a horizontal chain connected by 4 arrows, centered on a `#f8fafc` background.

```tsx
// Nodes — centered horizontally, evenly spaced
const nodes = [
  { label: 'Human + Claude.ai', sublabel: 'writes init file',   icon: '✍',  enterFrame: 10  },
  { label: 'init file',         sublabel: 'feature spec',       icon: '📄', enterFrame: 30  },
  { label: 'Claude Code',       sublabel: '/generate-prp',      icon: '⚡',  enterFrame: 50  },
  { label: 'PRP',               sublabel: 'reviewed + approved', icon: '✓', enterFrame: 70  },
  { label: 'git push',          sublabel: 'auto on completion', icon: '🚀', enterFrame: 90  },
];

// Arrows draw between each consecutive pair of nodes
// drawFrame = enterFrame of the destination node - 5
// (arrow starts drawing just before the next node appears)
```

Set the third node (`Claude Code`) to `active={true}` to demo the glow effect.

Position nodes horizontally across the canvas with equal spacing.
Arrows connect the right edge of each node to the left edge of the next.

---

## Acceptance Criteria
- [ ] DiagramNode renders with correct visual design (white bg, border, border-radius, shadow)
- [ ] Icon circle renders correctly (36px, `#f1f5f9` bg)
- [ ] Label uses Inter 600, 15px, `#1e293b`
- [ ] Sublabel uses Inter 400, 12px, `#94a3b8`
- [ ] Active node shows indigo glow box-shadow
- [ ] DiagramNode spring entrance plays correctly — no bounce
- [ ] AnimatedArrow draws itself from start to end point over `drawDuration` frames
- [ ] Arrow uses easing out cubic curve
- [ ] Arrowhead appears and points in correct direction
- [ ] Arrow SVG is absolutely positioned and doesn't affect layout
- [ ] All 5 nodes stagger in correctly in DiagramDemo
- [ ] All 4 arrows draw between correct node pairs
- [ ] Active glow visible on the third node
- [ ] Background of demo is `#f8fafc`
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
