# testing.md — ce-remotion

Review checklist and testing procedure for each scene and the final render.

---

## Remotion Studio Review (Per Scene)

Before marking any scene complete, verify the following in Remotion Studio (`localhost:3000`):

### Animation
- [ ] Entrance animation plays correctly from frame 0 of the scene
- [ ] No elements visible before they should appear
- [ ] No elements disappearing before the scene ends
- [ ] Spring animations have no bounce (high damping confirmed)
- [ ] Typewriter speed feels natural (not too fast, not too slow)
- [ ] Staggered items reveal at a readable pace

### Typography
- [ ] JetBrains Mono used in all terminal windows
- [ ] Inter used in all diagram and UI text
- [ ] Font sizes are legible at 1920×1080
- [ ] No text overflow or clipping

### Layout
- [ ] All elements respect safe zone margins (min 80px from edges)
- [ ] No overlapping elements (unless intentional)
- [ ] Light/dark background matches the scene spec in `planning.md`
- [ ] Colors match values in `decisions.md`

### Timing
- [ ] Scene duration matches the target in `planning.md` (within ±1s)
- [ ] Last frame of scene is clean — no half-finished animations

---

## Master Composition Review

After wiring all scenes in `Master.tsx`:

- [ ] Scene transitions are clean — no visual pop between scenes
- [ ] TIMINGS constant accounts for all scenes, no gaps or overlaps
- [ ] Total duration is ~75s (2100–2400 frames acceptable)
- [ ] Scrubbing through the full timeline looks correct

---

## Final Render Checklist

Run: `npx remotion render Master out/ce-remotion.mp4`

- [ ] Render completes without errors
- [ ] Video plays correctly in QuickTime / VLC
- [ ] No dropped frames or stuttering
- [ ] No font rendering artifacts (white boxes, fallback fonts)
- [ ] File size is reasonable (< 50MB for blog embed)
- [ ] Total runtime matches target

---

## Blog Embed Test

Once the video is ready for publishing:

- [ ] Upload to appropriate host (YouTube unlisted, S3, or direct)
- [ ] Embed in a test WordPress/Elementor page on jurigregg.com
- [ ] Video plays inline without autoplay issues
- [ ] Thumbnail / poster frame is clean (first frame or custom)
- [ ] Mobile playback confirmed

---

## Notes

- Use `/clear` in Claude Code between scene builds to reset context
- If a scene looks wrong, check Master.tsx TIMINGS before debugging the scene itself
- Scrub slowly through transitions — timing bugs are often invisible at playback speed
