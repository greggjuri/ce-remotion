# decisions.md — ce-remotion

All decisions below are confirmed and locked. Do not override without explicit human approval.

---

## Video

| Decision | Value |
|---|---|
| Resolution | 1920×1080, 30fps |
| Target length | ~75 seconds |
| Output format | MP4 via `npx remotion render` |
| Audio | None (text + animation only — blog embed context) |

---

## Scene Structure (6 scenes)

| # | Scene | Duration |
|---|---|---|
| 1 | The Problem — vague prompt, bad AI response | ~8s |
| 2 | File Cards — CLAUDE.md, decisions.md, task.md, PRP animate in | ~7s |
| 3 | CLAUDE.md Deep Dive — typewriter + annotation arrows | ~15s |
| 4 | PRP Flow Diagram — animated flowchart | ~20s |
| 5 | The Payoff — same task with CE, clean diff | ~15s |
| 6 | Outro — jurigregg.com branding | ~10s |

---

## Visual Style

| Element | Value |
|---|---|
| Terminal scene background | `#0f172a` (dark slate) |
| Diagram scene background | `#f8fafc` (near white) |
| Terminal font | JetBrains Mono |
| UI / diagram font | Inter |
| Primary accent | `#6366f1` (indigo) |
| Success color | `#22c55e` (green) |
| Error color | `#ef4444` (red) |
| Neutral text (dark bg) | `#e2e8f0` |
| Neutral text (light bg) | `#1e293b` |

---

## Components

| Component | Purpose |
|---|---|
| `<Terminal />` | macOS-style dark window, typewriter-capable |
| `<FileCard />` | Animated card for CE file reveals |
| `<DiagramNode />` | Rounded rect with label, connectable via arrows |
| `<AnimatedArrow />` | SVG arrow between diagram nodes |
| `<CodeDiff />` | Before/after diff display with red/green lines |

---

## Git / Publishing

| Decision | Value |
|---|---|
| Repo | `github.com/greggjuri/ce-remotion` |
| Branch | `main` |
| Auto-commit | After every scene/component completion |
| Publishing target | jurigregg.com blog post (embedded video + written walkthrough) |

---

## Remotion Configuration

| Setting | Value |
|---|---|
| Composition ID | `Master` |
| Width | 1920 |
| Height | 1080 |
| FPS | 30 |
| Duration | 2250 frames (~75s) |
| Tailwind | Enabled via `@remotion/tailwind` |
