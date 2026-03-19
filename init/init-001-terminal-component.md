# init-001: Terminal Component

## Overview
Build a reusable `<Terminal />` component that renders a macOS-style terminal window.
This is the foundational component used in Scenes 1, 3, and 5. Build and validate it
in isolation before any scene work begins.

## Reference Files
- `docs/decisions.md` — colors, fonts, composition specs
- `docs/task.md` — typewriter pattern, blinking cursor, spring animations
- `docs/planning.md` — how Terminal is used across scenes

---

## What To Build

### File to create
`src/components/Terminal.tsx`

### File to modify
`src/Root.tsx` — add a temporary `TerminalDemo` composition for isolated preview

---

## Terminal Component Spec

### Props
```tsx
interface TerminalProps {
  lines: TerminalLine[];        // Lines to display (see TerminalLine type below)
  startFrame?: number;          // Frame at which typing begins (default: 0)
  charsPerSecond?: number;      // Typing speed (default: 18)
  title?: string;               // Window title bar text (default: "bash")
  width?: string;               // CSS width (default: "100%")
  height?: string;              // CSS height (default: "100%")
}

type TerminalLine =
  | { type: 'input';  text: string }   // A command the user types (shows prompt + typewriter)
  | { type: 'output'; text: string }   // A response line (appears instantly after input done)
  | { type: 'gap' }                    // An empty line for spacing
```

### Visual Design
- Window chrome: macOS style
  - Title bar: `#1e2433` with three traffic light dots (red `#ff5f57`, yellow `#febc2e`, green `#28c840`)
  - Title text centered in title bar: font Inter, 13px, color `#8b9ab0`
  - Terminal body background: `#0f172a`
  - Body padding: 24px
- Prompt: `~` in `#22c55e` (green), then ` $ ` in `#94a3b8` (muted)
- Input text color: `#e2e8f0`
- Output text color: `#94a3b8` (muted, dimmer than input)
- Font: JetBrains Mono, 18px
- Blinking cursor: `#6366f1` (indigo), 2px wide, full line height
  - Blinks at 0.5s interval when not typing
  - Solid when typing

### Animation Behavior
1. Component receives `lines` array and animates through them sequentially
2. Each `input` line types out character by character at `charsPerSecond`
3. After an input line finishes, `output` lines immediately below it appear (no delay)
4. `gap` lines take no time
5. Cursor stays at the end of the last typed character at all times
6. Use the typewriter pattern from `docs/task.md` exactly

### Entrance Animation
- The Terminal window itself slides up from below on mount using spring
- `spring({ frame, fps, config: { damping: 200, stiffness: 100 } })`
- `translateY` from `60px` to `0`
- Fade in simultaneously: opacity 0 → 1 over 12 frames

---

## TerminalDemo Composition

Register a temporary composition in `src/Root.tsx` for isolated preview:

```tsx
<Composition
  id="TerminalDemo"
  component={TerminalDemo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

Create `src/TerminalDemo.tsx` that renders Terminal centered on a `#0f172a` background
with this sample content:

```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'And what does your folder structure look like?' },
  { type: 'gap' },
  { type: 'output', text: '(AI has no context. Just guessing.)' },
];
```

---

## Acceptance Criteria
- [ ] Terminal window renders with correct macOS chrome (traffic lights, title bar)
- [ ] Typewriter animation works for `input` lines at correct speed
- [ ] Output lines appear immediately after their preceding input finishes
- [ ] Cursor blinks when idle, solid when typing
- [ ] Cursor color is `#6366f1` (indigo)
- [ ] Fonts are JetBrains Mono for terminal text, Inter for title bar
- [ ] Entrance spring animation plays correctly — no bounce
- [ ] TerminalDemo composition visible and previewable in Remotion Studio
- [ ] No TypeScript errors
- [ ] Git committed and pushed on completion
