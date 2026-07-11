<script lang="ts">
	import { onMount } from "svelte";
	import Control from "./Control.svelte";
	import ParticleCanvas from "./ParticleCanvas.svelte";
	import { personaData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);
	let phase = $state<"eye" | "aoa" | "content">("eye");
	let closing = $state(false);

	const tabs = [
		{ name: "Hobbies", index: 0, arcanaNumber: "I" },
		{ name: "Fun Facts", index: 1, arcanaNumber: "XVIII" }
	];

	const AOA_BG = "#EAB308";

	function stars(n: number): string {
		return "★".repeat(Math.min(n, 5)) + "☆".repeat(Math.max(0, 5 - Math.min(n, 5)));
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

	function handleTabClick(index: number) {
		if (index === activeTab) return;
		activeTab = index;
	}

	onMount(() => {
		["/T_UI_Camp_Status_Character_Glass_0008.png",
		 "/T_Btl_AlloutFinish_Pc08_A1out.png",
		 "/T_Btl_AlloutFinishText_Pc08out.png",
		 "/T_UI_Camp_Status_Character_0008.png"
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
	class="persona-root fixed inset-0 z-50"
	class:persona-closing={closing}
	role="dialog"
	aria-label="Persona"
	onkeydown={handleKeydown}
	tabindex="-1"
>
	{#if phase === "eye"}
		<div class="absolute inset-0 z-10 persona-bg-dim">
			<div class="absolute inset-0 persona-bg-dim-overlay"></div>
		</div>
		<div class="absolute inset-0 z-20 flex items-center justify-center persona-eye-wrap">
			<div class="persona-eye-frame">
				<img
					src="/T_UI_Camp_Status_Character_Glass_0008.png"
					alt="eye cut-in"
					class="persona-eye-img"
				/>
				<div class="persona-scanlines"></div>
				{#each Array(15) as _, i}
					<div class="persona-glitch-square" style="left: {5 + (i * 7) % 85}%; top: {5 + (i * 11) % 85}%; animation-delay: {(i % 10) * 0.03}s"></div>
				{/each}
				<div class="persona-eye-border"></div>
				<div class="persona-eye-corner persona-corner-tl"></div>
				<div class="persona-eye-corner persona-corner-tr"></div>
				<div class="persona-eye-corner persona-corner-bl"></div>
				<div class="persona-eye-corner persona-corner-br"></div>
				<span class="persona-exclamation persona-ex-left">!!</span>
				<span class="persona-exclamation persona-ex-right">!!</span>
			</div>
		</div>

	{:else}
		<div class="absolute inset-0 persona-art-layer" style="background: {AOA_BG};">
			<img
				src="/T_Btl_AlloutFinish_Pc08_A1out.png"
				alt=""
				class="absolute inset-0 w-full h-full persona-art-img"
				class:persona-art-content={phase === "content"}
			/>
			<div class="absolute inset-0 persona-art-vignette" class:persona-vig-strong={phase === "content"}></div>
		</div>

		{#if phase === "aoa"}
			<img
				src="/T_Btl_AlloutFinishText_Pc08out.png"
				alt=""
				class="persona-nameplate"
			/>
		{/if}

{#if phase === "content"}
		<div class="relative z-10 h-full flex flex-col persona-content-panel">
			<ParticleCanvas type="data" class="pointer-events-none" />
			<header class="persona-header">
				<div class="persona-title-row">
					<img src="/arcana/chariot.png" alt="Chariot" class="persona-arcana-icon" />
					<h1 class="persona-title">PERSONA</h1>
				</div>
				<div class="flex gap-2" role="tablist">
					{#each tabs as tab, i}
						<button
							class={cn("persona-tab-btn", i === activeTab ? "persona-tab-active" : "persona-tab-inactive")}
							role="tab"
							aria-selected={i === activeTab}
							onclick={() => handleTabClick(i)}
						>{tab.name}</button>
					{/each}
				</div>
			</header>

			<div class="flex-1 flex flex-col min-h-0">
				<div class="persona-arcana-watermark" aria-hidden="true">
					<img src="/arcana/chariot.png" alt="" />
				</div>

				{#key activeTab}
					<div class="persona-content-scroll">
						{#if activeTab === 0}
							<div class="max-w-5xl mx-auto w-full space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{#each personaData as persona, i}
										<div
											class={cn(
												"persona-hobby-card group stagger-in",
												"relative p-6 rounded-2xl bg-fg/5 border border-fg/10",
												"hover:border-amber/50 hover:bg-fg/10 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]",
												"transition-all duration-300"
											)}
style="animation-delay: {0.3 + i * 0.12}s"
										>
											<div class="flex items-start gap-4 mb-4">
												<div class="size-14 rounded-xl flex items-center justify-center shrink-0" style="background: {persona.color}">
													<iconify-icon icon={persona.icon} class="text-2xl text-bg"></iconify-icon>
												</div>
												<div class="flex-1 min-w-0">
													<h4 class="font-skip text-xl text-fg truncate" style="text-shadow: var(--text-shadow-border)">{persona.name}</h4>
													<div class="text-button-1 text-sm font-new-rodin tracking-wider mt-0.5">{stars(persona.rating)}</div>
												</div>
											</div>

											<p class="text-muted text-sm leading-relaxed mb-4 font-new-rodin">{persona.description}</p>

											<div class="pt-4 border-t border-fg/10">
												<p class="text-xs text-muted/60 font-new-rodin mb-2 tracking-widest">FAVORITES</p>
												<div class="flex flex-wrap gap-1.5">
													{#each persona.favorites as fav}
														<span class="inline-block px-2.5 py-1 rounded-md bg-fg/10 text-fg/80 text-xs font-new-rodin">{fav}</span>
													{/each}
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="max-w-2xl mx-auto w-full space-y-8">
								{#each personaData as persona, i}
									<div
										class={cn(
											"persona-fact-card stagger-in",
											"relative p-6 rounded-2xl bg-fg/5 border border-fg/10",
											"hover:border-amber/30 hover:bg-fg/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.08)]",
											"transition-all duration-300"
										)}
										style="animation-delay: {0.3 + i * 0.12}s"
									>
										<div class="flex items-start gap-4">
											<div class="size-10 rounded-lg flex items-center justify-center shrink-0" style="background: {persona.color}">
												<iconify-icon icon={persona.icon} class="text-xl text-bg"></iconify-icon>
											</div>
											<div class="flex-1">
												<h4 class="font-skip text-lg text-fg mb-1" style="text-shadow: var(--text-shadow-border)">{persona.name}</h4>
												<p class="text-muted font-new-rodin italic leading-relaxed">{persona.funFact}</p>
											</div>
										</div>
									</div>
								{/each}

								<div class="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber/10 to-yellow/10 border border-fg/10 stagger-in" style="animation-delay: 0.8s">
									<h4 class="font-skip text-xl mb-4 text-center text-amber" style="text-shadow: var(--text-shadow-border)">Current Build</h4>
									<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
										<div class="p-4 rounded-xl bg-fg/5">
											<p class="font-skip text-3xl text-button-1" style="text-shadow: var(--text-shadow-border)">Svelte 5</p>
											<p class="text-muted text-sm font-new-rodin">Framework</p>
										</div>
										<div class="p-4 rounded-xl bg-fg/5">
											<p class="font-skip text-3xl text-button-2" style="text-shadow: var(--text-shadow-border)">TypeScript</p>
											<p class="text-muted text-sm font-new-rodin">Language</p>
										</div>
										<div class="p-4 rounded-xl bg-fg/5">
											<p class="font-skip text-3xl text-amber" style="text-shadow: var(--text-shadow-border)">Tailwind 4</p>
											<p class="text-muted text-sm font-new-rodin">Styling</p>
										</div>
										<div class="p-4 rounded-xl bg-fg/5">
											<p class="font-skip text-3xl text-button-1" style="text-shadow: var(--text-shadow-border)">Vite</p>
											<p class="text-muted text-sm font-new-rodin">Bundler</p>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<footer class="persona-footer">
				<Control key="← →">Tabs</Control>
				<Control key="B">Back</Control>
			</footer>
		</div>
		{/if}
	{/if}
</div>

<style>
	/* === Root === */
	.persona-root { background: transparent; outline: none; isolation: isolate; }
	.persona-closing { opacity: 0; transition: opacity 0.3s ease-out; }
	.persona-closing .persona-hobby-card,
	.persona-closing .persona-fact-card,
	.persona-closing .persona-tab-active { backdrop-filter: none; -webkit-backdrop-filter: none; }

	/* ===== PHASE: EYE ===== */
	.persona-bg-dim-overlay { animation: dim-in 0.3s ease-out forwards; }
	@keyframes dim-in {
		from { background: rgba(30,15,0,0); }
		to { background: rgba(30,15,0,0.7); }
	}

	.persona-eye-wrap { animation: scan-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; z-index: 5; }
	@keyframes scan-reveal {
		from { transform: scale(0.5); filter: blur(10px); opacity: 0; }
		to { transform: scale(1); filter: blur(0); opacity: 1; }
	}

	.persona-eye-frame {
		position: relative;
		width: min(85vw, 800px);
		aspect-ratio: 2 / 1;
		display: flex; align-items: center; justify-content: center;
	}

	.persona-eye-img {
		width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2;
		animation: eye-zoom 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		filter: drop-shadow(0 0 50px rgba(234,179,8,0.4)) drop-shadow(0 0 100px rgba(234,179,8,0.2));
	}
	@keyframes eye-zoom {
		from { opacity: 0; transform: scale(0.7); filter: brightness(2); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.persona-scanlines {
		position: absolute; inset: 0; z-index: 3; pointer-events: none;
		background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234,179,8,0.06) 2px, rgba(234,179,8,0.06) 4px);
		animation: scan-sweep 0.6s ease-out forwards;
	}
	@keyframes scan-sweep {
		0% { clip-path: inset(0 0 100% 0); }
		100% { clip-path: inset(0 0 0% 0); }
	}

	.persona-glitch-square {
		position: absolute; width: 10px; height: 10px; z-index: 6; pointer-events: none;
		background: rgba(234,179,8,0.3);
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		animation: glitch-pop 0.15s ease-out forwards;
	}
	@keyframes glitch-pop {
		0% { opacity: 0; transform: scale(0); }
		50% { opacity: 1; transform: scale(1.3); }
		100% { opacity: 0; transform: scale(0.5); }
	}

	.persona-eye-border {
		position: absolute; inset: -8px; z-index: 3; pointer-events: none;
		border: 2px solid rgba(234,179,8,0.5);
		clip-path: polygon(0% 5%, 3% 0%, 97% 2%, 100% 4%, 100% 96%, 96% 100%, 4% 98%, 0% 95%);
		animation: border-flick 0.6s ease-out forwards;
	}
	@keyframes border-flick {
		0% { border-color: rgba(255,255,255,0.9); opacity: 0; }
		30% { border-color: rgba(234,179,8,0.8); opacity: 1; }
		60% { border-color: rgba(255,255,255,0.6); }
		100% { border-color: rgba(234,179,8,0.3); opacity: 0.8; }
	}

	.persona-eye-corner {
		position: absolute; width: 28px; height: 28px; z-index: 4; pointer-events: none;
		border-color: #EAB308; opacity: 0.8;
	}
	.persona-corner-tl { top: -14px; left: -14px; border-top: 3px solid; border-left: 3px solid; }
	.persona-corner-tr { top: -14px; right: -14px; border-top: 3px solid; border-right: 3px solid; }
	.persona-corner-bl { bottom: -14px; left: -14px; border-bottom: 3px solid; border-left: 3px solid; }
	.persona-corner-br { bottom: -14px; right: -14px; border-bottom: 3px solid; border-right: 3px solid; }

	.persona-exclamation {
		position: absolute; font-family: var(--font-skip); font-size: 2.5rem;
		color: #fff; z-index: 5; pointer-events: none; line-height: 1;
		text-shadow: 0 0 30px rgba(234,179,8,0.8), 0 0 60px rgba(234,179,8,0.4);
		animation: ex-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
	}
	.persona-ex-left { top: -16px; left: 12%; }
	.persona-ex-right { bottom: -16px; right: 12%; }
	@keyframes ex-pop {
		from { opacity: 0; transform: scale(0.3) rotate(-10deg); }
		to { opacity: 1; transform: scale(1) rotate(0deg); }
	}

	/* ===== PHASE: AOA ===== */
	.persona-art-layer { animation: aoa-bg-in 0.3s ease-out both; }
	@keyframes aoa-bg-in { from { opacity: 0; } to { opacity: 1; } }

	.persona-art-img {
		object-fit: cover;
		object-position: center 30%;
		animation: aoa-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transition: opacity 0.35s ease-out, filter 0.35s ease-out;
	}
	@keyframes aoa-slam {
		from { opacity: 0; transform: scale(1.3); filter: brightness(1.8); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.persona-art-content {
		opacity: 0.25;
		filter: blur(3px) brightness(0.35);
	}

	.persona-nameplate {
		position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
		width: min(55vw, 450px); height: auto; z-index: 5;
		animation: nameplate-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
	}
	@keyframes nameplate-in {
		from { opacity: 0; transform: translateX(-50%) translateY(50px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.persona-art-vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(30,15,0,0.25) 100%);
		z-index: 2;
		transition: all 0.35s ease-out;
	}
	.persona-vig-strong {
		background: radial-gradient(ellipse at center, transparent 30%, rgba(30,15,0,0.7) 100%);
	}

	/* ===== PHASE: CONTENT ===== */
	.persona-content-panel {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		animation: persona-panel-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
	}
	@keyframes persona-panel-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* === Header === */
	.persona-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.5rem 0; flex-shrink: 0;
	}
	.persona-title-row { display: flex; align-items: center; gap: 0.75rem; }
	.persona-arcana-icon { height: 2rem; width: auto; filter: drop-shadow(0 0 12px rgba(234,179,8,0.3)); }
	.persona-title { font-family: var(--font-skip); font-size: 1.75rem; color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,0.5), var(--text-shadow-border); }
	.persona-tab-btn {
		padding: 0.35rem 1rem; border-radius: 0.375rem;
		font-family: var(--font-new-rodin); font-size: 0.9rem;
		transition: all 0.2s; cursor: pointer; border: none; outline: none;
	}
	.persona-tab-active {
		background: rgba(234,179,8,0.2); color: #fff; font-weight: 700;
		backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
		box-shadow: 0 0 20px rgba(234,179,8,0.25);
	}
	.persona-tab-inactive { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
	.persona-tab-inactive:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }

	/* === Arcana watermark === */
	.persona-arcana-watermark {
		position: absolute; right: 2rem; top: 50%; transform: translateY(-50%);
		width: min(30vw, 280px); opacity: 0.06; pointer-events: none; z-index: 0;
	}
	.persona-arcana-watermark img { width: 100%; height: auto; }

	/* === Scroll content === */
	.persona-content-scroll {
		flex: 1; overflow-y: auto; position: relative; z-index: 1;
		padding: 0.5rem 0;
	}
	.persona-content-scroll::-webkit-scrollbar { width: 3px; }
	.persona-content-scroll::-webkit-scrollbar-track { background: transparent; }
	.persona-content-scroll::-webkit-scrollbar-thumb { background: rgba(234,179,8,0.3); border-radius: 2px; }

	/* === Hobby cards === */
	.persona-hobby-card {
		animation: stagger-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes stagger-in {
		from { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.92); }
		50% { transform: translateY(-4px) rotate(1deg) scale(1.02); }
		to { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
	}

	/* === Fact cards === */
	.persona-fact-card {
		animation: stagger-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	/* === Footer === */
	.persona-footer {
		display: flex; align-items: center; justify-content: center;
		gap: 1.5rem; padding: 0.5rem 0; flex-shrink: 0;
	}
</style>