## TL;DR (For humans)

Redesign the About tab to be a **standalone full-screen component** (no Submenu wrapper). The all-out attack art becomes the permanent background. Opening sequence: eye cut-in drops from above over the fading main menu → AOA art slams in on `#15c2fc` background → content overlays on the AOA art with transparent side sections.

## Todos

### Todo 1: Rewrite AboutSubmenu.svelte as standalone component

**WHERE:** `src/lib/components/AboutSubmenu.svelte`

**HOW:** Replace the entire file with a self-contained component that:
- Has NO dependency on `Submenu.svelte` (no `<Submenu>` tag)
- Manages its own layout, tabs, keyboard handling, and close behavior
- Owns the 3-phase state machine (`eye` → `aoa` → `content`)

**Changes:**
- Remove `import Submenu from "./Submenu.svelte"` — not needed anymore
- Add `import { fade } from "svelte/transition"` for the fade-out
- Add direct keyboard handler (← → for tabs, B/Escape for skip/close)
- Own `handleClose()` that calls `(window as any).closeSubmenu?.()` with a 400ms close animation
- Type: `about-root fixed inset-0 z-50` with `role="dialog"` and `tabindex="-1"`

**EXPECTED RESULT:** AboutSubmenu is fully self-contained with no Submenu dependencies. Closes properly via `window.closeSubmenu`.

**ACCEPTANCE:** Build passes. Clicking ABOUT shows the new standalone layout. Pressing B closes it.

**QA:** `npm run build` succeeds. No circular or missing dependency errors.

**COMMIT:** `AboutSubmenu: standalone component, no Submenu wrapper`

---

### Todo 2: Implement 3-phase AOA intro sequence

**WHERE:** `src/lib/components/AboutSubmenu.svelte` — HTML template and `<style>`

**HOW:** 3-phase state machine in the template:

**Phase "eye" (0-500ms):**
- Background: transparent with dim overlay (`rgba(0,34,90,0.7)` that fades in over the main menu)
- Eye cut-in image: `/T_UI_Camp_Status_Character_Glass_0001.png`
- **Position: drops from above** — CSS `@keyframes eye-drop` from `translateY(-100vh)` to `translateY(0)`
- **Border**: `.aoa-eye-border` div wrapped around the eye image with `clip-path: polygon(...)` jagged shape and animated border color
- **Corner marks**: 4 divs (TL, TR, BL, BR) with absolute positioning, 3px solid `#15c2fc` border on two sides each
- **Exclamation marks**: two `!!` span elements positioned at left/top and right/bottom of the eye frame, styled with `font-skip`, `3rem`, white with cyan text-shadow, scale-in animation
- **Impact lines**: `.aoa-impact-lines` div with CSS gradient lines radiating from center, masked with `radial-gradient`, opacity animation

**Phase "aoa" (500-1500ms):**
- Background: solid `#15c2fc`
- AOA art: `/T_Btl_AlloutFinish_Pc01_A1out.png` — `absolute inset-0 w-full h-full object-cover object-position: center 30%` (crops from top to avoid black bars on 16:9 screens)
- Entry animation: `@keyframes aoa-slam` — scale 1.3→1, brightness 1.8→1, 0.5s cubic-bezier
- Name plate: `/T_Btl_AlloutFinishText_Pc01out.png` — centered at bottom 12%, width `min(55vw, 450px)`, slides in from below
- Vignette overlay: radial gradient transparent→black 25%

**Phase "content" (1500ms+):**
- Background layer: AOA art at half opacity + blur(2px) + brightness(0.6) — stays as permanent background
- Content panel: `.about-content-panel` with semi-transparent bg (`rgba(0,0,0,0.25)`), backdrop-blur, narrow max-width, centered
- The AOA art shows through the transparent side sections of the content panel

**Timers in onMount (spaced out — user said original was too fast):**
```
0ms → phase = "eye" (starts immediately)
900ms → phase = "aoa"      ← eye lands + shows border/!! for 0.45s
2500ms → phase = "content"  ← AOA slam settles + name plate fully visible for 1.0s
```

**Skip:** Pressing B during eye or aoa phase immediately sets phase = "content". During content, B closes.

**EXPECTED RESULT:** The 3 phases play in sequence with smooth transitions. Eye shot has jagged frame + !! exclamation marks. AOA art fills screen without black bars. Content appears on the AOA background.

**ACCEPTANCE:** Visual inspection confirms eye frame with border + corner marks + !! marks. AOA art has no black bars (uses `object-fit: cover + object-position: center 30%`). Phase transitions are smooth.

**QA:** Manual visual test in browser. Timers fire correctly.

**COMMIT:** `AOA intro sequence: eye cut-in from above with frame + !! marks, AOA slam on #15c2fc`

---

### Todo 3: Build content layout on AOA background

**WHERE:** `src/lib/components/AboutSubmenu.svelte` — content phase template and `<style>`

**HOW:** Content area splits into:

**Header:**
- `ABOUT` title in font-skip, white with text-shadow
- Tab buttons (Profile / Stats / Bio) with glass-style active state

**Body (desktop, flex-row):**
- **Left (280-340px)**: Makoto Camp Status portrait (`T_UI_Camp_Status_Character_0001.png`) — full height, `object-fit: contain`, `object-position: bottom center`, filtered with `brightness(0.9)` + `drop-shadow(cyan glow)`. Glass edge overlay on right side. Floating animation.
- **Right (flex-1)**: Info panel with semi-transparent bg (`rgba(0,0,0,0.25)` + `backdrop-filter: blur(8px)`). Contains:
  - Name plate image
  - Title + tagline
  - 4-column stats grid
  - Social link row
  - Divider
  - Sub-tab content (Profile text / Stats detail cards / Bio with focus list)
  - Scrollable content area (max 30vh) with cyan custom scrollbar

**Footer:** Control keys (← → Tabs, B Back)

**Mobile (max-width:767px):**
- Stacked layout (no portrait column)
- Stats grid 2 columns
- Info panel full width
- Use `hidden md:flex` for portrait

**EXPECTED RESULT:** Content overlays on the AOA art background. Left portrait + right info. AOA art visible through transparent panel edges. Fully responsive.

**ACCEPTANCE:** All 3 sub-tabs display correct content. Portrait floats. Stats grid renders. Social links are clickable. Mobile stacks properly.

**QA:** Test all 3 tabs. Click social links (open in new tab). Verify mobile layout.

**COMMIT:** `Content layout: AOA art background with portrait + info overlay`

---

### Todo 4: Close animation and edge cases

**WHERE:** `src/lib/components/AboutSubmenu.svelte` — `.about-closing` CSS + keyboard handler

**HOW:**
- Close: `.about-root` gets `class:about-closing={closing}` which triggers `@keyframes about-fade-out` (0.35s ease-in, opacity 1→0)
- After animation completes (400ms), call `(window as any).closeSubmenu?.()`
- Keyboard: ← → switch tabs, B/Escape skips intro or closes
- Prevent arrow keys from scrolling page during intro (preventDefault)
- Tab switching uses `{#key activeTab}` for CSS animation replay

**EXPECTED RESULT:** About tab closes with a fade-out animation. All keyboard interactions work as expected.

**ACCEPTANCE:** Pressing B closes with fade. ← → switch tabs. B during intro skips to content.

**QA:** Manual keyboard test. Verify no console errors.

**COMMIT:** `Close animation + keyboard handling`

---

### Todo 5: Remove unused Submenu props (cleanup)

**WHERE:** `src/lib/components/Submenu.svelte`

**HOW:** The `skipTransition` and `onIntroBack` props were added for the About tab. Since AboutSubmenu is now standalone:
- Remove `skipTransition` and `onIntroBack` props from Submenu.svelte if no other component uses them
- Revert the CSS for `.submenu-skip-transition`
- Revert the intro-related keyboard logic in `handleKeydown`

Check if any OTHER submenu (Social, Friends, Persona) uses these. If not, clean up.

**EXPECTED RESULT:** Submenu.svelte is clean without the intro-specific code.

**ACCEPTANCE:** Build passes. Other submenus still work.

**QA:** Check other submenu imports. `grep` for `skipTransition` usage.

**COMMIT:** `Cleanup: revert unused Submenu props`

---

### Todo 6: Verify P3R eye cut-in reference styling

**WHERE:** Mental design reference (web search)

**HOW:** Before finalizing the eye shot border/!! style, search for P3R all-out attack cut-in screenshots to verify:
- Border style (jagged glass or straight rectangular)
- Exclamation mark positioning and size
- Corner accent style
- Background dim level

Adjust CSS in AboutSubmenu.svelte if needed based on reference.

**EXPECTED RESULT:** The eye shot matches P3R style accurately.

**ACCEPTANCE:** Visual match with game screenshots.

**QA:** Compare with reference images.

### Todo 7: Image preloading before AOA sequence

**WHERE:** `src/lib/components/AboutSubmenu.svelte` — script section

**HOW:** Add image preloading to prevent blank flashes if assets aren't cached:

```typescript
let assetsLoaded = $state(false);

onMount(() => {
  const images = [
    "/T_UI_Camp_Status_Character_Glass_0001.png",    // eye shot
    "/T_Btl_AlloutFinish_Pc01_A1out.png",              // AOA art
    "/T_Btl_AlloutFinishText_Pc01out.png",              // name plate
    "/T_UI_Camp_Status_Character_0001.png"              // camp portrait
  ];
  
  let loaded = 0;
  const onLoad = () => { loaded++; if (loaded === images.length) assetsLoaded = true; };
  
  images.forEach(src => {
    const img = new Image();
    img.onload = onLoad;
    img.onerror = onLoad; // proceed even if one fails
    img.src = src;
  });
  
  // Fallback: start after 3s regardless
  const fallback = setTimeout(() => { assetsLoaded = true; }, 3000);
});
```

The eye phase template is wrapped in `{#if assetsLoaded}...{/if}` to prevent rendering before assets are ready. A brief loading state (just the dim overlay) shows until preload completes.

**EXPECTED RESULT:** No blank flashes on first load. Eye shot appears only after images are cached.

**ACCEPTANCE:** Cold browser load shows dim overlay, then sequence starts smoothly once images are ready. Fallback timer prevents infinite wait.

**QA:** Check in browser DevTools → Network tab → Slow 3G throttling. Verify eye shot doesn't appear blank.

**COMMIT:** `Preload AOA images to prevent blank flashes on cold load`
