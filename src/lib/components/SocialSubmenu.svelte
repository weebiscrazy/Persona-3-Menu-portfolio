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
		{ name: "Links", index: 0, arcanaNumber: "VI" },
		{ name: "Connect", index: 1, arcanaNumber: "XVII" }
	];

	const AOA_BG = "#e0588c";

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

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
		["/T_UI_Camp_Status_Character_Glass_0002.png",
		 "/T_Btl_AlloutFinish_Pc02_A1out.png",
		 "/T_Btl_AlloutFinishText_Pc02out.png",
		 "/T_UI_Camp_Status_Character_0002.png"
		].forEach(src => { const img = new Image(); img.src = src; });

		setTimeout(() => {
			if (phase === "content") return;
			phase = "aoa";
		}, 900);

		setTimeout(() => {
			if (phase === "content") return;
			phase = "content";
		}, 2500);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="social-root fixed inset-0 z-50"
	class:social-closing={closing}
	role="dialog"
	aria-label="Social"
	onkeydown={handleKeydown}
	tabindex="-1"
>
	<!-- Phase 1: Eye cut-in — Cherry Blossom Storm -->
	{#if phase === "eye"}
		<div class="absolute inset-0 z-10 social-bg-dim">
			<div class="absolute inset-0 social-bg-dim-overlay"></div>
			<div class="social-petal-glow" aria-hidden="true"></div>
		</div>
		<div class="absolute inset-0 z-20 flex items-center justify-center">
			<div class="social-petal-vortex" aria-hidden="true">
				{#each Array(30) as _, i}
					<div class="social-spiral-petal" style="--angle: {i * 12}deg; --p-delay: {i * 0.025}s; --p-scale: {0.6 + (i % 5) * 0.15}; --p-dist: {120 + (i % 8) * 25}px"></div>
				{/each}
			</div>
			{#each Array(12) as _, i}
				<div class="social-floating-petal" style="--f-x: {5 + (i * 8) % 90}%; --f-d: {0.5 + (i % 6) * 0.2}s; --f-r: {i * 37}deg; --f-s: {12 + (i % 4) * 6}px"></div>
			{/each}
			<div class="social-eye-wrap">
				<div class="social-eye-frame">
					<div class="social-petal-shimmer" aria-hidden="true"></div>
					<img
						src="/T_UI_Camp_Status_Character_Glass_0002.png"
						alt="eye cut-in"
						class="social-eye-img"
					/>
					<div class="social-eye-glitch" aria-hidden="true"></div>
					<div class="social-eye-border"></div>
					<div class="social-eye-corner social-corner-tl"></div>
					<div class="social-eye-corner social-corner-tr"></div>
					<div class="social-eye-corner social-corner-bl"></div>
					<div class="social-eye-corner social-corner-br"></div>
					<span class="social-exclamation social-ex-left">!!</span>
					<span class="social-exclamation social-ex-right">!!</span>
				</div>
			</div>
		</div>

	<!-- Phase 2 & 3: AOA art (shared element) -->
	{:else}
		<div class="absolute inset-0 social-art-layer" style="background: {AOA_BG};">
			<img
				src="/T_Btl_AlloutFinish_Pc02_A1out.png"
				alt=""
				class="absolute inset-0 w-full h-full social-art-img"
				class:social-art-content={phase === "content"}
			/>
			<div class="absolute inset-0 social-art-vignette" class:social-vig-strong={phase === "content"}></div>
		</div>

		{#if phase === "aoa"}
			<img
				src="/T_Btl_AlloutFinishText_Pc02out.png"
				alt=""
				class="social-nameplate"
			/>
		{/if}

		{#if phase === "content"}
		<div class="relative z-10 h-full flex flex-col social-content-panel">
			<ParticleCanvas type="petals" class="pointer-events-none" />
			<!-- Header -->
			<header class="social-header">
				<div class="social-title-row">
					<img src="/arcana/lovers.png" alt="Lovers" class="social-arcana-icon" />
					<h1 class="social-title">SOCIAL</h1>
				</div>
				<div class="flex gap-2" role="tablist">
					{#each tabs as tab, i}
						<button
							class={cn("social-tab-btn", i === activeTab ? "social-tab-active" : "social-tab-inactive")}
							role="tab"
							aria-selected={i === activeTab}
							onclick={() => handleTabClick(i)}
						>{tab.name}</button>
					{/each}
				</div>
			</header>

			<!-- Body -->
			<div class="flex-1 flex flex-col min-h-0">
				<div class="social-arcana-watermark" aria-hidden="true">
					<img src="/arcana/lovers.png" alt="" />
				</div>

				{#key activeTab}
					<div class="social-content-scroll">
						{#if activeTab === 0}
							<div class="max-w-2xl mx-auto w-full space-y-4">
								{#each profileData.socialLinks as link, i}
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class={cn(
											"social-link-card group",
										)}
										style="animation-delay: {0.3 + i * 0.12}s"
									>
										<div class="social-link-icon-wrap" style="background: {link.color}">
											<iconify-icon icon={link.icon} class="text-2xl text-bg"></iconify-icon>
											<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
										</div>
										<div class="flex-1 min-w-0">
											<p class="social-link-name">{link.platform}</p>
											<p class="social-link-url">{link.url}</p>
										</div>
										<iconify-icon icon="mdi:open-in-new" class="social-link-ext"></iconify-icon>
									</a>
								{/each}
							</div>
						{:else}
							<div class="max-w-xl mx-auto w-full space-y-8">
								<div class="text-center social-stagger" style="animation-delay: 0.08s">
									<h3 class="social-section-title">Get In Touch</h3>
									<p class="social-section-desc">Always open to interesting projects, collaborations, or just chatting about Persona.</p>
								</div>

								<div class="social-divider">✦ ✦ ✦</div>

								<div class="social-email-card">
									<div class="flex items-center gap-4 mb-4">
										<div class="social-email-icon">
											<iconify-icon icon="mdi:email" class="text-2xl text-bg"></iconify-icon>
										</div>
										<div>
											<p class="social-email-title">Direct Email</p>
											<p class="social-email-sub">Best for project inquiries</p>
										</div>
									</div>
									<button
										onclick={() => copyToClipboard(profileData.socialLinks[3].url.replace('mailto:', ''))}
										class="social-copy-btn"
									>
										<span>{profileData.socialLinks[3].url.replace('mailto:', '')}</span>
										<iconify-icon icon="mdi:content-copy" class="text-xl"></iconify-icon>
									</button>
								</div>

								<div class="social-avail-card">
									<h4 class="social-avail-title">Availability</h4>
									<div class="grid grid-cols-2 gap-4 text-center">
										<div class="social-avail-item">
											<p class="social-avail-val" style="color: #4ade80">Open</p>
											<p class="social-avail-lbl">Freelance Projects</p>
										</div>
										<div class="social-avail-item">
											<p class="social-avail-val" style="color: #4ade80">Open</p>
											<p class="social-avail-lbl">Collaborations</p>
										</div>
										<div class="social-avail-item">
											<p class="social-avail-val" style="color: #fb923c">Closed</p>
											<p class="social-avail-lbl">Full-time Roles</p>
										</div>
										<div class="social-avail-item">
											<p class="social-avail-val" style="color: #f472b6">Always</p>
											<p class="social-avail-lbl">Persona Talk</p>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<footer class="social-footer">
				<Control key="← →">Tabs</Control>
				<Control key="B">Back</Control>
			</footer>
		</div>
		{/if}
	{/if}
</div>

<style>
	/* === Root === */
	.social-root { background: transparent; outline: none; isolation: isolate; }
	.social-closing { opacity: 0; transition: opacity 0.3s ease-out; }
	.social-closing .social-link-card,
	.social-closing .social-email-card,
	.social-closing .social-avail-card,
	.social-closing .social-section-title,
	.social-closing .social-tab-active {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	/* ===== PHASE: EYE — Cherry Blossom Storm ===== */
	/* Soft sakura twilight */
	.social-bg-dim-overlay {
		animation: sakura-dim 0.7s ease-out forwards;
	}
	@keyframes sakura-dim {
		0% { background: rgba(80,10,40,0); }
		40% { background: rgba(120,20,60,0.4); }
		100% { background: rgba(80,10,40,0.75); }
	}

	/* Soft pink ambient glow */
	.social-petal-glow {
		position: absolute; inset: 0; z-index: 1; pointer-events: none;
		background: radial-gradient(ellipse at 50% 40%, rgba(232,88,140,0.08) 0%, transparent 60%);
		animation: glow-pulse 2s ease-in-out infinite;
	}
	@keyframes glow-pulse {
		0%, 100% { opacity: 0.4; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.1); }
	}

	/* Petal vortex — 30 petals spiral outward */
	.social-petal-vortex {
		position: absolute; width: min(90vw, 900px); aspect-ratio: 1;
		left: 50%; top: 50%; transform: translate(-50%, -50%);
		pointer-events: none; z-index: 1;
	}
	.social-spiral-petal {
		position: absolute; width: 36px; height: 18px;
		left: 50%; top: 50%; margin-left: -18px; margin-top: -9px;
		background: radial-gradient(ellipse, rgba(232,88,140,0.6) 0%, rgba(253,119,217,0.3) 40%, transparent 70%);
		border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
		transform: rotate(var(--angle)) translateY(-120px);
		opacity: 0;
		filter: blur(0.5px);
		animation: petal-burst 0.9s ease-out calc(var(--p-delay)) forwards;
	}
	@keyframes petal-burst {
		0% { opacity: 0; transform: rotate(var(--angle)) translateY(0) scale(0.2); filter: blur(3px); }
		30% { opacity: 0.9; transform: rotate(calc(var(--angle) + 60deg)) translateY(calc(var(--p-dist) * -0.6)) scale(var(--p-scale)); filter: blur(0); }
		100% { opacity: 0; transform: rotate(calc(var(--angle) + 240deg)) translateY(calc(var(--p-dist) * -1)) scale(calc(var(--p-scale) * 0.4)); filter: blur(2px); }
	}

	/* Floating persistent petals */
	.social-floating-petal {
		position: absolute; z-index: 1; pointer-events: none;
		width: var(--f-s); height: calc(var(--f-s) * 0.5);
		left: var(--f-x); bottom: -20px;
		background: radial-gradient(ellipse, rgba(253,119,217,0.4) 0%, rgba(232,88,140,0.15) 60%, transparent 80%);
		border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
		transform: rotate(var(--f-r));
		animation: petal-drift 3.5s ease-in var(--f-d) infinite;
	}
	@keyframes petal-drift {
		0% { transform: translateY(0) rotate(var(--f-r)) scale(0.3); opacity: 0; }
		10% { opacity: 0.5; transform: translateY(-30px) rotate(calc(var(--f-r) + 20deg)) scale(1); }
		80% { opacity: 0.3; }
		100% { transform: translateY(-105vh) rotate(calc(var(--f-r) + 120deg)) scale(0.6); opacity: 0; }
	}

	/* Petal shimmer overlay */
	.social-petal-shimmer {
		position: absolute; inset: 0; z-index: 4; pointer-events: none;
		background: linear-gradient(135deg,
			transparent 25%,
			rgba(253,119,217,0.05) 35%,
			rgba(255,255,255,0.04) 40%,
			rgba(232,88,140,0.03) 45%,
			transparent 55%
		);
		background-size: 300% 300%;
		animation: petal-shimmer 3s ease-in-out infinite;
		mix-blend-mode: overlay;
	}
	@keyframes petal-shimmer {
		0% { background-position: 0% 50%; opacity: 0.2; }
		50% { background-position: 100% 50%; opacity: 0.6; }
		100% { background-position: 0% 50%; opacity: 0.2; }
	}

	/* Scanline sweep */
	.social-scanline {
		position: absolute; left: -10%; width: 120%; height: 3px;
		background: linear-gradient(90deg, transparent, rgba(232,88,140,0.8), rgba(255,255,255,0.9), rgba(232,88,140,0.8), transparent);
		z-index: 10; pointer-events: none;
		animation: scan-sweep 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
		box-shadow: 0 0 20px rgba(232,88,140,0.6), 0 0 60px rgba(232,88,140,0.3);
	}
	@keyframes scan-sweep {
		0% { top: -5%; opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { top: 105%; opacity: 0; }
	}

	/* Glitch — soft petal-like displacement */
	.social-eye-glitch {
		position: absolute; inset: 0; z-index: 6; pointer-events: none;
		overflow: hidden; opacity: 0;
		animation: petal-glitch 0.6s ease-out 0.1s forwards;
	}
	@keyframes petal-glitch {
		0% { opacity: 0; }
		4% { opacity: 0.3; background: linear-gradient(0deg, transparent 0%, rgba(253,119,217,0.18) 15%, transparent 30%, rgba(232,88,140,0.12) 50%, transparent 70%, rgba(253,119,217,0.1) 85%, transparent); transform: translateX(-5px) skewX(0.5deg); }
		9% { opacity: 0; transform: translateX(4px) skewX(-0.5deg); }
		14% { opacity: 0.2; background: linear-gradient(0deg, transparent 8%, rgba(255,255,255,0.1) 22%, transparent 38%, rgba(232,88,140,0.08) 55%, transparent 75%, rgba(253,119,217,0.07) 90%, transparent); transform: translateX(-2px); }
		19% { opacity: 0; transform: translateX(0); }
		28% { opacity: 0.1; background: linear-gradient(0deg, transparent 5%, rgba(253,119,217,0.12) 18%, transparent 35%, rgba(255,255,255,0.06) 52%, transparent 70%, rgba(232,88,140,0.08) 85%, transparent); transform: translateX(3px); }
		38% { opacity: 0; transform: translateX(0); }
		100% { opacity: 0; }
	}

	/* Eye wrap — graceful flower bloom */
	.social-eye-wrap {
		animation: blossom-reveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both,
				   blossom-breathe 2.5s ease-in-out 0.7s infinite;
		position: relative; z-index: 2;
	}
	@keyframes blossom-reveal {
		0% { opacity: 0; transform: scale(0.15) rotate(-12deg) translateY(30px); filter: blur(6px) saturate(2); }
		35% { opacity: 0.7; transform: scale(1.1) rotate(2deg) translateY(-5px); filter: blur(1px) saturate(1.4); }
		65% { opacity: 1; transform: scale(0.97) rotate(-1deg) translateY(2px); filter: blur(0) saturate(0.9); }
		100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); filter: blur(0) saturate(1); }
	}
	@keyframes blossom-breathe {
		0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0px rgba(232,88,140,0)); }
		50% { transform: scale(1.015) rotate(0.5deg); filter: drop-shadow(0 0 40px rgba(232,88,140,0.2)) drop-shadow(0 0 80px rgba(253,119,217,0.1)); }
	}

	.social-eye-frame {
		position: relative;
		width: min(85vw, 800px);
		aspect-ratio: 2 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.social-eye-img {
		width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2;
		animation: bloom-zoom 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		filter: drop-shadow(0 0 60px rgba(232,88,140,0.3)) drop-shadow(0 0 120px rgba(253,119,217,0.15));
	}
	@keyframes bloom-zoom {
		0% { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: brightness(2.5) saturate(0.5) hue-rotate(-20deg); }
		50% { opacity: 0.8; transform: scale(1.06) rotate(1deg); filter: brightness(1.3) saturate(1.2) hue-rotate(5deg); }
		100% { opacity: 1; transform: scale(1) rotate(0deg); filter: brightness(1) saturate(1) hue-rotate(0deg); }
	}

	/* Frame border — sakura pink energy */
	.social-eye-border {
		position: absolute; inset: -10px; z-index: 3; pointer-events: none;
		border: 2px solid rgba(232,88,140,0.4);
		clip-path: polygon(0% 5%, 3% 0%, 97% 2%, 100% 4%, 100% 96%, 96% 100%, 4% 98%, 0% 95%);
		animation: blossom-border 0.8s ease-out forwards;
	}
	@keyframes blossom-border {
		0% { border-color: rgba(255,255,255,0); opacity: 0; border-width: 3px; transform: scale(0.9); }
		20% { border-color: rgba(253,119,217,1); opacity: 1; border-width: 3px; transform: scale(1.02); box-shadow: 0 0 40px rgba(232,88,140,0.3), inset 0 0 40px rgba(232,88,140,0.08); }
		50% { border-color: rgba(255,255,255,0.6); border-width: 2px; }
		100% { border-color: rgba(232,88,140,0.4); opacity: 0.9; border-width: 1.5px; transform: scale(1); box-shadow: 0 0 15px rgba(232,88,140,0.1); }
	}

	/* Corner brackets — pink pulse */
	.social-eye-corner {
		position: absolute; width: 30px; height: 30px; z-index: 4; pointer-events: none;
		border-color: #e8588c; opacity: 0.9;
		animation: petal-corner-pulse 1.5s ease-in-out infinite;
	}
	.social-corner-tl { top: -15px; left: -15px; border-top: 3px solid; border-left: 3px solid; }
	.social-corner-tr { top: -15px; right: -15px; border-top: 3px solid; border-right: 3px solid; }
	.social-corner-bl { bottom: -15px; left: -15px; border-bottom: 3px solid; border-left: 3px solid; }
	.social-corner-br { bottom: -15px; right: -15px; border-bottom: 3px solid; border-right: 3px solid; }
	@keyframes petal-corner-pulse {
		0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 4px rgba(232,88,140,0.3)); }
		50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(232,88,140,0.6)); }
	}

	/* "!!" — sakura energy marks */
	.social-exclamation {
		position: absolute; font-family: var(--font-skip); font-size: 2.8rem;
		color: #fff; z-index: 5; pointer-events: none; line-height: 1;
		text-shadow: 0 0 30px rgba(232,88,140,0.9), 0 0 60px rgba(253,119,217,0.5), 0 0 100px rgba(232,88,140,0.2);
		animation: petal-ex-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both,
				   petal-ex-glow 2s ease-in-out 0.5s infinite;
	}
	.social-ex-left { top: -18px; left: 10%; }
	.social-ex-right { bottom: -18px; right: 10%; }
	@keyframes petal-ex-pop {
		0% { opacity: 0; transform: scale(0.2) rotate(-15deg) translateY(10px); filter: blur(4px); }
		60% { opacity: 1; transform: scale(1.2) rotate(3deg) translateY(-3px); filter: blur(0); }
		100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); filter: blur(0); }
	}
	@keyframes petal-ex-glow {
		0%, 100% { text-shadow: 0 0 30px rgba(232,88,140,0.9), 0 0 60px rgba(253,119,217,0.5); }
		50% { text-shadow: 0 0 50px rgba(232,88,140,1), 0 0 100px rgba(253,119,217,0.7), 0 0 150px rgba(232,88,140,0.3); }
	}

	/* ===== PHASE: AOA ===== */
	.social-art-layer {
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

	.social-art-img {
		object-fit: cover;
		object-position: center 20%;
		animation: aoa-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transition: opacity 0.35s ease-out, filter 0.35s ease-out;
	}
	@keyframes aoa-slam {
		from { opacity: 0; transform: scale(1.3); filter: brightness(1.8); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.social-art-content {
		opacity: 0.25;
		filter: blur(3px) brightness(0.35);
	}

	.social-nameplate {
		position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
		width: min(55vw, 450px); height: auto; z-index: 5;
		animation: nameplate-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
	}
	@keyframes nameplate-in {
		from { opacity: 0; transform: translateX(-50%) translateY(50px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.social-art-vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(30,10,20,0.25) 100%);
		z-index: 2;
		transition: all 0.35s ease-out;
	}
	.social-vig-strong {
		background: radial-gradient(ellipse at center, transparent 30%, rgba(30,10,20,0.7) 100%);
	}

	/* ===== PHASE: CONTENT ===== */
	.social-content-panel {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		animation: social-panel-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
	}
	@keyframes social-panel-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* === Header === */
	.social-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.5rem 0; flex-shrink: 0;
	}
	.social-title-row {
		display: flex; align-items: center; gap: 0.75rem;
	}
	.social-arcana-icon {
		height: 2rem; width: auto;
		filter: drop-shadow(0 0 12px rgba(232,88,140,0.3));
	}
	.social-title {
		font-family: var(--font-skip); font-size: 1.75rem; color: #fff;
		text-shadow: 0 2px 12px rgba(0,0,0,0.5), var(--text-shadow-border);
	}
	.social-tab-btn {
		padding: 0.35rem 1rem; border-radius: 0.375rem;
		font-family: var(--font-new-rodin); font-size: 0.9rem;
		transition: all 0.2s; cursor: pointer; border: none; outline: none;
	}
	.social-tab-active {
		background: rgba(232,88,140,0.2); color: #fff; font-weight: 700;
		backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		box-shadow: 0 0 20px rgba(232,88,140,0.25);
	}
	.social-tab-inactive { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
	.social-tab-inactive:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); }

	/* === Arcana watermark === */
	.social-arcana-watermark {
		position: absolute; right: 2rem; top: 50%; transform: translateY(-50%);
		width: min(30vw, 280px); opacity: 0.06; pointer-events: none; z-index: 0;
	}
	.social-arcana-watermark img { width: 100%; height: auto; }

	/* === Scroll content === */
	.social-content-scroll {
		flex: 1; overflow-y: auto; position: relative; z-index: 1;
		padding: 0.5rem 0;
	}
	.social-content-scroll::-webkit-scrollbar { width: 3px; }
	.social-content-scroll::-webkit-scrollbar-track { background: transparent; }
	.social-content-scroll::-webkit-scrollbar-thumb { background: rgba(232,88,140,0.3); border-radius: 2px; }

	/* === Link cards === */
	.social-link-card {
		display: flex; align-items: center; gap: 1.5rem;
		padding: 1.25rem; border-radius: 0.75rem;
		background: rgba(0,0,0,0.55); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(232,88,140,0.15);
		transition: all 0.3s;
		animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes stagger-in {
		from { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.92); }
		50% { transform: translateY(-4px) rotate(1deg) scale(1.02); }
		to { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
	}
	.social-link-card:hover {
		border-color: rgba(232,88,140,0.5);
		background: rgba(0,0,0,0.65);
		box-shadow: 0 0 30px rgba(232,88,140,0.15);
	}

	.social-link-icon-wrap {
		width: 3.5rem; height: 3.5rem; border-radius: 0.75rem;
		display: flex; align-items: center; justify-content: center;
		position: relative; overflow: hidden; flex-shrink: 0;
	}
	.social-link-name {
		font-family: var(--font-skip); font-size: 1.1rem; color: #fff;
		text-shadow: 0 2px 8px rgba(0,0,0,0.3);
	}
	.social-link-url {
		color: rgba(255,255,255,0.7); font-size: 0.8rem;
		font-family: var(--font-new-rodin); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
		text-shadow: 0 1px 6px rgba(0,0,0,0.4);
	}
	.social-link-ext {
		color: rgba(255,255,255,0.5); font-size: 1.5rem; flex-shrink: 0;
		transition: color 0.2s;
		text-shadow: 0 1px 6px rgba(0,0,0,0.4);
	}
	.social-link-card:hover .social-link-ext { color: #e8588c; }

	/* === Connect tab === */
	.social-stagger { animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
	.social-section-title {
		font-family: var(--font-skip); font-size: 2rem;
		color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,0.5), var(--text-shadow-border);
		margin-bottom: 0.75rem;
	}
	.social-section-desc {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.85);
		font-style: italic; font-size: 0.95rem;
		text-shadow: 0 1px 8px rgba(0,0,0,0.5);
	}

	.social-divider {
		color: rgba(255,255,255,0.08); font-family: var(--font-skip);
		font-size: 1.25rem; text-align: center; letter-spacing: 0.5em;
		animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.03s both;
	}

	.social-email-card {
		padding: 1.5rem; border-radius: 0.75rem;
		background: linear-gradient(135deg, rgba(232,88,140,0.15), rgba(200,60,110,0.08));
		backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(232,88,140,0.2);
		animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.06s both;
	}
	.social-email-icon {
		width: 3.5rem; height: 3.5rem; border-radius: 0.75rem;
		background: #e8588c; display: flex; align-items: center; justify-content: center;
	}
	.social-email-title {
		font-family: var(--font-skip); font-size: 1.1rem; color: #fff;
		text-shadow: 0 2px 8px rgba(0,0,0,0.3);
	}
	.social-email-sub {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.7); font-size: 0.85rem; margin-top: 0.1rem;
	}
	.social-copy-btn {
		width: 100%; padding: 0.75rem 1.5rem; border-radius: 0.5rem;
		background: rgba(0,0,0,0.3); border: 1px solid rgba(232,88,140,0.15);
		font-family: var(--font-new-rodin); font-size: 1rem; color: #fff;
		display: flex; align-items: center; justify-content: center; gap: 0.75rem;
		transition: all 0.2s; cursor: pointer;
	}
	.social-copy-btn:hover {
		background: rgba(232,88,140,0.1);
		border-color: rgba(232,88,140,0.4);
		box-shadow: 0 0 20px rgba(232,88,140,0.1);
	}

	.social-avail-card {
		padding: 1.25rem; border-radius: 0.75rem;
		background: rgba(0,0,0,0.45); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		border: 1px solid rgba(232,88,140,0.12);
		animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.09s both;
	}
	.social-avail-title {
		font-family: var(--font-skip); font-size: 1.2rem; color: #e8588c;
		margin-bottom: 1rem; text-shadow: 0 0 15px rgba(232,88,140,0.2);
	}
	.social-avail-item {
		padding: 0.75rem; border-radius: 0.5rem;
		background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);
	}
	.social-avail-val {
		font-family: var(--font-skip); font-size: 1.5rem; line-height: 1;
		text-shadow: var(--text-shadow-border);
	}
	.social-avail-lbl {
		font-family: var(--font-new-rodin); color: rgba(255,255,255,0.6);
		font-size: 0.7rem; margin-top: 0.1rem;
	}

	/* === Footer === */
	.social-footer {
		display: flex; align-items: center; justify-content: center;
		gap: 1.5rem; padding: 0.5rem 0; flex-shrink: 0;
	}
</style>
