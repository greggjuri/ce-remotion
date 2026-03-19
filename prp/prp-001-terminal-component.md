# PRP-001: Terminal Component

## Source
- Init file: init/init-001-terminal-component.md
- References: docs/decisions.md, docs/task.md, docs/planning.md

## Objective
Build a reusable `<Terminal />` component that renders a macOS-style terminal window with typewriter animation, blinking cursor, and spring entrance — used in Scenes 1, 3, and 5.

## Scope
- Files to CREATE:
  - `src/components/Terminal.tsx` — the Terminal component
  - `src/TerminalDemo.tsx` — demo composition wrapper for isolated preview
- Files to MODIFY:
  - `src/Root.tsx` — register `TerminalDemo` composition, add font loading
- Files NOT touched:
  - `src/Composition.tsx` — existing placeholder, untouched
  - All `docs/` files — read-only reference
  - All scene files — none exist yet

## Remotion Patterns Used
- **Typewriter** (task.md) — `interpolate()` over `command.length / charsPerSecond * fps` range, slice text
- **Blinking cursor** (task.md) — `Math.floor(frame / (fps * 0.5)) % 2`, solid when typing
- **Spring slide-in** (task.md) — `spring({ frame, fps, config: { damping: 200, stiffness: 100 } })`, translateY 60→0
- **Fade in** (task.md) — `interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })`
- **Font loading** (task.md) — `@remotion/google-fonts` for JetBrains Mono and Inter

## Implementation Steps

### Step 1: Install font dependency
```bash
npm install @remotion/google-fonts
```
Confirm `@remotion/google-fonts` is available. The project already has Remotion installed from the scaffold.

### Step 2: Create `src/components/Terminal.tsx`

Define the `TerminalLine` type and `TerminalProps` interface:

```tsx
type TerminalLine =
  | { type: 'input'; text: string }
  | { type: 'output'; text: string }
  | { type: 'gap' };

interface TerminalProps {
  lines: TerminalLine[];
  startFrame?: number;        // default: 0
  charsPerSecond?: number;    // default: 18
  title?: string;             // default: "bash"
  width?: string;             // default: "100%"
  height?: string;            // default: "100%"
}
```

**Animation state machine logic:**
1. Walk through `lines` sequentially. Maintain a running frame counter starting at `startFrame`.
2. For each `input` line, calculate its duration: `Math.ceil((text.length / charsPerSecond) * fps)` frames.
3. For each `output` line immediately after an `input`, it appears instantly once the preceding input finishes (0 additional frames).
4. For `gap` lines, add 0 frames.
5. At the current `frame`, determine:
   - Which lines are fully visible
   - Which `input` line (if any) is currently being typed, and how many characters are visible
   - Whether the cursor is in a "typing" state (solid) or "idle" state (blinking)
6. Cursor position: always at the end of the last typed character on the last visible line.

**Rendering:**
- Outer `div`: applies spring translateY + fade opacity (entrance animation)
- Title bar div: `#1e2433` background, traffic light dots (3 small circles), centered title text (Inter, 13px, `#8b9ab0`), rounded top corners
- Body div: `#0f172a` background, 24px padding, rounded bottom corners, overflow hidden
- Each visible line rendered as a div:
  - `input`: green `~ ` prompt (`#22c55e`), muted ` $ ` (`#94a3b8`), then typed text (`#e2e8f0`)
  - `output`: full text in muted color (`#94a3b8`)
  - `gap`: empty div with ~line-height spacing
- Cursor: 2px wide, full line height, `#6366f1`, positioned after last character. Use `display: inline-block` with a small width. Blinks every 0.5s when idle, solid when typing. **Note:** Apply `vertical-align: text-bottom` on the cursor span to prevent misalignment with JetBrains Mono's monospace character widths — verify in Studio that it doesn't jump or shift.

**Key implementation detail — sequential line timing:**
```tsx
// Pseudocode for the core logic
let frameOffset = startFrame;
const lineStates = lines.map((line) => {
  if (line.type === 'input') {
    const duration = Math.ceil((line.text.length / charsPerSecond) * fps);
    const state = { ...line, startAt: frameOffset, duration };
    frameOffset += duration;
    return state;
  }
  // output and gap: appear instantly after previous, zero duration
  return { ...line, startAt: frameOffset, duration: 0 };
});
```

Then for rendering, use `frame` (from `useCurrentFrame()`) to determine visible chars per input line and which lines to show.

### Step 3: Create `src/TerminalDemo.tsx`

Simple wrapper that centers the Terminal on a `#0f172a` background at full viewport size. Uses the sample `lines` array from the init spec:

```tsx
const lines: TerminalLine[] = [
  { type: 'input',  text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'And what does your folder structure look like?' },
  { type: 'gap' },
  { type: 'output', text: '(AI has no context. Just guessing.)' },
];
```

Render Terminal inside a centered flex container, giving it a width of ~`80%` so it doesn't touch the edges.

### Step 4: Modify `src/Root.tsx`

1. Add font loading at the top level (Inter + JetBrains Mono) using `@remotion/google-fonts`.
2. Register the `TerminalDemo` composition:
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
3. Keep the existing `MyComp` composition for now (don't break anything).
4. Delete `src/Composition.tsx` — it's the blank placeholder from the scaffold and will be unused clutter once Terminal exists. Remove its import from `Root.tsx` as well.

### Step 5: Verify in Remotion Studio

Run `npm run dev`, open Remotion Studio, select `TerminalDemo`, and verify:
- Terminal slides in with spring animation (no bounce)
- Typewriter types the command at ~18 chars/second
- Output lines appear immediately after typing completes
- Cursor blinks when idle, solid when typing
- Colors, fonts, and spacing match the spec
- No console errors or TypeScript errors

## Acceptance Criteria
- [ ] Terminal window renders with correct macOS chrome (traffic lights with correct colors, title bar)
- [ ] Typewriter animation works for `input` lines at ~18 chars/second
- [ ] Output lines appear immediately after their preceding input finishes typing
- [ ] `gap` lines render as empty spacing
- [ ] Cursor blinks at 0.5s interval when idle, solid when typing
- [ ] Cursor color is `#6366f1` (indigo), 2px wide
- [ ] Terminal text uses JetBrains Mono 18px; title bar uses Inter 13px
- [ ] Input text color: `#e2e8f0`; output text color: `#94a3b8`; prompt `~` green `#22c55e`
- [ ] Entrance spring animation plays correctly (translateY 60→0, opacity 0→1) — no bounce
- [ ] `TerminalDemo` composition visible and previewable in Remotion Studio
- [ ] No TypeScript errors
- [ ] Renders correctly at 1920x1080, 30fps
- [ ] Colors match docs/decisions.md values
- [ ] Git committed and pushed on completion

## Confidence Score
9/10 — High confidence. The init spec is detailed and all patterns are documented in task.md. The only minor uncertainty is whether `@remotion/google-fonts` package ships both Inter and JetBrains Mono (it does — they're Google Fonts). No architectural decisions needed beyond what the init file specifies.
