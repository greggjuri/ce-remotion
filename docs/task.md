# task.md — ce-remotion

Technical gotchas, patterns, and implementation notes. Read before every implementation task.

---

## Remotion Core Rules

- All animation MUST be driven by `useCurrentFrame()` — no `setTimeout`, no `useEffect` timers
- `interpolate()` always needs explicit clamp:
  ```tsx
  interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  ```
- `spring()` for entrance animations — use high damping to kill bounce:
  ```tsx
  spring({ frame, fps, config: { damping: 200, stiffness: 100 } })
  ```
- `<Sequence from={n}>` resets child frame to 0 at global frame n — children should not know global timing
- Never hardcode frame numbers. Always derive from fps × seconds:
  ```tsx
  const { fps } = useVideoConfig();
  const START = 2 * fps; // 2 seconds in
  ```

---

## Master Composition Timing

Track scene offsets in a single `TIMINGS` constant in `Master.tsx`:

```tsx
const TIMINGS = {
  scene01: { from: 0,   duration: 8  * fps },
  scene02: { from: 240, duration: 7  * fps },
  scene03: { from: 450, duration: 15 * fps },
  scene04: { from: 900, duration: 20 * fps },
  scene05: { from: 1500, duration: 15 * fps },
  scene06: { from: 1950, duration: 10 * fps },
};
```

Adjust durations here only — never in individual scene files.

---

## Typewriter Animation Pattern

```tsx
const command = "npx claude --context CLAUDE.md";
const charsPerSecond = 18;
const { fps } = useVideoConfig();
const frame = useCurrentFrame();

const visibleChars = Math.floor(
  interpolate(
    frame,
    [0, (command.length / charsPerSecond) * fps],
    [0, command.length],
    { extrapolateRight: 'clamp' }
  )
);
const displayedText = command.slice(0, visibleChars);
const isTyping = visibleChars < command.length;
```

---

## Staggered List / Item Reveal

```tsx
const itemDelayFrames = 4; // frames between each item appearing
const visibleItems = items.filter((_, i) => frame >= i * itemDelayFrames);
```

---

## Blinking Cursor

```tsx
const { fps } = useVideoConfig();
const blink = Math.floor(frame / (fps * 0.5)) % 2 === 0; // toggles every 0.5s
const opacity = isTyping ? 1 : (blink ? 1 : 0);
```

---

## Spring Slide-In from Bottom

```tsx
const slideIn = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
const translateY = interpolate(slideIn, [0, 1], [80, 0]);
// Apply: style={{ transform: `translateY(${translateY}px)` }}
```

---

## Fade In

```tsx
const opacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
```

---

## Tailwind in Remotion

- Install: `npm install @remotion/tailwind`
- Add to `remotion.config.ts`:
  ```ts
  import { enableTailwind } from '@remotion/tailwind';
  // inside config:
  enableTailwind()
  ```
- Use Tailwind for layout (`flex`, `gap`, `p-`, `rounded`) only
- Use inline `style={{}}` for all animated properties

---

## Font Loading

Use `@remotion/google-fonts` for Inter and JetBrains Mono:
```tsx
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
const { fontFamily: monoFont } = loadJetBrains('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
```

Always pass the `'normal'` style as the first argument, plus `weights` and `subsets` to avoid ~200+ unnecessary network requests per render. Omitting these options loads every weight and subset, which triggers noisy console warnings and slows down renders.

Call at the top of `Root.tsx` so fonts are available globally.

---

## Git Auto-Commit (Required After Every Feature)

At the end of every `execute-prp` run, Claude Code must execute:
```bash
git add -A && git commit -m "feat: <short description of what was built>" && git push origin main
```

---

## M1 MacBook Notes

- Use `nvm` for Node version — ensure Node 18+ is active
- Remotion Studio: `npm run dev` → `localhost:3000`
- Render: `npx remotion render Master out/ce-remotion.mp4`
- If Chrome Headless Shell download is slow, it only happens once per machine
