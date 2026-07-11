# Unique Eye-Catch Animations + Boost Particles + Persona→Amada

## Changes

### 1. ParticleCanvas.svelte — Boost frequencies + glow/light
- Double counts for all presets (electric 40→80, data 50→100, petals 25→50, water 45→80)
- Increase emission rates (electric 0.3→0.6, data 0.35→0.7, petals 0.1→0.25, water 0.4→0.6)
- Increase shadow blur for all draw types (lines: size*3→size*6, circles: size→size*2, petals: size*0.8→size*2, drops: size→size*2)
- Electric: swap base color to gold (#B8B0A8→#FFD700), secondary white (#FFFFFF)
- Add global composite operation "lighter" for additive blending on glow layers
- Add larger glow particles that spawn less frequently as "flare" layer

### 2. PersonaSubmenu.svelte — Switch Fuuka→Ken Amada (Pc08)
**Assets:**
- `Glass_0005.png` → `Glass_0008.png`
- `Pc05_A1out.png` → `Pc08_A1out.png`
- `Pc05out.png` → `Pc08out.png`
- `0005.png` → `0008.png`
- Arcana: hermit → chariot

**Colors:**
- Green (#4ADE80) → Amber (#EAB308)
- All rgba(74,222,128,*) → rgba(234,179,8,*)
- All green/emerald → amber/yellow
- AOA_BG: "#4ADE80" → "#EAB308"
- All border colors, text-shadows, drop-shadows updated
- Persona content card hover borders: green/50 → amber/50
- Build section: green/10 → amber/10
- Scrollbar thumb: rgba(74,222,128,0.3) → rgba(234,179,8,0.3)
- Tab active: rgba(74,222,128,0.2) → rgba(234,179,8,0.2)

### 3. AboutSubmenu — Unique "Water Ripple" eye intro
**Key difference from current:** Eye appears through expanding concentric water rings instead of dropping from above.

**CSS changes (replace eye-drop with ripple-reveal):**
- `.aoa-eye-wrap`: remove `eye-drop`, add `ripple-reveal`
- `@keyframes ripple-reveal`: eye scales up from 0.3 while expanding ripple rings radiate from center, opacity pulses
- Add `.aoa-ripple-ring` elements: 3 concentric circles that animate `scale(0→3)` with `opacity 0.8→0` at staggered delays
- Keep `.aoa-eye-img` zoom animation but make it start smaller (scale 0.3→1)
- Ripple ring CSS: `position: absolute; border-radius: 50%; border: 2px solid rgba(21,194,252,0.4); width: 100%; aspect-ratio: 1; animation: ring-expand 0.8s ease-out forwards;`
- `@keyframes ring-expand`: `from { transform: scale(0.3); opacity: 0.8; } to { transform: scale(3); opacity: 0; }`
- Add staggered delays: ring1 0s, ring2 0.15s, ring3 0.3s
- Background dim: current rgba(0,34,90,0.7) is fine, but animate it faster

### 4. SocialSubmenu — Unique "Petal Bloom" eye intro
**Key difference:** Petals spiral inward from edges, converge at center, eye blooms open.

**CSS changes:**
- `.social-eye-wrap`: add `bloom-reveal` animation
- `@keyframes bloom-reveal`: eye scales from 0 + rotates 90deg → 1 + 0deg, with elastic bounce
- Add `.social-petal-vortex` div containing 12 petal elements positioned in a circle around center (CSS pseudo-elements or absolute-positioned divs)
- Each petal: `position: absolute; width: 8px; height: 20px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #e8588c; opacity: 0;`
- Animate petals: `@keyframes petal-spiral`: from `transform: rotate(angle) translateX(200px) rotate(-angle); opacity: 0.8;` to `transform: rotate(angle) translateX(20px) rotate(-angle); opacity: 0;`
- Each petal gets staggered delay via `--i` custom property: `animation-delay: calc(var(--i) * 0.04s)`
- Petal positions: calculate angles 0°, 30°, 60°, ... 330°
- Eye zoom: starts tiny (scale 0.2), rotates in, ends at scale 1

### 5. FriendsSubmenu — Unique "Lightning Crack" eye intro
**Key difference:** Dark screen, random lightning bolts crack across, converge on center, eye appears as bolts shatter.

**CSS changes:**
- `.friends-eye-wrap`: add `crack-reveal` animation
- `@keyframes crack-reveal`: eye zooms from 0.5 with brightness 3, overshoots to 1.1, settles to 1
- Add `.friends-lightning-bolts` div with CSS jagged border animation
- Create lightning bolt effect using `clip-path` polygon with jagged edges that animate:
  ```
  .friends-lightning-bolt {
    position: absolute;
    width: 4px;
    background: linear-gradient(to bottom, #FFD700, #fff, #FFD700);
    filter: drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFD700);
    animation: bolt-strike 0.15s ease-out;
  }
  @keyframes bolt-strike {
    0% { opacity: 0; transform: scaleY(0); }
    20% { opacity: 1; transform: scaleY(1); }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
  ```
- Add 5-7 bolt elements at different positions/angles, staggered delays
- Add a bright white flash overlay: `.friends-flash` that animates opacity 0→0.9→0 in 0.2s
- Eye image has a stronger drop-shadow: `drop-shadow(0 0 60px #FFD700) drop-shadow(0 0 120px #FFD700)`
- Border flicker is faster, more intense (0.3s instead of 0.6s)
- Exclamation marks: gold text-shadow, more glow

### 6. PersonaSubmenu — Unique "Digital Scan" eye intro
**Key difference:** Scanlines sweep, hex grid assembles, eye forms from digital fragments.

**CSS changes:**
- `.persona-eye-wrap`: add `scan-reveal` animation
- `@keyframes scan-reveal`: eye scales from 0.5 with blur(10px), sharpens as it scales
- Replace `.persona-impact-lines` with `.persona-scanlines`:
  ```
  .persona-scanlines {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(234,179,8,0.03) 2px, rgba(234,179,8,0.03) 4px
    );
    animation: scan-sweep 0.6s ease-out forwards;
    z-index: 6;
  }
  @keyframes scan-sweep {
    0% { clip-path: inset(0 0 100% 0); }
    100% { clip-path: inset(0 0 0% 0); }
  }
  ```
- Add `.persona-glitch-squares` container with small randomly-positioned amber squares that fade in/out:
  ```
  .persona-glitch-square {
    position: absolute;
    width: 12px; height: 12px;
    background: rgba(234,179,8,0.3);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    animation: glitch-pop 0.15s ease-out forwards;
  }
  @keyframes glitch-pop {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.3); }
    100% { opacity: 0; transform: scale(0.8); }
  }
  ```
- Add 10-15 hex glitch squares at random positions, each with random animation-delay
- Eye border: change to `#EAB308` with double-thickness, add `box-shadow: 0 0 30px rgba(234,179,8,0.3)`
- Eye image: `filter: drop-shadow(0 0 40px rgba(234,179,8,0.5)) drop-shadow(0 0 80px rgba(234,179,8,0.2))`
- Corner brackets also amber, thicker
- Exclamation marks: amber text-shadow, data-style glow

## Files changed
1. `src/lib/components/ParticleCanvas.svelte` — boosted counts, glow, light
2. `src/lib/components/AboutSubmenu.svelte` — water ripple eye intro
3. `src/lib/components/SocialSubmenu.svelte` — petal bloom eye intro
4. `src/lib/components/FriendsSubmenu.svelte` — lightning crack eye intro
5. `src/lib/components/PersonaSubmenu.svelte` — Ken Amada assets + digital scan eye intro

## Build
- `npm run build` must compile clean (234 modules, 0 errors)
- Push to main and verify Vercel deploy
