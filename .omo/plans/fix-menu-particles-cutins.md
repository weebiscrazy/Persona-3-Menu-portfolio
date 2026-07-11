# Fix Menu, Add Canvas Particles (per submenu), Unique Cut-in Animations

## Context
Real project is `p3r-pause-menu-main` (untouched). The repo `p3r-pause-menu-repo` has a self-contained `ParticleCanvas.svelte` with 4 canvas-based particle presets — those are the effects to bring over.

## Changes

### 1. Delete the mess
- User manually deletes `C:\Users\lolma\Downloads\p3r-pause-menu-repo`

### 2. Option.svelte — center text (safe repo integration)
- `x="150"` → `x="475"`, `text-anchor="middle"`, `transform-origin="center center"`
- **File:** `src/lib/components/Option.svelte`

### 3. Copy ParticleCanvas.svelte from repo
- Self-contained canvas component with 4 presets:
  - `water`: blue droplets with specular highlights (About)
  - `petals`: pink teardrop petals with vein details (Social)
  - `electric`: gold/white jagged lightning lines (Friends)
  - `data`: green hexagons + rounded squares with glow (Persona)
- **New file:** `src/lib/components/ParticleCanvas.svelte`
- Copied from `p3r-pause-menu-repo\src\lib\components\ParticleCanvas.svelte` verbatim

### 4. Submenu.svelte — render ParticleCanvas per type
- Add `particleType` prop: `{ particleType = "water" }`
- Add `<ParticleCanvas type={particleType} />` alongside existing `<Particles />` (bubbles stay as secondary ambient layer but canvas particles are the primary effect)
- **File:** `src/lib/components/Submenu.svelte`

### 5. AboutSubmenu — already has cut-in, add particleType="water"
- **File:** `src/lib/components/AboutSubmenu.svelte` — pass `particleType="water"`

### 6. SocialSubmenu — add rose-petal AOA intro + particleType="petals"
- Add eye→aoa→content AOA sequence (same structure as AboutSubmenu's)
- Uses Yukari assets: `Glass_0002.png`, `Pc02_A1out.png`, `Pc02out.png`
- Pass `particleType="petals"` to Submenu
- **File:** `src/lib/components/SocialSubmenu.svelte`

### 7. FriendsSubmenu — add electric AOA intro + particleType="electric"
- Add eye→aoa→content AOA sequence
- Uses Sanada assets: `Glass_0004.png`, `Pc04_A1out.png`, `Pc04out.png`
- Pass `particleType="electric"` to Submenu
- **File:** `src/lib/components/FriendsSubmenu.svelte`

### 8. PersonaSubmenu — add data AOA intro + particleType="data"
- Add eye→aoa→content AOA sequence
- Uses Ken assets: `Glass_0008.png`, `Pc08_A1out.png`, `Pc08out.png`
- Pass `particleType="data"` to Submenu
- **File:** `src/lib/components/PersonaSubmenu.svelte`

### 9. Build + verify
- `npm run build` must compile clean
- Expected: Vercel adapter EPERM on Windows (not a code issue)

## Risk assessment
- ParticleCanvas.svelte is self-contained (no deps, no type imports) — zero risk to existing code
- Submenu.svelte just adds an import + component render — backward compatible
- AOA intros follow AboutSubmenu's existing pattern exactly — proven pattern
- Option.svelte change is cosmetic only

## Files changed
1. `src/lib/components/Option.svelte` — text centering
2. `src/lib/components/ParticleCanvas.svelte` — **new file** (canvas particles from repo)
3. `src/lib/components/Submenu.svelte` — particleType prop + ParticleCanvas render
4. `src/lib/components/AboutSubmenu.svelte` — particleType="water"
5. `src/lib/components/SocialSubmenu.svelte` — AOA intro + particleType="petals"
6. `src/lib/components/FriendsSubmenu.svelte` — AOA intro + particleType="electric"
7. `src/lib/components/PersonaSubmenu.svelte` — AOA intro + particleType="data"
