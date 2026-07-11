# Draft: About Tab AOA Redesign

## Intent Routing
- **intent:** CLEAR
- **review_required:** false (user gave very specific visual feedback)
- **rationale:** User explicitly described the desired outcome: eye shot from above with border/!!, AOA on #15c2fc bg, content on AOA art, no Submenu wrapper.

## Key Decisions
1. **Standalone component**: AboutSubmenu no longer wraps Submenu component — avoids the circle-expand conflict and gives full visual control.
2. **AOA bg color**: `#15c2fc` (Makoto's all-out attack color).
3. **AOA art sizing**: `object-fit: cover` with `object-position: center 30%` — prevents black bars on 16:9 screens by cropping the top of the 2048×2048 square art.
4. **Permanent AOA background**: Content phase keeps AOA art at `opacity: 0.5`, `blur(2px)`, `brightness(0.6)` as a permanent background layer.
5. **Content panel**: Semi-transparent `rgba(0,0,0,0.25)` + `backdrop-filter: blur(8px)` — AOA art visible through the edges.
6. **Eye shot border**: CSS jagged clip-path border + 4 corner marks + two `!!` exclamation marks + impact lines — recreates the P3R all-out attack cut-in aesthetic.
7. **Eye shot enter**: `translateY(-100vh)` → `translateY(0)` — drops from above over the fading main menu.
8. **Timing (spaced out)**: Eye 900ms → AOA 1600ms (total 2.5s) → Content.

## Must-NOT-Have
- No `<Submenu>` component wrapper in AboutSubmenu
- No circle-expand animation for About tab
- No black bars on AOA art (`object-fit: cover`)
- No solid blue overlay during intro (transparent bg → main menu visible behind dim)
- No iconify-icon dependency that isn't already in portfolio.ts

## Files to Modify
1. `src/lib/components/AboutSubmenu.svelte` — full rewrite (standalone)
2. `src/lib/components/Submenu.svelte` — cleanup `skipTransition`/`onIntroBack` if unused

## Approval Gate
- **status:** awaiting-approval
- **pending action:** write `.omo/plans/about-tab-aoa-redesign.md`
- **approach:** Execute todos 1-6 via worker agent

## Verification Wave
- Build succeeds (`npm run build`)
- About tab opens with eye → AOA → content sequence
- No black bars on AOA art
- Eye shot has border + !! marks + corners + impact lines
- Content shows on AOA background with transparent sides
- B/Escape skips intro or closes
- ← → switches tabs
- Close animates with fade-out
