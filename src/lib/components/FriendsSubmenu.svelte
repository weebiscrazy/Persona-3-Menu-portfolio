<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import Control from "./Control.svelte";
	import ParticleCanvas from "./ParticleCanvas.svelte";
	import { friendsData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);
	let phase = $state<"eye" | "aoa" | "content">("eye");
	let closing = $state(false);
	let currentSlide = $state(0);
	const slidesPerView = 2;

	const tabs = [
		{ name: "Allies", index: 0, arcanaNumber: "VII" },
		{ name: "Testimonials", index: 1, arcanaNumber: "XIX" }
	];

	const AOA_BG = "#78716C";

	function nextSlide() {
		const maxSlide = Math.max(0, friendsData.length - slidesPerView);
		currentSlide = currentSlide < maxSlide ? currentSlide + 1 : 0;
	}

	function prevSlide() {
		const maxSlide = Math.max(0, friendsData.length - slidesPerView);
		currentSlide = currentSlide > 0 ? currentSlide - 1 : maxSlide;
	}

	function handleClose() {
		if (closing) return;
		closing = true;
		setTimeout(() => (window as any).closeSubmenu?.(), 350);
	}

	function skipToContent(): boolean {
		if (phase === "content") return false;
		phase = "content";
		return true;
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

	onMount(() => {
		["/T_UI_Camp_Status_Character_Glass_0004.png",
		 "/T_Btl_AlloutFinish_Pc04_A1out.png",
		 "/T_Btl_AlloutFinishText_Pc04out.png",
		 "/T_UI_Camp_Status_Character_0004.png"
		].forEach(src => { const img = new Image(); img.src = src; });

		setTimeout(() => { if (phase !== "content") phase = "aoa"; }, 900);
		setTimeout(() => { if (phase !== "content") phase = "content"; }, 2500);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="friends-root fixed inset-0 z-50"
	class:friends-closing={closing}
	role="dialog"
	aria-label="Friends"
	onkeydown={handleKeydown}
	tabindex="-1"
>
	{#if phase === "eye"}
		<div class="absolute inset-0 z-10 friends-bg-dim">
			<div class="absolute inset-0 friends-bg-dim-overlay"></div>
			<div class="friends-storm-clouds" aria-hidden="true"></div>
		</div>
		<div class="absolute inset-0 z-20 flex items-center justify-center">
			<div class="friends-lightning-flash" aria-hidden="true"></div>
			<div class="friends-lightning-bolts" aria-hidden="true">
				<svg viewBox="0 0 300 300" class="friends-bolt-svg">
					<polyline class="friends-bolt-1" points="150,0 100,100 140,90 80,200" fill="none" stroke="#FFD700" stroke-width="3" stroke-linejoin="round" />
					<polyline class="friends-bolt-2" points="60,20 90,110 70,105 30,190" fill="none" stroke="#FFE44D" stroke-width="2" stroke-linejoin="round" />
					<polyline class="friends-bolt-3" points="240,30 190,120 220,115 170,210" fill="none" stroke="#FFD700" stroke-width="2" stroke-linejoin="round" />
					<polyline class="friends-bolt-4" points="180,10 160,80 185,75 140,170" fill="none" stroke="#FFC125" stroke-width="1.5" stroke-linejoin="round" />
					<polyline class="friends-bolt-5" points="100,40 130,105 110,100 80,180" fill="none" stroke="#FFE44D" stroke-width="1.5" stroke-linejoin="round" />
				</svg>
			</div>
			{#each Array(20) as _, i}
				<div class="friends-spark" style="--sp-x: {5 + (i * 12) % 90}%; --sp-y: {10 + (i * 8) % 80}%; --sp-d: {0.1 + (i % 10) * 0.05}s; --sp-s: {3 + (i % 5) * 2}px; --sp-angle: {i * 37}deg"></div>
			{/each}
			<div class="friends-eye-wrap">
				<div class="friends-eye-frame">
					<img
						src="/T_UI_Camp_Status_Character_Glass_0004.png"
						alt="eye cut-in"
						class="friends-eye-img"
					/>
					<div class="friends-eye-glitch" aria-hidden="true"></div>
					<div class="friends-eye-border"></div>
					<div class="friends-eye-corner friends-corner-tl"></div>
					<div class="friends-eye-corner friends-corner-tr"></div>
					<div class="friends-eye-corner friends-corner-bl"></div>
					<div class="friends-eye-corner friends-corner-br"></div>
					<span class="friends-exclamation friends-ex-left">!!</span>
					<span class="friends-exclamation friends-ex-right">!!</span>
				</div>
			</div>
		</div>

	{:else}
		<div class="absolute inset-0 friends-art-layer" style="background: {AOA_BG};">
			<img
				src="/T_Btl_AlloutFinish_Pc04_A1out.png"
				alt=""
				class="absolute inset-0 w-full h-full friends-art-img"
				class:friends-art-content={phase === "content"}
			/>
			<div class="absolute inset-0 friends-art-vignette" class:friends-vig-strong={phase === "content"}></div>
		</div>

		{#if phase === "aoa"}
			<img
				src="/T_Btl_AlloutFinishText_Pc04out.png"
				alt=""
				class="friends-nameplate"
			/>
		{/if}

		{#if phase === "content"}
		<div class="relative z-10 h-full flex flex-col friends-content-panel">
			<ParticleCanvas type="electric" class="pointer-events-none" />
			<header class="friends-header">
				<div class="friends-title-row">
					<img src="/arcana/strength.png" alt="Strength" class="friends-arcana-icon" />
					<h1 class="friends-title">FRIENDS</h1>
				</div>
				<div class="flex gap-2" role="tablist">
					{#each tabs as tab, i}
						<button
							class={cn("friends-tab-btn", i === activeTab ? "friends-tab-active" : "friends-tab-inactive")}
							role="tab"
							aria-selected={i === activeTab}
							onclick={() => activeTab = i}
						>{tab.name}</button>
					{/each}
				</div>
			</header>

			<div class="flex-1 flex flex-col min-h-0">
				<div class="friends-arcana-watermark" aria-hidden="true">
					<img src="/arcana/strength.png" alt="" />
				</div>

				{#key activeTab}
					<div class="friends-content-scroll">
						{#if activeTab === 0}
							<div class="max-w-5xl mx-auto w-full space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
									{#each friendsData as friend, i}
										<div
											class={cn(
												"friends-ally-card group",
												"stagger-in"
											)}
											style="animation-delay: {0.3 + i * 0.12}s"
										>
											<div class="relative mb-4">
												<div class="size-20 rounded-xl bg-gradient-to-br from-amber/20 to-stone/20 flex items-center justify-center overflow-hidden border-2 border-fg/10 group-hover:border-amber/50 transition-colors">
													{#if friend.avatar}
														<img src={friend.avatar} alt={friend.name} class="size-full object-cover" />
													{:else}
														<span class="font-skip text-3xl text-amber">{friend.name.charAt(0)}</span>
													{/if}
												</div>
												<div class="absolute -bottom-2 -right-2 size-8 rounded-full bg-amber border-2 border-bg flex items-center justify-center">
													<iconify-icon icon="mdi:account-check" class="text-xl text-bg"></iconify-icon>
												</div>
											</div>
											<div class="mb-3">
												<h4 class="font-skip text-xl text-fg" style="text-shadow: var(--text-shadow-border)">{friend.name}</h4>
												<p class="text-amber text-sm font-new-rodin">{friend.role}</p>
											</div>
											<p class="text-muted text-sm mb-4 italic font-new-rodin">"{friend.quote}"</p>
											{#if friend.url}
												<a
													href={friend.url}
													target="_blank"
													rel="noopener noreferrer"
													class="inline-flex items-center gap-2 text-sm font-new-rodin text-amber hover:text-button-2 transition-colors"
												>
													<iconify-icon icon={friend.platform === "GitHub" ? "mdi:github" : friend.platform === "Twitter" ? "mdi:twitter" : "mdi:linkedin"} class="text-lg"></iconify-icon>
													Connect
												</a>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="max-w-3xl mx-auto">
								<div class="relative">
									<div class="overflow-hidden">
										<div class="flex transition-transform duration-500 ease-out" style="transform: translateX({-currentSlide * (100 / slidesPerView)}%)">
											{#each friendsData as friend, i}
												<div class="w-[calc(100%/2)] px-4" style="min-width: {100 / slidesPerView}%">
													<div class="h-full p-8 rounded-2xl bg-fg/5 border border-fg/10 hover:border-amber/30 transition-all">
														<div class="flex items-center gap-4 mb-6">
															<div class="size-16 rounded-xl bg-gradient-to-br from-amber/20 to-stone/20 flex items-center justify-center overflow-hidden border-2 border-fg/10">
																{#if friend.avatar}
																	<img src={friend.avatar} alt={friend.name} class="size-full object-cover" />
																{:else}
																	<span class="font-skip text-2xl text-amber">{friend.name.charAt(0)}</span>
																{/if}
															</div>
															<div>
																<h4 class="font-skip text-xl text-fg" style="text-shadow: var(--text-shadow-border)">{friend.name}</h4>
																<p class="text-amber text-sm font-new-rodin">{friend.role}</p>
															</div>
														</div>
														<div class="relative">
															<span class="block font-skip text-6xl text-amber/20 leading-none absolute -top-2 -left-2">"</span>
															<p class="text-lg leading-relaxed text-muted relative z-10 italic font-new-rodin pl-6">{friend.quote}</p>
														</div>
													</div>
												</div>
											{/each}
										</div>
									</div>
									<div class="flex justify-center gap-4 mt-8">
										<button
											onclick={prevSlide}
											class="size-12 rounded-full bg-fg/10 hover:bg-fg/20 hover:border-amber/50 border border-fg/20 flex items-center justify-center transition-all"
											aria-label="Previous testimonial"
										>
											<iconify-icon icon="mdi:chevron-left" class="text-2xl"></iconify-icon>
										</button>
										<div class="flex gap-2 items-center">
											{#each friendsData as _, i}
												<button
													class={cn(
														"size-2 rounded-full transition-all duration-200",
														i === currentSlide ? "bg-amber w-6" : "bg-fg/30 hover:bg-fg/50"
													)}
													onclick={() => currentSlide = i}
													aria-label="Go to testimonial"
												></button>
											{/each}
										</div>
										<button
											onclick={nextSlide}
											class="size-12 rounded-full bg-fg/10 hover:bg-fg/20 hover:border-amber/50 border border-fg/20 flex items-center justify-center transition-all"
											aria-label="Next testimonial"
										>
											<iconify-icon icon="mdi:chevron-right" class="text-2xl"></iconify-icon>
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<footer class="friends-footer">
				<Control key="← →">Tabs</Control>
				<Control key="B">Back</Control>
			</footer>
		</div>
		{/if}
	{/if}
</div>

<style>
	/* === Root === */
	.friends-root { background: transparent; outline: none; isolation: isolate; }
	.friends-closing { opacity: 0; transition: opacity 0.3s ease-out; }
	.friends-closing .friends-ally-card,
	.friends-closing .friends-tab-active { backdrop-filter: none; -webkit-backdrop-filter: none; }

	/* ===== PHASE: EYE — Thunder God's Wrath ===== */
	/* Storm-darkened sky */
	.friends-bg-dim-overlay {
		animation: storm-dim 0.6s ease-out forwards;
	}
	@keyframes storm-dim {
		0% { background: rgba(20,10,5,0); }
		35% { background: rgba(40,25,10,0.5); }
		100% { background: rgba(15,8,3,0.85); }
	}

	/* Rolling storm clouds */
	.friends-storm-clouds {
		position: absolute; inset: 0; z-index: 1; pointer-events: none;
		overflow: hidden;
		background:
			radial-gradient(ellipse at 20% 30%, rgba(60,50,40,0.3) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 20%, rgba(40,30,20,0.25) 0%, transparent 45%),
			radial-gradient(ellipse at 50% 70%, rgba(50,40,30,0.2) 0%, transparent 55%);
		animation: clouds-roll 3s ease-in-out infinite;
	}
	@keyframes clouds-roll {
		0% { transform: translateX(-5%) scale(1); opacity: 0.5; }
		50% { transform: translateX(5%) scale(1.05); opacity: 0.8; }
		100% { transform: translateX(-5%) scale(1); opacity: 0.5; }
	}

	/* Lightning flash strobe */
	.friends-lightning-flash {
		position: absolute; inset: 0; z-index: 2; pointer-events: none;
		background: rgba(255,215,0,0.2);
		animation: thunder-flash 0.5s ease-out forwards;
	}
	@keyframes thunder-flash {
		0% { opacity: 1; background: rgba(255,255,255,0.6); }
		8% { opacity: 0.2; background: rgba(255,215,0,0.3); }
		15% { opacity: 0.9; background: rgba(255,255,255,0.5); }
		25% { opacity: 0.1; background: rgba(255,215,0,0.15); }
		35% { opacity: 0.5; background: rgba(255,255,255,0.3); }
		50% { opacity: 0; }
		100% { opacity: 0; }
	}

	/* Lightning bolts — 5 branching strikes */
	.friends-lightning-bolts {
		position: absolute; inset: 0; z-index: 3; pointer-events: none;
		display: flex; align-items: center; justify-content: center;
	}
	.friends-bolt-svg {
		width: min(95vw, 800px); height: 100%; opacity: 0;
		animation: bolt-zap 0.6s ease-out 0.03s forwards;
		filter: drop-shadow(0 0 20px rgba(255,215,0,0.6)) drop-shadow(0 0 60px rgba(255,215,0,0.3));
	}
	.friends-bolt-1 { animation: bolt-strike 0.25s ease-out 0.03s both; }
	.friends-bolt-2 { animation: bolt-strike 0.25s ease-out 0.07s both; }
	.friends-bolt-3 { animation: bolt-strike 0.25s ease-out 0.11s both; }
	.friends-bolt-4 { animation: bolt-strike 0.25s ease-out 0.15s both; }
	.friends-bolt-5 { animation: bolt-strike 0.25s ease-out 0.19s both; }
	@keyframes bolt-strike {
		from { opacity: 0; stroke-dasharray: 600; stroke-dashoffset: 600; }
		to { opacity: 1; stroke-dashoffset: 0; }
	}
	@keyframes bolt-zap {
		0% { opacity: 1; filter: brightness(3); }
		40% { opacity: 0.8; filter: brightness(1.5); }
		100% { opacity: 0; filter: brightness(0.3); }
	}

	/* Golden sparks burst */
	.friends-spark {
		position: absolute; z-index: 3; pointer-events: none;
		left: var(--sp-x); top: var(--sp-y);
		width: var(--sp-s); height: var(--sp-s);
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.4), transparent);
		box-shadow: 0 0 6px rgba(255,215,0,0.6);
		animation: spark-burst 0.7s ease-out calc(var(--sp-d)) forwards;
	}
	@keyframes spark-burst {
		0% { transform: translate(0, 0) scale(0); opacity: 1; }
		30% { opacity: 0.8; transform: translate(calc(cos(var(--sp-angle)) * 40px), calc(sin(var(--sp-angle)) * 40px)) scale(1.2); }
		100% { transform: translate(calc(cos(var(--sp-angle)) * 120px), calc(sin(var(--sp-angle)) * 120px)) scale(0.2); opacity: 0; }
	}

	/* Eye glitch — electric displacement */
	.friends-eye-glitch {
		position: absolute; inset: 0; z-index: 6; pointer-events: none;
		overflow: hidden; opacity: 0;
		animation: thunder-glitch 0.55s ease-out 0.08s forwards;
	}
	@keyframes thunder-glitch {
		0% { opacity: 0; }
		3% { opacity: 0.35; background: linear-gradient(0deg, transparent 0%, rgba(255,215,0,0.2) 12%, transparent 28%, rgba(255,215,0,0.15) 45%, transparent 62%, rgba(255,255,255,0.1) 78%, transparent); transform: translateX(-7px) skewX(-1.5deg); }
		7% { opacity: 0; transform: translateX(6px) skewX(1deg); }
		11% { opacity: 0.25; background: linear-gradient(0deg, transparent 6%, rgba(255,255,255,0.15) 20%, transparent 35%, rgba(255,215,0,0.12) 52%, transparent 68%, rgba(255,215,0,0.1) 84%, transparent); transform: translateX(-4px) skewX(1deg); }
		15% { opacity: 0; transform: translateX(0); }
		22% { opacity: 0.15; background: linear-gradient(0deg, transparent 4%, rgba(255,215,0,0.18) 16%, transparent 32%, rgba(255,255,255,0.08) 50%, transparent 66%, rgba(255,215,0,0.1) 82%, transparent); transform: translateX(5px) skewX(-0.8deg); }
		30% { opacity: 0; transform: translateX(0); }
		100% { opacity: 0; }
	}

	/* Eye wrap — tears through reality */
	.friends-eye-wrap {
		animation: thunder-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both,
				   thunder-breathe 2.5s ease-in-out 0.6s infinite;
		position: relative; z-index: 5;
	}
	@keyframes thunder-reveal {
		0% { opacity: 0; transform: scale(1.5) rotate(-10deg); clip-path: inset(50% 50% 50% 50% round 50%); filter: brightness(3) blur(8px); }
		25% { opacity: 0.6; transform: scale(0.9) rotate(4deg); clip-path: inset(10% 5% 15% 5% round 20%); filter: brightness(1.8) blur(3px); }
		50% { opacity: 1; transform: scale(1.05) rotate(-2deg); clip-path: inset(2% 1% 3% 1% round 5%); filter: brightness(1.2) blur(1px); }
		75% { transform: scale(0.98) rotate(0.5deg); filter: brightness(0.9); }
		100% { opacity: 1; transform: scale(1) rotate(0deg); clip-path: inset(0); filter: brightness(1) blur(0); }
	}
	@keyframes thunder-breathe {
		0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(255,215,0,0)) brightness(1); }
		50% { transform: scale(1.015); filter: drop-shadow(0 0 40px rgba(255,215,0,0.25)) drop-shadow(0 0 80px rgba(255,215,0,0.1)) brightness(1.08); }
	}

	.friends-eye-frame {
		position: relative;
		width: min(85vw, 800px);
		aspect-ratio: 2 / 1;
		display: flex; align-items: center; justify-content: center;
	}

	.friends-eye-img {
		width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2;
		animation: thunder-zoom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		filter: drop-shadow(0 0 60px rgba(255,215,0,0.4)) drop-shadow(0 0 120px rgba(255,215,0,0.2));
	}
	@keyframes thunder-zoom {
		0% { opacity: 0; transform: scale(0.4) rotate(-8deg); filter: brightness(3) saturate(0.3) contrast(2); }
		45% { opacity: 0.9; transform: scale(1.08) rotate(2deg); filter: brightness(1.5) saturate(1.2) contrast(1.1); }
		100% { opacity: 1; transform: scale(1) rotate(0deg); filter: brightness(1) saturate(1) contrast(1); }
	}

	/* Frame border — golden lightning energy */
	.friends-eye-border {
		position: absolute; inset: -10px; z-index: 3; pointer-events: none;
		border: 2px solid rgba(255,215,0,0.4);
		clip-path: polygon(0% 5%, 3% 0%, 97% 2%, 100% 4%, 100% 96%, 96% 100%, 4% 98%, 0% 95%);
		animation: thunder-border 0.7s ease-out forwards;
	}
	@keyframes thunder-border {
		0% { border-color: rgba(255,255,255,0); opacity: 0; border-width: 4px; transform: scale(0.85); }
		15% { border-color: rgba(255,215,0,1); opacity: 1; border-width: 3px; transform: scale(1.03); box-shadow: 0 0 50px rgba(255,215,0,0.5), inset 0 0 50px rgba(255,215,0,0.12); }
		40% { border-color: rgba(255,255,255,0.8); border-width: 2px; }
		100% { border-color: rgba(255,215,0,0.5); opacity: 0.9; border-width: 1.5px; transform: scale(1); box-shadow: 0 0 20px rgba(255,215,0,0.15); }
	}

	/* Corner brackets — electric gold pulse */
	.friends-eye-corner {
		position: absolute; width: 30px; height: 30px; z-index: 4; pointer-events: none;
		border-color: #FFD700; opacity: 0.9;
		animation: thunder-corner-pulse 1.5s ease-in-out infinite;
	}
	.friends-corner-tl { top: -15px; left: -15px; border-top: 3px solid; border-left: 3px solid; }
	.friends-corner-tr { top: -15px; right: -15px; border-top: 3px solid; border-right: 3px solid; }
	.friends-corner-bl { bottom: -15px; left: -15px; border-bottom: 3px solid; border-left: 3px solid; }
	.friends-corner-br { bottom: -15px; right: -15px; border-bottom: 3px solid; border-right: 3px solid; }
	@keyframes thunder-corner-pulse {
		0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 4px rgba(255,215,0,0.3)); }
		50% { opacity: 1; filter: drop-shadow(0 0 15px rgba(255,215,0,0.7)) drop-shadow(0 0 30px rgba(255,215,0,0.2)); }
	}

	/* "!!" — thunder energy marks */
	.friends-exclamation {
		position: absolute; font-family: var(--font-skip); font-size: 2.8rem;
		color: #fff; z-index: 5; pointer-events: none; line-height: 1;
		text-shadow: 0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.5), 0 0 100px rgba(255,215,0,0.2);
		animation: thunder-ex-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both,
				   thunder-ex-glow 2s ease-in-out 0.5s infinite;
	}
	.friends-ex-left { top: -18px; left: 10%; }
	.friends-ex-right { bottom: -18px; right: 10%; }
	@keyframes thunder-ex-pop {
		0% { opacity: 0; transform: scale(0.2) rotate(-15deg) translateY(10px); filter: blur(4px); }
		60% { opacity: 1; transform: scale(1.2) rotate(3deg) translateY(-3px); filter: blur(0); }
		100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); filter: blur(0); }
	}
	@keyframes thunder-ex-glow {
		0%, 100% { text-shadow: 0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.5); }
		50% { text-shadow: 0 0 50px rgba(255,215,0,1), 0 0 100px rgba(255,215,0,0.7), 0 0 150px rgba(255,215,0,0.3); }
	}

	/* ===== PHASE: AOA ===== */
	.friends-art-layer {
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

	.friends-art-img {
		object-fit: cover;
		object-position: center 30%;
		animation: aoa-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transition: opacity 0.35s ease-out, filter 0.35s ease-out;
	}
	@keyframes aoa-slam {
		from { opacity: 0; transform: scale(1.3); filter: brightness(1.8); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.friends-art-content {
		opacity: 0.25;
		filter: blur(3px) brightness(0.35);
	}

	.friends-nameplate {
		position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
		width: min(55vw, 450px); height: auto; z-index: 5;
		animation: nameplate-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
	}
	@keyframes nameplate-in {
		from { opacity: 0; transform: translateX(-50%) translateY(50px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.friends-art-vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(30,25,20,0.25) 100%);
		z-index: 2;
		transition: all 0.35s ease-out;
	}
	.friends-vig-strong {
		background: radial-gradient(ellipse at center, transparent 30%, rgba(30,25,20,0.7) 100%);
	}

	/* ===== PHASE: CONTENT ===== */
	.friends-content-panel {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		animation: friends-panel-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
	}
	@keyframes friends-panel-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* === Header === */
	.friends-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.5rem 0; flex-shrink: 0;
	}
	.friends-title-row { display: flex; align-items: center; gap: 0.75rem; }
	.friends-arcana-icon { height: 2rem; width: auto; filter: drop-shadow(0 0 12px rgba(120,113,108,0.3)); }
	.friends-title { font-family: var(--font-skip); font-size: 1.75rem; color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,0.5), var(--text-shadow-border); }
	.friends-tab-btn {
		padding: 0.35rem 1rem; border-radius: 0.375rem;
		font-family: var(--font-new-rodin); font-size: 0.9rem;
		transition: all 0.2s; cursor: pointer; border: none; outline: none;
	}
	.friends-tab-active {
		background: rgba(120,113,108,0.2); color: #fff; font-weight: 700;
		backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		box-shadow: 0 0 20px rgba(120,113,108,0.25);
	}
	.friends-tab-inactive { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
	.friends-tab-inactive:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }

	/* === Arcana watermark === */
	.friends-arcana-watermark {
		position: absolute; right: 2rem; top: 50%; transform: translateY(-50%);
		width: min(30vw, 280px); opacity: 0.06; pointer-events: none; z-index: 0;
	}
	.friends-arcana-watermark img { width: 100%; height: auto; }

	/* === Scroll content === */
	.friends-content-scroll {
		flex: 1; overflow-y: auto; position: relative; z-index: 1;
		padding: 0.5rem 0;
	}
	.friends-content-scroll::-webkit-scrollbar { width: 3px; }
	.friends-content-scroll::-webkit-scrollbar-track { background: transparent; }
	.friends-content-scroll::-webkit-scrollbar-thumb { background: rgba(120,113,108,0.3); border-radius: 2px; }

	/* === Ally cards === */
	.friends-ally-card {
		padding: 1.5rem; border-radius: 1rem;
		background: rgba(0,0,0,0.45); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(120,113,108,0.12);
		transition: all 0.3s;
		animation: stagger-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes stagger-in {
		from { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.92); }
		50% { transform: translateY(-4px) rotate(1deg) scale(1.02); }
		to { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
	}
	.friends-ally-card:hover {
		border-color: rgba(120,113,108,0.5);
		background: rgba(0,0,0,0.55);
		box-shadow: 0 0 30px rgba(120,113,108,0.1);
	}

	/* === Testimonials === */
	.friends-testimonial-card {
		padding: 2rem; border-radius: 1rem;
		background: rgba(0,0,0,0.4); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		border: 1px solid rgba(120,113,108,0.1);
		transition: all 0.3s;
	}
	.friends-testimonial-card:hover {
		border-color: rgba(120,113,108,0.3);
		background: rgba(0,0,0,0.5);
	}

	/* === Footer === */
	.friends-footer {
		display: flex; align-items: center; justify-content: center;
		gap: 1.5rem; padding: 0.5rem 0; flex-shrink: 0;
	}
</style>