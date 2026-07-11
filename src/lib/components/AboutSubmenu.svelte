<script lang="ts">
	import { onMount } from "svelte";
	import Control from "./Control.svelte";
	import ParticleCanvas from "./ParticleCanvas.svelte";
	import { profileData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);
	let phase = $state<"eye" | "aoa" | "content">("eye");
	let closing = $state(false);

	const tabs = [
		{ name: "Profile", index: 0, arcanaNumber: "0" },
		{ name: "Stats", index: 1, arcanaNumber: "XI" },
		{ name: "Bio", index: 2, arcanaNumber: "IX" }
	];

	const AOA_BG = "#15c2fc";

	function skipToContent(): boolean {
		if (phase === "content") return false;
		phase = "content";
		return true;
	}

	function handleClose() {
		if (closing) return;
		closing = true;
		setTimeout(() => (window as any).closeSubmenu?.(), 350);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (closing) return;
		// Stop propagation so the document-level main handler doesn't re-process this key
		e.stopPropagation();
		if (e.key === "ArrowRight" && activeTab < tabs.length - 1) {
			activeTab++;
			e.preventDefault();
		} else if (e.key === "ArrowLeft" && activeTab > 0) {
			activeTab--;
			e.preventDefault();
		} else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
			e.preventDefault();
			if (phase !== "content") {
				skipToContent();
			} else {
				handleClose();
			}
		}
	}

	function handleTabClick(index: number) {
		if (index === activeTab) return;
		activeTab = index;
	}

	onMount(() => {
		// Optimistically warm image cache (doesn't block UI)
		["/T_UI_Camp_Status_Character_Glass_0001.png",
		 "/T_Btl_AlloutFinish_Pc01_A1out.png",
		 "/T_Btl_AlloutFinishText_Pc01out.png",
		 "/T_UI_Camp_Status_Character_0001.png"
		].forEach(src => { const img = new Image(); img.src = src; });

		// Phase sequence starts immediately — no loading flash
		setTimeout(() => {
			if (phase === "content") return;
			phase = "aoa";
		}, 1500);

		setTimeout(() => {
			if (phase === "content") return;
			phase = "content";
		}, 3500);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="about-root fixed inset-0 z-50"
	class:about-closing={closing}
	role="dialog"
	aria-label="About"
	onkeydown={handleKeydown}
	tabindex="-1"
>
	<!-- Phase 1: Eye cut-in — Abyssal Emergence -->
	{#if phase === "eye"}
		<div class="absolute inset-0 z-10 aoa-bg-dim">
			<div class="absolute inset-0 aoa-bg-dim-overlay"></div>
			<div class="aoa-god-rays" aria-hidden="true"></div>
		</div>
		<div class="absolute inset-0 z-20 flex items-center justify-center">
			{#each [0, 1, 2, 3, 4, 5] as i}
				<div class="aoa-ripple-ring" style="--ring-delay: {i * 0.12}s"></div>
			{/each}
			{#each Array(10) as _, i}
				<div class="aoa-bubble" style="--b-x: {10 + (i * 9) % 80}%; --b-d: {0.3 + (i % 7) * 0.15}s; --b-s: {6 + (i % 4) * 4}px; --b-drift: {(-20 + (i * 7) % 40)}px"></div>
			{/each}
			<div class="aoa-eye-wrap">
				<div class="aoa-eye-frame">
					<div class="aoa-water-shimmer" aria-hidden="true"></div>
					<img
						src="/T_UI_Camp_Status_Character_Glass_0001.png"
						alt="eye cut-in"
						class="aoa-eye-img"
					/>
					<div class="aoa-eye-glitch" aria-hidden="true"></div>
					<div class="aoa-eye-border"></div>
					<div class="aoa-eye-corner aoa-corner-tl"></div>
					<div class="aoa-eye-corner aoa-corner-tr"></div>
					<div class="aoa-eye-corner aoa-corner-bl"></div>
					<div class="aoa-eye-corner aoa-corner-br"></div>
					<span class="aoa-exclamation aoa-ex-left">!!</span>
					<span class="aoa-exclamation aoa-ex-right">!!</span>
				</div>
			</div>
		</div>

	<!-- Phase 2 & 3: AOA art (shared element, no remount) -->
	{:else}
		<div class="absolute inset-0 aoa-art-layer" style="background: {AOA_BG};">
			<img
				src="/T_Btl_AlloutFinish_Pc01_A1out.png"
				alt=""
				class="absolute inset-0 w-full h-full aoa-art-img"
				class:aoa-art-content={phase === "content"}
			/>
			<div class="absolute inset-0 aoa-art-vignette" class:aoa-vig-strong={phase === "content"}></div>
		</div>

		{#if phase === "aoa"}
			<img
				src="/T_Btl_AlloutFinishText_Pc01out.png"
				alt=""
				class="aoa-nameplate"
			/>
		{/if}

{#if phase === "content"}

	<div class="relative z-10 h-full flex flex-col about-content-panel">
		<ParticleCanvas type="water" class="pointer-events-none" />
		<!-- Header -->
		<header class="about-header">
				<h1 class="about-title">ABOUT</h1>
				<div class="flex gap-2" role="tablist">
					{#each tabs as tab, i}
						<button
							class={cn("about-tab-btn", i === activeTab ? "about-tab-active" : "about-tab-inactive")}
							role="tab"
							aria-selected={i === activeTab}
							onclick={() => handleTabClick(i)}
						>{tab.name}</button>
					{/each}
				</div>
			</header>

			<!-- Body -->
			<div class="flex-1 flex flex-col md:flex-row gap-6 about-body">
				<!-- Portrait side -->
				<div class="about-portrait-side">
					<div class="about-portrait-inner">
						<img
							src="/T_UI_Camp_Status_Character_0001.png"
							alt=""
							class="about-camp-img"
						/>
						<div class="about-camp-glass"></div>
					</div>
				</div>

				<!-- Info side -->
				<div class="about-info-side">
					<img src="/T_Btl_AlloutFinishText_Pc01out.png" alt="" class="about-info-nameplate" />

					<div>
						<h2 class="about-info-title">{profileData.title}</h2>
						<p class="about-info-tagline">"{profileData.tagline}"</p>
					</div>

					<div class="about-stats-grid">
						{#each profileData.stats as stat, i}
							<div class="about-stat-item stagger-in" style="animation-delay: {0.3 + i * 0.12}s">
								<span class="about-stat-val">{stat.value}</span>
								<span class="about-stat-lbl">{stat.label}</span>
							</div>
						{/each}
					</div>

					<div class="about-social-row">
						{#each profileData.socialLinks as link, i}
							<a href={link.url} target="_blank" rel="noopener noreferrer" class="about-social-link stagger-in" style="color: {link.color}; animation-delay: {0.3 + i * 0.12}s" aria-label={link.platform}>
								<iconify-icon icon={link.icon} class="about-social-icon"></iconify-icon>
							</a>
						{/each}
					</div>

					<div class="about-content-divider stagger-in" style="animation-delay: 0.6s"></div>

					{#key activeTab}
						<div class="about-sub-content">
							{#if activeTab === 0}
								<p class="about-bio-p">{profileData.bio}</p>
							{:else if activeTab === 1}
								<div class="grid grid-cols-2 gap-3">
									{#each profileData.stats as stat}
										<div class="about-stat-detail">
											<span class="about-stat-dv">{stat.value}</span>
											<span class="about-stat-dl">{stat.label}</span>
										</div>
									{/each}
								</div>
							{:else}
								<div class="about-bio-wrap">
									<p class="about-bio-p">{profileData.bio}</p>
									<div class="about-bio-sep">━━━</div>
									<div class="about-focus-box">
										<h3 class="about-focus-h">Current Focus</h3>
										<ul class="about-focus-list">
											<li class="about-focus-li"><iconify-icon icon="mdi:rocket-launch" class="about-fi-icon text-pink"></iconify-icon> Building portfolio sites with game-inspired UX</li>
											<li class="about-focus-li"><iconify-icon icon="mdi:code-braces" class="about-fi-icon text-button-1"></iconify-icon> Learning Rust for systems programming</li>
											<li class="about-focus-li"><iconify-icon icon="mdi:gamepad-variant" class="about-fi-icon text-button-2"></iconify-icon> Experimenting with Godot 4 for game jams</li>
										</ul>
									</div>
								</div>
							{/if}
						</div>
					{/key}
				</div>
			</div>

			<footer class="about-footer">
				<Control key="← →">Tabs</Control>
				<Control key="B">Back</Control>
			</footer>
		</div>
	{/if}
	{/if}
</div>

<style>
	/* === Root === */
	.about-root {
		background: transparent;
		outline: none;
		isolation: isolate;
	}
	.about-closing {
		opacity: 0;
		transition: opacity 0.3s ease-out;
	}
	.about-closing .about-info-side,
	.about-closing .about-tab-active {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	/* ===== PHASE: EYE — Abyssal Emergence ===== */
	/* Deep ocean void with pulsing life */
	.aoa-bg-dim-overlay {
		animation: abyss-dim 0.7s ease-out forwards;
	}
	@keyframes abyss-dim {
		0% { background: rgba(0,10,40,0); }
		40% { background: rgba(0,20,70,0.5); }
		100% { background: rgba(0,10,40,0.85); }
	}

	/* God rays — light shafts from the surface */
	.aoa-god-rays {
		position: absolute; inset: 0; z-index: 1; pointer-events: none;
		overflow: hidden;
		background:
			linear-gradient(105deg, transparent 25%, rgba(21,194,252,0.04) 30%, transparent 35%),
			linear-gradient(115deg, transparent 50%, rgba(21,194,252,0.03) 55%, transparent 60%),
			linear-gradient(95deg, transparent 10%, rgba(21,194,252,0.05) 15%, transparent 20%);
		animation: rays-sweep 2.5s ease-in-out infinite;
	}
	@keyframes rays-sweep {
		0% { transform: translateX(-20%) scaleY(0.8); opacity: 0.3; }
		50% { transform: translateX(10%) scaleY(1.1); opacity: 0.7; }
		100% { transform: translateX(-20%) scaleY(0.8); opacity: 0.3; }
	}

	/* Ripple rings — 6 concentric waves */
	.aoa-ripple-ring {
		position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
		left: 50%; top: 50%; transform: translate(-50%, -50%);
		width: 10%; aspect-ratio: 1;
		border: 1.5px solid rgba(21,194,252,0.5);
		box-shadow: 0 0 15px rgba(21,194,252,0.15), inset 0 0 15px rgba(21,194,252,0.05);
		animation: abyss-ring 1s ease-out calc(var(--ring-delay)) forwards;
	}
	@keyframes abyss-ring {
		0% { width: 10%; opacity: 0.9; border-width: 2px; filter: blur(0); }
		70% { opacity: 0.4; border-width: 1px; filter: blur(1px); }
		100% { width: 300%; opacity: 0; border-width: 0.5px; filter: blur(3px); }
	}

	/* Floating bubbles */
	.aoa-bubble {
		position: absolute; z-index: 1; pointer-events: none;
		border-radius: 50%;
		width: var(--b-s); height: var(--b-s);
		bottom: -20px;
		left: var(--b-x);
		background: radial-gradient(circle at 30% 30%, rgba(21,194,252,0.3), rgba(21,194,252,0.05));
		border: 1px solid rgba(21,194,252,0.2);
		box-shadow: inset -1px -1px 3px rgba(0,0,0,0.2), 0 0 8px rgba(21,194,252,0.1);
		animation: bubble-rise 2.5s ease-in var(--b-d) infinite;
	}
	@keyframes bubble-rise {
		0% { transform: translateY(0) translateX(0) scale(0.3); opacity: 0; }
		8% { opacity: 0.6; transform: translateY(-20px) translateX(calc(var(--b-drift) * -0.2)) scale(1); }
		80% { opacity: 0.4; }
		100% { transform: translateY(-110vh) translateX(var(--b-drift)) scale(0.6); opacity: 0; }
	}

	/* Water shimmer overlay */
	.aoa-water-shimmer {
		position: absolute; inset: 0; z-index: 4; pointer-events: none;
		overflow: hidden;
		background: linear-gradient(-45deg,
			transparent 30%,
			rgba(21,194,252,0.06) 40%,
			rgba(255,255,255,0.05) 45%,
			rgba(21,194,252,0.04) 50%,
			transparent 60%
		);
		background-size: 200% 200%;
		animation: shimmer-flow 2s ease-in-out infinite;
		mix-blend-mode: overlay;
	}
	@keyframes shimmer-flow {
		0% { background-position: 200% 0%; opacity: 0.3; }
		50% { background-position: -50% 100%; opacity: 0.8; }
		100% { background-position: 200% 0%; opacity: 0.3; }
	}

	/* Scanline sweep */
	.aoa-scanline {
		position: absolute; left: -10%; width: 120%; height: 3px;
		background: linear-gradient(90deg, transparent, rgba(21,194,252,0.8), rgba(255,255,255,0.9), rgba(21,194,252,0.8), transparent);
		z-index: 10; pointer-events: none;
		animation: scan-sweep 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
		box-shadow: 0 0 20px rgba(21,194,252,0.6), 0 0 60px rgba(21,194,252,0.3);
	}
	@keyframes scan-sweep {
		0% { top: -5%; opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { top: 105%; opacity: 0; }
	}

	/* Digital glitch overlay */
	.aoa-eye-glitch {
		position: absolute; inset: 0; z-index: 6; pointer-events: none;
		overflow: hidden; opacity: 0;
		animation: abyss-glitch 0.6s ease-out 0.1s forwards;
	}
	@keyframes abyss-glitch {
		0% { opacity: 0; }
		4% { opacity: 0.35; background: linear-gradient(0deg, transparent 0%, rgba(21,194,252,0.2) 15%, transparent 30%, rgba(21,194,252,0.15) 50%, transparent 70%, rgba(21,194,252,0.1) 85%, transparent); transform: translateX(-6px) skewX(-1deg); }
		8% { opacity: 0; transform: translateX(5px) skewX(1deg); }
		12% { opacity: 0.25; background: linear-gradient(0deg, transparent 8%, rgba(255,255,255,0.12) 25%, transparent 40%, rgba(21,194,252,0.1) 60%, transparent 80%, rgba(255,255,255,0.08) 92%, transparent); transform: translateX(-3px); }
		16% { opacity: 0; transform: translateX(0); }
		25% { opacity: 0.12; background: linear-gradient(0deg, transparent 5%, rgba(21,194,252,0.15) 20%, transparent 38%, rgba(255,255,255,0.08) 55%, transparent 72%, rgba(21,194,252,0.1) 88%, transparent); transform: translateX(4px) skewX(-0.5deg); }
		35% { opacity: 0; transform: translateX(0); }
		100% { opacity: 0; }
	}

	/* Eye wrap — emerges from watery depths with breath */
	.aoa-eye-wrap {
		animation: abyss-rise 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both,
				   water-breathe 2.5s ease-in-out 0.7s infinite;
		position: relative; z-index: 2;
		filter: drop-shadow(0 0 30px rgba(21,194,252,0.2));
	}
	@keyframes abyss-rise {
		0% { opacity: 0; transform: scale(0.2) translateY(60px); filter: blur(8px) brightness(0.3); }
		30% { opacity: 0.6; transform: scale(1.08) translateY(-8px); filter: blur(2px) brightness(1.2); }
		60% { opacity: 1; transform: scale(0.97) translateY(4px); filter: blur(1px) brightness(0.9); }
		100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1); }
	}
	@keyframes water-breathe {
		0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(21,194,252,0)) brightness(1); }
		50% { transform: scale(1.015); filter: drop-shadow(0 0 40px rgba(21,194,252,0.25)) brightness(1.05); }
	}

	.aoa-eye-frame {
		position: relative;
		width: min(85vw, 800px);
		aspect-ratio: 2 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.aoa-eye-img {
		width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2;
		animation: abyss-zoom 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		filter: drop-shadow(0 0 60px rgba(21,194,252,0.35)) drop-shadow(0 0 120px rgba(21,194,252,0.15));
	}
	@keyframes abyss-zoom {
		0% { opacity: 0; transform: scale(0.5) rotate(-2deg); filter: brightness(2.5) hue-rotate(30deg); }
		50% { opacity: 0.7; transform: scale(1.05) rotate(0.5deg); filter: brightness(1.4) hue-rotate(-10deg); }
		100% { opacity: 1; transform: scale(1) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }
	}

	/* Frame border — cyan energy pulse */
	.aoa-eye-border {
		position: absolute; inset: -10px; z-index: 3; pointer-events: none;
		border: 2px solid rgba(21,194,252,0.4);
		clip-path: polygon(0% 5%, 3% 0%, 97% 2%, 100% 4%, 100% 96%, 96% 100%, 4% 98%, 0% 95%);
		animation: abyss-border 0.8s ease-out forwards;
	}
	@keyframes abyss-border {
		0% { border-color: rgba(255,255,255,0); opacity: 0; border-width: 3px; transform: scale(0.9); }
		20% { border-color: rgba(21,194,252,1); opacity: 1; border-width: 3px; transform: scale(1.02); box-shadow: 0 0 40px rgba(21,194,252,0.4), inset 0 0 40px rgba(21,194,252,0.1); }
		50% { border-color: rgba(255,255,255,0.7); border-width: 2px; }
		100% { border-color: rgba(21,194,252,0.4); opacity: 0.9; border-width: 1.5px; transform: scale(1); box-shadow: 0 0 15px rgba(21,194,252,0.1); }
	}

	/* Corner brackets — pulsing cyan */
	.aoa-eye-corner {
		position: absolute; width: 30px; height: 30px; z-index: 4; pointer-events: none;
		border-color: #15c2fc; opacity: 0.9;
		animation: corner-pulse 1.5s ease-in-out infinite;
	}
	.aoa-corner-tl { top: -15px; left: -15px; border-top: 3px solid; border-left: 3px solid; }
	.aoa-corner-tr { top: -15px; right: -15px; border-top: 3px solid; border-right: 3px solid; }
	.aoa-corner-bl { bottom: -15px; left: -15px; border-bottom: 3px solid; border-left: 3px solid; }
	.aoa-corner-br { bottom: -15px; right: -15px; border-bottom: 3px solid; border-right: 3px solid; }
	@keyframes corner-pulse {
		0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 4px rgba(21,194,252,0.3)); }
		50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(21,194,252,0.6)); }
	}

	/* "!!" — watery energy marks */
	.aoa-exclamation {
		position: absolute; font-family: var(--font-skip); font-size: 2.8rem;
		color: #fff; z-index: 5; pointer-events: none; line-height: 1;
		text-shadow: 0 0 30px rgba(21,194,252,0.9), 0 0 60px rgba(21,194,252,0.5), 0 0 100px rgba(21,194,252,0.2);
		animation: water-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both,
				   water-glow 2s ease-in-out 0.5s infinite;
	}
	.aoa-ex-left { top: -18px; left: 10%; }
	.aoa-ex-right { bottom: -18px; right: 10%; }
	@keyframes water-pop {
		0% { opacity: 0; transform: scale(0.2) rotate(-15deg) translateY(10px); filter: blur(4px); }
		60% { opacity: 1; transform: scale(1.2) rotate(3deg) translateY(-3px); filter: blur(0); }
		100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); filter: blur(0); }
	}
	@keyframes water-glow {
		0%, 100% { text-shadow: 0 0 30px rgba(21,194,252,0.9), 0 0 60px rgba(21,194,252,0.5); }
		50% { text-shadow: 0 0 50px rgba(21,194,252,1), 0 0 100px rgba(21,194,252,0.7), 0 0 150px rgba(21,194,252,0.3); }
	}

	/* ===== PHASE: AOA ===== */
	.aoa-art-layer {
		animation: aoa-bg-in 0.3s ease-out both;
		&::before {
			content: ''; position: absolute; inset: 0; z-index: 10;
			background: white; pointer-events: none;
			animation: flash-pop 0.15s ease-out 0.05s forwards;
		}
	}
	@keyframes aoa-bg-in { from { opacity: 0; } to { opacity: 1; } }
	@keyframes flash-pop {
		0% { opacity: 0.9; }
		100% { opacity: 0; }
	}

	.aoa-art-img {
		object-fit: cover;
		object-position: center 30%;
		animation: aoa-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transition: opacity 0.35s ease-out, filter 0.35s ease-out;
	}
	@keyframes aoa-slam {
		from { opacity: 0; transform: scale(1.3); filter: brightness(1.8); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.aoa-art-content {
		opacity: 0.4;
		filter: blur(2px) brightness(0.55);
	}

	.aoa-nameplate {
		position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
		width: min(55vw, 450px); height: auto; z-index: 5;
		animation: nameplate-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
	}
	@keyframes nameplate-in {
		from { opacity: 0; transform: translateX(-50%) translateY(50px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.aoa-art-vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%);
		z-index: 2;
		transition: all 0.35s ease-out;
	}
	.aoa-vig-strong {
		background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.4) 100%);
	}

	.about-content-panel {
		padding: 1rem;
		max-width: 1320px;
		margin: 0 auto;
		width: 100%;
		animation: panel-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
	}
	@keyframes panel-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* === Header === */
	.about-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.5rem 0; flex-shrink: 0;
	}
	.about-title {
		font-family: var(--font-skip); font-size: 1.75rem; color: #fff;
		text-shadow: 0 2px 12px rgba(0,0,0,0.5), var(--text-shadow-border);
	}
	.about-tab-btn {
		padding: 0.35rem 1rem; border-radius: 0.375rem;
		font-family: var(--font-new-rodin); font-size: 0.9rem;
		transition: all 0.2s; cursor: pointer; border: none; outline: none;
	}
	.about-tab-active {
		background: rgba(255,255,255,0.2); color: #fff; font-weight: 700;
		backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		box-shadow: 0 0 20px rgba(21,194,252,0.2);
	}
	.about-tab-inactive { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); }
	.about-tab-inactive:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); }

	/* === Body === */
	.about-body { flex: 1; min-height: 0; padding: 0.5rem 0; gap: 1.5rem; }

	/* Portrait */
	.about-portrait-side { display: none; }
	@media (min-width: 768px) {
		.about-portrait-side { display: flex; flex-shrink: 0; width: 260px; align-items: flex-end; }
	}
	@media (min-width: 1024px) { .about-portrait-side { width: 320px; } }

	.about-portrait-inner {
		position: relative; width: 100%; height: 100%; min-height: 300px;
		display: flex; align-items: flex-end;
	}
	.about-camp-img {
		width: 100%; height: auto; max-height: 55vh;
		object-fit: contain; object-position: bottom center;
		position: relative; z-index: 2;
		filter: drop-shadow(0 0 30px rgba(21,194,252,0.12)) brightness(0.9);
		animation: port-float 4s ease-in-out infinite;
	}
	@keyframes port-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
	.about-camp-glass {
		position: absolute; inset: 0;
		background: linear-gradient(to right, transparent 55%, rgba(0,0,0,0.12) 100%);
		z-index: 3; pointer-events: none;
	}

	/* Info side */
	.about-info-side {
		flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.5rem;
		padding: 0.75rem 1rem; border-radius: 0.75rem;
		background: rgba(0,0,0,0.65); backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255,255,255,0.08);
		box-shadow: 0 8px 32px rgba(0,0,0,0.2);
	}
	.about-info-nameplate {
		height: 36px; width: auto; object-fit: contain;
		filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
	}
	@media (min-width: 768px) { .about-info-nameplate { height: 46px; } }

	.about-info-title {
		font-family: var(--font-new-rodin); font-size: 1.2rem;
		color: #15c2fc; font-weight: 600;
		text-shadow: 0 0 20px rgba(21,194,252,0.25);
	}
	.about-info-tagline {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.45);
		font-style: italic; font-size: 0.85rem; margin-top: 0.1rem;
	}

	/* Stats */
	.about-stats-grid {
		display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem;
	}
	@media (max-width: 767px) { .about-stats-grid { grid-template-columns: repeat(2, 1fr); } }
	.about-stat-item {
		padding: 0.4rem 0.2rem; border-radius: 0.375rem;
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05);
		display: flex; flex-direction: column; align-items: center; gap: 0.05rem;
		transition: border-color 0.2s;
	}
	.about-stat-item:hover { border-color: rgba(21,194,252,0.25); }
	.about-stat-val {
		font-family: var(--font-skip); font-size: 1.3rem; color: #15c2fc; line-height: 1;
		text-shadow: 0 0 12px rgba(21,194,252,0.25);
	}
	.about-stat-lbl {
		font-family: var(--font-new-rodin); font-size: 0.6rem; color: rgba(255,255,255,0.4);
		text-align: center;
	}

	/* Social */
	.about-social-row { display: flex; gap: 0.4rem; }
	.about-social-link {
		width: 2rem; height: 2rem; border-radius: 9999px;
		background: rgba(255,255,255,0.06); display: flex;
		align-items: center; justify-content: center; transition: all 0.2s;
	}
	.about-social-link:hover { background: rgba(255,255,255,0.12); transform: scale(1.1); }
	.about-social-icon { font-size: 1rem; }

	/* Divider */
	.about-content-divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(21,194,252,0.15), transparent);
		margin: 0.1rem 0 0.35rem;
	}

	/* Sub-content */
	.about-sub-content {
		flex: 1; overflow-y: auto; max-height: 28vh; padding-right: 0.25rem;
	}
	.about-sub-content::-webkit-scrollbar { width: 3px; }
	.about-sub-content::-webkit-scrollbar-track { background: transparent; }
	.about-sub-content::-webkit-scrollbar-thumb { background: rgba(21,194,252,0.3); border-radius: 2px; }

	.about-bio-p {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.7);
		line-height: 1.6; font-size: 0.9rem;
	}

	.about-stat-detail {
		padding: 0.6rem; border-radius: 0.5rem;
		background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);
		display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
		transition: border-color 0.2s;
	}
	.about-stat-detail:hover { border-color: rgba(21,194,252,0.3); }
	.about-stat-dv {
		font-family: var(--font-skip); font-size: 1.75rem; color: #15c2fc;
		text-shadow: 0 0 15px rgba(21,194,252,0.25);
	}
	.about-stat-dl {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.5); font-size: 0.8rem;
	}

	.about-bio-wrap p { font-family: var(--font-new-rodin); color: rgba(255,255,255,0.7); line-height: 1.6; font-size: 0.9rem; white-space: pre-wrap; }
	.about-bio-sep { text-align: center; color: rgba(255,255,255,0.05); margin: 0.75rem 0; font-size: 0.7rem; }

	.about-focus-box {
		padding: 0.75rem; border-radius: 0.5rem;
		background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
	}
	.about-focus-h {
		font-family: var(--font-skip); font-size: 1.1rem; color: #15c2fc;
		margin-bottom: 0.5rem; text-shadow: 0 0 12px rgba(21,194,252,0.15);
	}
	.about-focus-list { display: flex; flex-direction: column; gap: 0.4rem; list-style: none; padding: 0; margin: 0; }
	.about-focus-li {
		display: flex; align-items: center; gap: 0.5rem;
		color: rgba(255,255,255,0.55); font-family: var(--font-new-rodin); font-size: 0.8rem;
	}
	.about-fi-icon { font-size: 1rem; flex-shrink: 0; }

	/* Footer */
	.about-footer {
		display: flex; align-items: center; justify-content: center;
		gap: 1.5rem; padding: 0.5rem 0; flex-shrink: 0;
	}

	/* Card-shuffle stagger animation */
	@keyframes stagger-in {
		from { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.92); }
		50% { transform: translateY(-4px) rotate(1deg) scale(1.02); }
		to { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
	}
</style>
