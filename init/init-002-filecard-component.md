# init-002: FileCard Component

## Overview
Build a reusable `<FileCard />` component that displays a CE file as an animated card.
Used in Scene 2 where the four CE artifacts (CLAUDE.md, decisions.md, task.md, PRP)
animate in one by one to introduce the CE system.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs
- `docs/task.md` — spring animations, stagger pattern
- `docs/planning.md` — Scene 2 storyboard (2×2 grid, spring entrance per card)

---

## What To Build

### Files to create
- `src/components/FileCard.tsx` — the FileCard component
- `src/FileCardDemo.tsx` — demo composition for isolated preview

### Files to modify
- `src/Root.tsx` — register `FileCardDemo` composition

---

## FileCard Component Spec

### Props
```tsx
interface FileCardProps {
  filename: string;          // e.g. "CLAUDE.md"
  description: string;       // one-line description
  icon: 'rules' | 'decisions' | 'task' | 'prp';  // determines icon + accent color
  enterFrame: number;        // global frame at which this card springs in
}
```

### Icon + Accent Color Map
| icon value  | emoji/symbol | accent color         |
|-------------|-------------|----------------------|
| `rules`     | ⚙           | `#6366f1` (indigo)   |
| `decisions` | ✓           | `#22c55e` (green)    |
| `task`      | ⚡           | `#f59e0b` (amber)    |
| `prp`       | ▶           | `#3b82f6` (blue)     |

### Visual Design
- Background: white `#ffffff`
- Border: 1px solid `#e2e8f0`
- Border radius: 16px
- Box shadow: `0 4px 24px rgba(0,0,0,0.08)`
- Padding: 32px
- Width: ~380px, Height: ~200px
- Layout (top to bottom):
  1. Icon circle — 48px circle, accent color background at 15% opacity, icon centered in accent color, font size 22px
  2. Filename — 20px, Inter, font-weight 700, color `#1e293b`, margin-top 16px
  3. Description — 14px, Inter, font-weight 400, color `#64748b`, margin-top 8px

### Entrance Animation
Each card springs in independently based on its `enterFrame` prop:
```tsx
const localFrame = Math.max(0, frame - enterFrame);
const springValue = spring({
  frame: localFrame,
  fps,
  config: { damping: 200, stiffness: 120 },
});
const translateY = interpolate(springValue, [0, 1], [40, 0]);
const opacity = interpolate(springValue, [0, 1], [0, 1]);
```
- Cards that haven't reached their `enterFrame` yet are invisible (`opacity: 0`, `pointerEvents: 'none'`)

---

## FileCardDemo Composition

Register in `src/Root.tsx`:
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

Create `src/FileCardDemo.tsx` that renders all four cards in a 2×2 grid,
centered on a `#f8fafc` background, with staggered `enterFrame` values:

```tsx
const cards = [
  { filename: 'CLAUDE.md',     description: 'Project rules & conventions',      icon: 'rules',     enterFrame: 10  },
  { filename: 'decisions.md',  description: 'Confirmed architectural choices',   icon: 'decisions', enterFrame: 25  },
  { filename: 'task.md',       description: 'Technical gotchas & patterns',      icon: 'task',      enterFrame: 40  },
  { filename: 'PRP',           description: 'Scoped task with acceptance criteria', icon: 'prp',    enterFrame: 55  },
];
```

Grid layout: 2 columns, 2 rows, gap of 32px between cards, centered in the canvas.

---

## Acceptance Criteria
- [ ] Card renders with correct visual design (white bg, border, shadow, rounded corners)
- [ ] Icon circle uses correct accent color per `icon` prop at 15% opacity background
- [ ] Filename uses Inter 700, 20px, color `#1e293b`
- [ ] Description uses Inter 400, 14px, color `#64748b`
- [ ] Spring entrance animation plays correctly — no bounce
- [ ] Cards before their `enterFrame` are fully invisible
- [ ] All four cards visible and correctly staggered in `FileCardDemo`
- [ ] Background of demo is `#f8fafc`
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
