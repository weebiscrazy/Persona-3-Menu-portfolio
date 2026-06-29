<script lang="ts">
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";
	import Control from "./Control.svelte";
	import Particles from "./Particles.svelte";
	import { cn } from "$lib/utils";
	import type { SubmenuTab } from "$lib/types";

	let {
		title,
		tabs,
		activeTab = $bindable(0),
		onBack,
		children,
		tarotCards = []
	}: {
		title: string;
		tabs: SubmenuTab[];
		activeTab?: number;
		onBack: () => void;
		children: Snippet<[number]>;
		tarotCards?: string[];
	} = $props();

	let closing = $state(false);
	let contentKey = $state(0);
	let touchStartX = 0;
	let touchStartY = 0;
	let isMobile = $state(false);

	onMount(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		isMobile = mq.matches;
	});

	function handleKeydown(e: KeyboardEvent) {
		if (closing) return;
		if (e.key === "ArrowRight" && activeTab < tabs.length - 1) {
			activeTab++;
			contentKey++;
			e.preventDefault();
		} else if (e.key === "ArrowLeft" && activeTab > 0) {
			activeTab--;
			contentKey++;
			e.preventDefault();
		} else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
			e.preventDefault();
			close();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (closing) return;
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		const absDx = Math.abs(dx);
		const absDy = Math.abs(dy);

		if (absDy > absDx && dy > 50) {
			close();
		} else if (absDx > absDy && absDx > 40) {
			if (dx > 0 && activeTab > 0) {
				activeTab--;
				contentKey++;
			} else if (dx < 0 && activeTab < tabs.length - 1) {
				activeTab++;
				contentKey++;
			}
		}
	}

	function close() {
		if (closing) return;
		closing = true;
		setTimeout(() => onBack(), 450);
	}

	function handleTabClick(index: number) {
		if (index === activeTab) return;
		activeTab = index;
		contentKey++;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role="dialog"
	aria-label={title}
	class="submenu-overlay fixed inset-0 z-50 flex items-center justify-center touch-pan-y"
	onkeydown={handleKeydown}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	tabindex="-1"
	class:submenu-closing={closing}
>
	{#if !isMobile}
		<svg aria-hidden="true" style="position:absolute;width:0;height:0;pointer-events:none;z-index:0">
			<defs>
				<filter id="water-distortion">
					<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise"/>
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G"/>
				</filter>
			</defs>
		</svg>
	{/if}

	<div class="submenu-noise"></div>
	<div class="submenu-vignette"></div>

	<div class="submenu-panel w-[95vw] h-[92vh] md:w-[90vw] md:h-[90vh] max-w-7xl flex flex-col overflow-hidden"
		style="clip-path: polygon(0% 3%, 2% 0%, 98% 0.5%, 100% 2%, 100% 98%, 97% 100%, 3% 99%, 0% 96%)"
	>
		<div class="submenu-bg-layer"></div>
		<Particles {isMobile} />
		<header class="submenu-header flex items-center justify-between p-4 md:p-8 border-b border-fg/10 flex-shrink-0">
			<h1 class="font-skip text-2xl md:text-4xl tracking-tight text-fg" style="text-shadow: var(--text-shadow-border)">{title}</h1>
			<div class="flex gap-1 md:gap-2 overflow-x-auto" role="tablist" aria-label="Submenu tabs">
				{#each tabs as tab, i}
					<button
						class={cn(
							"submenu-tab-btn px-3 md:px-6 py-1.5 md:py-2 rounded-md font-new-rodin text-sm md:text-xl transition-all duration-200 whitespace-nowrap",
							i === activeTab
								? "submenu-tab-active bg-pink text-bg font-bold"
								: "bg-fg/10 text-muted hover:bg-fg/20 hover:text-fg"
						)}
						role="tab"
						aria-selected={i === activeTab}
						onclick={() => handleTabClick(i)}
					>
						{tab.name}
					</button>
				{/each}
			</div>
		</header>

		<div class="submenu-accent-line h-[2px] mx-4 md:mx-8"></div>

		<div class="submenu-content-wrapper flex-1 relative min-h-0">
			<div class="submenu-shapes" aria-hidden="true">
				<svg class="shape shape-circle" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="none" stroke="#FD77D9" stroke-width="0.5" opacity="0.3"/></svg>
				<svg class="shape shape-diamond" viewBox="0 0 200 200"><rect x="40" y="40" width="120" height="120" rx="8" fill="none" stroke="#16CFFB" stroke-width="0.5" opacity="0.25" transform="rotate(45 100 100)"/></svg>
				<svg class="shape shape-arc" viewBox="0 0 200 200"><path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#7DE6FD" stroke-width="0.5" opacity="0.2"/></svg>
				<svg class="shape shape-line-h" viewBox="0 0 200 4"><line x1="0" y1="2" x2="200" y2="2" stroke="#FD77D9" stroke-width="0.5" opacity="0.2"/></svg>
				<svg class="shape shape-ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="60" fill="none" stroke="url(#ringGrad)" stroke-width="0.4" opacity="0.2"/><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FD77D9"/><stop offset="100%" stop-color="#16CFFB"/></linearGradient></defs></svg>
			</div>

			<div class="submenu-bg-text">
				<span class="bg-text-arcana">{tabs[activeTab]?.arcanaNumber ?? tabs[activeTab]?.name}</span>
				<span class="bg-text-name">{tabs[activeTab]?.name}</span>
			</div>

			<div class="absolute inset-0 overflow-y-auto p-4 md:p-8 pb-36">
				{#key contentKey}
					<div class="submenu-content-inner">
						{@render children(activeTab)}
					</div>
				{/key}
			</div>

			{#key contentKey}
				<div class="tarot-card-container">
					{#if tarotCards[activeTab]}
						<div class="tarot-card">
							<img src={tarotCards[activeTab]} alt={tabs[activeTab]?.name} class="w-full rounded-lg" />
							<div class="text-center mt-1.5 text-xs text-muted/60 font-new-rodin">
								{tabs[activeTab]?.name}
							</div>
						</div>
					{/if}
				</div>
			{/key}
		</div>

		<footer class="submenu-footer flex items-center justify-center gap-2 md:gap-8 p-2 md:p-5 border-t border-fg/10 flex-shrink-0">
			{#if isMobile}
				<button onclick={() => { if (activeTab > 0) { activeTab--; contentKey++; } }} class="px-4 py-2 bg-fg/10 rounded-md text-fg text-lg font-new-rodin">← Prev</button>
				<button onclick={() => { if (activeTab < tabs.length - 1) { activeTab++; contentKey++; } }} class="px-4 py-2 bg-fg/10 rounded-md text-fg text-lg font-new-rodin">Next →</button>
				<div class="grow"></div>
				<button onclick={close} class="px-6 py-2 bg-pink/20 rounded-md text-pink text-lg font-new-rodin font-bold">Close</button>
			{:else}
				<Control key="← →">Tabs</Control>
				<span class="hidden md:inline"><Control key="↑ ↓">Scroll</Control></span>
				<Control key="B">Back</Control>
			{/if}
		</footer>
	</div>
</div>

<style>
	/* === Circle Reveal === */
	.submenu-overlay {
		background: rgba(0, 62, 150, 0.96);
		clip-path: circle(0% at center);
		animation: circle-expand 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
	.submenu-closing {
		animation: circle-contract 0.35s ease-in forwards;
	}
	.submenu-closing .submenu-panel {
		animation: panel-out 0.35s cubic-bezier(0.55, 0, 1, 0.45) both;
	}
	.submenu-closing .submenu-header,
	.submenu-closing .submenu-footer {
		animation: el-out 0.2s ease-in both;
	}
	.submenu-closing .submenu-accent-line {
		animation: accent-out 0.2s ease-in both;
	}
	.submenu-closing .tarot-card-container {
		animation: card-out 0.2s ease-in both;
	}

	@keyframes circle-expand {
		from { clip-path: circle(0% at center); }
		to { clip-path: circle(100% at center); }
	}
	@keyframes circle-contract {
		from { clip-path: circle(100% at center); }
		to { clip-path: circle(0% at center); }
	}

	/* === Water Background Layer === */
	.submenu-bg-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		background: linear-gradient(135deg, var(--color-bg-dark), var(--color-water-mid), var(--color-bg), var(--color-water-mid), var(--color-bg-dark));
	}
	@media (min-width: 768px) {
		.submenu-bg-layer {
			filter: url(#water-distortion);
		}
	}
	.submenu-bg-layer::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 30% 40%, rgba(22,207,251,0.04), transparent 60%),
		            radial-gradient(ellipse at 70% 60%, rgba(77,254,252,0.03), transparent 50%);
	}
	@media (min-width: 768px) {
		.submenu-bg-layer::before {
			animation: bg-breathe 8s ease-in-out infinite alternate;
		}
	}
	@keyframes bg-breathe {
		0% { opacity: 0.6; }
		100% { opacity: 1; }
	}

	/* === Ripple Rings === */
	.submenu-bg-layer::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 20% 30%, transparent 30%, rgba(22,207,251,0.04) 35%, transparent 40%),
			radial-gradient(circle at 75% 20%, transparent 20%, rgba(22,207,251,0.03) 25%, transparent 30%),
			radial-gradient(circle at 50% 70%, transparent 25%, rgba(22,207,251,0.03) 30%, transparent 35%),
			radial-gradient(circle at 85% 80%, transparent 35%, rgba(22,207,251,0.02) 40%, transparent 45%);
		background-size: 200% 200%;
	}
	@media (min-width: 768px) {
		.submenu-bg-layer::after {
			animation: ripple-expand 8s ease-out infinite;
		}
	}
	@keyframes ripple-expand {
		0% { background-size: 100% 100%; opacity: 0.8; }
		50% { background-size: 200% 200%; opacity: 0.4; }
		100% { background-size: 100% 100%; opacity: 0.8; }
	}

	/* === Noise & Vignette === */
	.submenu-noise {
		position: fixed; inset: 0; pointer-events: none; z-index: 1;
		opacity: 0.03;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-repeat: repeat; background-size: 256px 256px;
	}
	.submenu-vignette {
		position: fixed; inset: 0; pointer-events: none; z-index: 1;
		background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.12) 100%);
	}

	/* === Panel === */
	.submenu-panel {
		position: relative;
		z-index: 2;
		background: transparent;
		filter: drop-shadow(0 0 40px rgba(22,207,251,0.07));
		animation: panel-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
	}
	@media (min-width: 768px) {
		.submenu-panel {
			animation: panel-float 4s ease-in-out infinite, panel-glow 3s ease-in-out infinite, panel-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		}
	}
	@keyframes panel-float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
	@keyframes panel-glow {
		0%, 100% { box-shadow: 0 0 60px rgba(253,119,217,0.08), 0 0 120px rgba(253,119,217,0.04); }
		50% { box-shadow: 0 0 80px rgba(253,119,217,0.12), 0 0 160px rgba(253,119,217,0.06); }
	}
	@keyframes panel-in {
		from { opacity: 0; transform: translateX(120px) scale(0.95); }
		to { opacity: 1; transform: translateX(0) scale(1); }
	}
	@keyframes panel-out {
		from { opacity: 1; transform: translateX(0) scale(1); }
		to { opacity: 0; transform: translateX(120px) scale(0.95); }
	}

	/* === Header === */
	.submenu-header {
		position: relative;
		z-index: 5;
		animation: el-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.12s both;
	}
	.submenu-tab-active {
		animation: tab-glow 2s ease-in-out infinite;
	}
	@keyframes tab-glow {
		0%, 100% { box-shadow: 0 0 20px rgba(253,119,217,0.4); }
		50% { box-shadow: 0 0 35px rgba(253,119,217,0.6); }
	}

	/* === Accent line === */
	.submenu-accent-line {
		position: relative;
		z-index: 5;
		background: linear-gradient(90deg, var(--color-pink), var(--color-button-1), var(--color-pink));
		background-size: 200% 100%;
		animation: accent-flow 3s linear infinite, accent-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.18s both;
	}
	@keyframes accent-flow {
		0% { background-position: 0% 50%; }
		100% { background-position: 200% 50%; }
	}
	@keyframes accent-in {
		from { opacity: 0; transform: scaleX(0); transform-origin: left; }
		to { opacity: 1; transform: scaleX(1); transform-origin: left; }
	}
	@keyframes accent-out {
		from { opacity: 1; transform: scaleX(1); transform-origin: left; }
		to { opacity: 0; transform: scaleX(0); transform-origin: left; }
	}

	/* === Content === */
	.submenu-content-wrapper {
		z-index: 2;
		animation: el-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.22s both;
	}

	/* === Background Text === */
	.submenu-bg-text {
		position: absolute;
		right: -0.04em;
		top: 0;
		line-height: 0.7;
		pointer-events: none;
		user-select: none;
		white-space: nowrap;
		animation: bg-text-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
	}
	.bg-text-arcana {
		font-family: var(--font-skip);
		font-size: 32vh;
		color: var(--color-fg);
		opacity: 0.03;
		text-shadow: var(--text-shadow-border);
		display: block;
		margin-right: -0.5em;
	}
	.bg-text-name {
		font-family: var(--font-new-rodin);
		font-size: 4vh;
		color: var(--color-fg);
		opacity: 0.015;
		display: block;
		text-align: right;
		margin-top: -0.3em;
		letter-spacing: 0.3em;
	}
	@keyframes bg-text-in {
		from { opacity: 0; transform: scale(0.85) translateX(20px); }
		to { opacity: 1; transform: scale(1) translateX(0); }
	}

	.submenu-content-inner {
		animation: content-fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
	}
	@keyframes content-fade-in {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* === Decorative Shapes === */
	.submenu-shapes {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}
	.submenu-shapes .shape {
		position: absolute;
	}
	.shape-circle {
		width: 300px; height: 300px;
		top: 10%; right: -5%;
	}
	.shape-diamond {
		width: 160px; height: 160px;
		bottom: 15%; left: 5%;
	}
	.shape-arc {
		width: 240px; height: 240px;
		top: 30%; left: 20%;
	}
	.shape-line-h {
		width: 400px; height: 4px;
		top: 45%; right: 10%;
	}
	.shape-ring {
		width: 200px; height: 200px;
		bottom: 25%; right: 20%;
	}
	@media (min-width: 768px) {
		.shape-circle {
			animation: shape-drift 8s ease-in-out infinite, shape-rotate 20s linear infinite;
		}
		.shape-diamond {
			animation: shape-drift 6s ease-in-out infinite reverse, shape-rotate 15s linear infinite;
		}
		.shape-arc {
			animation: shape-drift 10s ease-in-out infinite 1s, shape-rotate 25s linear infinite reverse;
		}
		.shape-line-h {
			animation: shape-pulse 4s ease-in-out infinite;
		}
		.shape-ring {
			animation: shape-drift 7s ease-in-out infinite 0.5s, shape-rotate 18s linear infinite;
		}
	}

	@keyframes shape-drift {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15px); }
	}
	@keyframes shape-rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	@keyframes shape-pulse {
		0%, 100% { opacity: 0.15; transform: scaleX(1); }
		50% { opacity: 0.3; transform: scaleX(1.3); }
	}

	/* === Tarot Card === */
	.tarot-card-container {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 100px;
		z-index: 10;
		pointer-events: auto;
	}
	@media (min-width: 768px) {
		.tarot-card-container { width: 120px; }
	}
	.tarot-card {
		animation: card-flip-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both, card-bob 3s ease-in-out infinite 0.6s;
		transition: transform 0.3s ease, filter 0.3s ease;
	}
	.tarot-card:hover {
		transform: scale(1.06);
		filter: brightness(1.08) drop-shadow(0 0 20px rgba(253,119,217,0.25));
	}
	@keyframes card-flip-in {
		from { opacity: 0; transform: perspective(800px) rotateY(-75deg); }
		to { opacity: 1; transform: perspective(800px) rotateY(0deg); }
	}
	@keyframes card-bob {
		0%, 100% { transform: perspective(800px) rotateY(0deg) translateY(0); }
		50% { transform: perspective(800px) rotateY(0deg) translateY(-4px); }
	}
	@keyframes card-out {
		from { opacity: 1; }
		to { opacity: 0; }
	}

	/* === Footer === */
	.submenu-footer {
		position: relative;
		z-index: 5;
		animation: el-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.28s both;
	}

	/* === Shared === */
	@keyframes el-in {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes el-out {
		from { opacity: 1; transform: translateY(0); }
		to { opacity: 0; transform: translateY(-8px); }
	}

	/* === Custom scrollbar === */
	.submenu-content-wrapper ::-webkit-scrollbar { width: 4px; }
	.submenu-content-wrapper ::-webkit-scrollbar-track { background: transparent; }
	.submenu-content-wrapper ::-webkit-scrollbar-thumb { background: var(--color-pink); border-radius: 2px; }
	.submenu-content-wrapper ::-webkit-scrollbar-thumb:hover { background: var(--color-button-1); }
	@supports not selector(::-webkit-scrollbar) {
		.submenu-content-wrapper { scrollbar-width: thin; scrollbar-color: var(--color-pink) transparent; }
	}
</style>