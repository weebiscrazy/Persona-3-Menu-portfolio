<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Submenu from "./Submenu.svelte";
	import { profileData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);
	let phase = $state<"eye" | "aoa" | "shatter" | "content">("eye");
	let closing = $state(false);

	const tabs = [
		{ name: "Profile", index: 0, arcanaNumber: "0" },
		{ name: "Stats", index: 1, arcanaNumber: "XI" },
		{ name: "Bio", index: 2, arcanaNumber: "IX" }
	];

	function skipToContent(): boolean {
		if (phase === "content") return false;
		phase = "content";
		return true;
	}

	function handleClose() {
		if (closing) return;
		closing = true;
		(window as any).closeSubmenu?.();
	}

	onMount(() => {
		// Phase 1: Eye cut-in (0.4s)
		const t1 = setTimeout(() => {
			if (phase === "content") return;
			phase = "aoa";
		}, 400);

		// Phase 2: AOA slam (0.8s)
		const t2 = setTimeout(() => {
			if (phase === "content") return;
			phase = "shatter";
		}, 1200);

		// Phase 3: Shatter reveals content (0.6s)
		const t3 = setTimeout(() => {
			if (phase === "content") return;
			phase = "content";
		}, 1800);

		return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="aoa-container"
	tabindex="-1"
	class:aoa-closing={closing}
>
	<!-- ===== AOA INTRO SEQUENCE ===== -->
	{#if phase !== "content"}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden aoa-layer"
			class:aoa-phase-eye={phase === "eye"}
			class:aoa-phase-slam={phase === "aoa"}
			class:aoa-phase-shatter={phase === "shatter"}
			transition:fade={{ duration: 400 }}
		>
			<!-- Screen flash -->
			<div class="absolute inset-0 aoa-flash"></div>

			<!-- Phase 1: Eye cut-in -->
			{#if phase === "eye"}
				<div class="absolute inset-0 aoa-shake flex items-center justify-center">
					<img
						src="/T_UI_Camp_Status_Character_Glass_0001.png"
						alt="eye cut-in"
						class="aoa-eye-img"
					/>
				</div>

			<!-- Phase 2: AOA art slam -->
			{:else if phase === "aoa"}
				<img
					src="/T_Btl_AlloutFinish_Pc01_A1out.png"
					alt="all-out attack"
					class="absolute inset-0 w-full h-full object-cover aoa-art"
				/>
				<img
					src="/T_Btl_AlloutFinishText_Pc01out.png"
					alt="name plate"
					class="aoa-nameplate"
				/>
				<!-- Glass overlay softens the edges like the P3R frosted frame -->
				<div class="absolute inset-0 pointer-events-none aoa-glass-edge"></div>

			<!-- Phase 3: Shatter -->
			{:else if phase === "shatter"}
				<img
					src="/T_Btl_AlloutFinish_Pc01_A1out.png"
					alt="all-out attack"
					class="absolute inset-0 w-full h-full object-cover aoa-shatter-img"
				/>
				<img
					src="/T_UI_Camp_Status_Character_Glass_0001.png"
					alt="glass shatter"
					class="aoa-glass-shatter"
				/>
				<div class="absolute inset-0 pointer-events-none aoa-glass-overlay"></div>
			{/if}

			<!-- Skip hint -->
			<div class="absolute bottom-6 right-6 text-fg/30 font-new-rodin text-sm tracking-wider aoa-skip-hint">
				Press B to skip
			</div>
		</div>
	{/if}

	<!-- ===== SUBMENU ===== -->
	<Submenu
		title="ABOUT"
		{tabs}
		onBack={handleClose}
		bind:activeTab
		skipTransition={true}
		onIntroBack={skipToContent}
		tarotCards={["/arcana/fool.png", "/arcana/strength.png", "/arcana/hermit.png"]}
	>
		{#snippet children(currentTab)}
			<div class="about-layout min-h-full">
				<!-- Desktop: Makoto portrait left column -->
				<div class="hidden md:flex about-portrait-col">
					<div class="about-portrait-inner">
						<img
							src="/T_UI_Camp_Status_Character_0001.png"
							alt="portrait"
							class="about-portrait-img"
						/>
						<div class="about-portrait-glass"></div>
						<img
							src="/T_UI_Camp_Status_Character_Shadow_0001.png"
							alt=""
							class="about-portrait-shadow"
						/>
					</div>
				</div>

				<!-- Right: Info + tabs content -->
				<div class="about-info-col">
					<!-- Name plate header -->
					<div class="about-nameplate-row">
						<img
							src="/T_Btl_AlloutFinishText_Pc01out.png"
							alt="name plate"
							class="about-nameplate"
						/>
					</div>

					<!-- Title & tagline -->
					<div class="about-headline">
						<h2 class="about-title">{profileData.title}</h2>
						<p class="about-tagline">"{profileData.tagline}"</p>
					</div>

					<!-- Stats row (always visible) -->
					<div class="about-stats-row">
						{#each profileData.stats as stat}
							<div class="about-stat-card">
								<span class="about-stat-value">{stat.value}</span>
								<span class="about-stat-label">{stat.label}</span>
							</div>
						{/each}
					</div>

					<!-- Social links -->
					<div class="about-social-row">
						{#each profileData.socialLinks as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="about-social-link"
								style="color: {link.color}"
								aria-label={link.platform}
							>
								<iconify-icon icon={link.icon} class="about-social-icon"></iconify-icon>
							</a>
						{/each}
					</div>

					<!-- Divider -->
					<div class="about-divider"></div>

					<!-- Sub-tab content -->
					{#if currentTab === 0}
						<!-- Profile -->
						<div class="about-bio-text stagger-item">
							<p class="text-muted font-new-rodin leading-relaxed">{profileData.bio}</p>
						</div>
					{:else if currentTab === 1}
						<!-- Stats detail -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-item">
							{#each profileData.stats as stat, i}
								<div
									class={cn(
										"relative p-6 rounded-xl bg-fg/5 border border-fg/10",
										"hover:border-pink/50 transition-all duration-300",
										"hover:shadow-[0_0_30px_rgba(253,119,217,0.15)]"
									)}
								>
									<div class="flex flex-col items-center gap-1">
										<span class="font-skip text-4xl text-pink" style="text-shadow: var(--text-shadow-border)">{stat.value}</span>
										<span class="font-new-rodin text-muted">{stat.label}</span>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- Bio -->
						<div class="about-bio-full stagger-item">
							<p class="about-bio-paragraph">{profileData.bio}</p>
							<div class="about-bio-separator">━━━</div>
							<div class="about-focus-card">
								<h3 class="about-focus-title">Current Focus</h3>
								<ul class="about-focus-list">
									<li class="about-focus-item">
										<iconify-icon icon="mdi:rocket-launch" class="about-focus-icon text-pink"></iconify-icon>
										Building portfolio sites with game-inspired UX
									</li>
									<li class="about-focus-item">
										<iconify-icon icon="mdi:code-braces" class="about-focus-icon text-button-1"></iconify-icon>
										Learning Rust for systems programming
									</li>
									<li class="about-focus-item">
										<iconify-icon icon="mdi:gamepad-variant" class="about-focus-icon text-button-2"></iconify-icon>
										Experimenting with Godot 4 for game jams
									</li>
								</ul>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/snippet}
	</Submenu>
</div>

<style>
	/* === Container === */
	.aoa-container {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.aoa-closing {
		animation: aoa-close 0.35s ease-in forwards;
	}
	@keyframes aoa-close {
		from { opacity: 1; }
		to { opacity: 0; }
	}

	/* ===== AOA LAYER ===== */
	.aoa-layer {
		background: #000;
	}

	/* === White Flash === */
	.aoa-flash {
		background: #fff;
		opacity: 0;
		pointer-events: none;
	}
	.aoa-phase-eye .aoa-flash {
		animation: flash-bang 0.4s ease-out forwards;
	}
	.aoa-phase-slam .aoa-flash {
		animation: flash-subtle 0.15s ease-out forwards;
	}
	@keyframes flash-bang {
		0% { opacity: 0.9; }
		60% { opacity: 0.3; }
		100% { opacity: 0; }
	}
	@keyframes flash-subtle {
		0% { opacity: 0.5; }
		100% { opacity: 0; }
	}

	/* === Screen Shake === */
	.aoa-shake {
		animation: screen-shake 0.35s ease-out;
	}
	@keyframes screen-shake {
		0% { transform: translate(0, 0); }
		10% { transform: translate(-8px, 4px); }
		20% { transform: translate(6px, -6px); }
		30% { transform: translate(-4px, 2px); }
		40% { transform: translate(3px, -3px); }
		50% { transform: translate(-2px, 1px); }
		60% { transform: translate(1px, -1px); }
		100% { transform: translate(0, 0); }
	}

	/* === Eye Cut-In === */
	.aoa-eye-img {
		width: min(90vw, 900px);
		height: auto;
		aspect-ratio: 2 / 1;
		object-fit: contain;
		animation: eye-zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes eye-zoom-in {
		from { opacity: 0; transform: scale(0.6); filter: brightness(3); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	/* === AOA Art Slam === */
	.aoa-art {
		animation: aoa-slam-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes aoa-slam-in {
		from { opacity: 0; transform: scale(1.4); filter: brightness(2); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.aoa-nameplate {
		position: absolute;
		bottom: 12%;
		left: 50%;
		transform: translateX(-50%);
		height: auto;
		width: min(60vw, 500px);
		animation: nameplate-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
		z-index: 10;
	}
	@keyframes nameplate-slide {
		from { opacity: 0; transform: translateX(-50%) translateY(60px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.aoa-glass-edge {
		background: linear-gradient(
			to bottom,
			rgba(0, 62, 150, 0.6) 0%,
			transparent 15%,
			transparent 85%,
			rgba(0, 34, 90, 0.8) 100%
		);
		z-index: 5;
	}

	/* === Shatter === */
	.aoa-shatter-img {
		animation: shatter-break 0.5s cubic-bezier(0.55, 0, 1, 0.45) both;
		z-index: 2;
	}
	@keyframes shatter-break {
		0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: scale(1); filter: blur(0); }
		15% { clip-path: polygon(2% 1%, 98% 3%, 95% 97%, 1% 99%); }
		30% { clip-path: polygon(5% 2%, 95% 5%, 90% 95%, 3% 93%); filter: blur(0); }
		50% { clip-path: polygon(8% 0, 92% 8%, 85% 92%, 0 90%); filter: blur(0.5px); }
		70% { clip-path: polygon(15% -5%, 105% 10%, 75% 105%, -10% 85%); filter: blur(1px); opacity: 0.6; transform: scale(1.08); }
		100% { clip-path: polygon(30% -20%, 120% 20%, 60% 120%, -30% 70%); filter: blur(3px); opacity: 0; transform: scale(1.2); }
	}

	.aoa-glass-shatter {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 900px);
		height: auto;
		aspect-ratio: 2 / 1;
		object-fit: contain;
		z-index: 3;
		animation: glass-crack 0.5s ease-out forwards;
		pointer-events: none;
	}
	@keyframes glass-crack {
		0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
		20% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
		50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.05); }
		100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
	}

	.aoa-glass-overlay {
		background:
			linear-gradient(135deg, rgba(22,207,251,0.08) 0%, transparent 50%),
			linear-gradient(225deg, rgba(253,119,217,0.06) 0%, transparent 50%);
		z-index: 4;
		animation: glass-fade 0.5s ease-out forwards;
	}
	@keyframes glass-fade {
		from { opacity: 0; }
		30% { opacity: 1; }
		to { opacity: 0; }
	}

	.aoa-skip-hint {
		animation: hint-fade 0.5s ease-out 0.5s both;
	}
	@keyframes hint-fade {
		from { opacity: 0; }
		to { opacity: 0.3; }
	}

	/* ===== CONTENT LAYOUT ===== */
	.about-layout {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		padding: 0.5rem 0;
		min-height: 100%;
	}
	@media (max-width: 767px) {
		.about-layout {
			flex-direction: column;
			gap: 1rem;
		}
	}

	/* === Portrait Column === */
	.about-portrait-col {
		flex-shrink: 0;
		width: 300px;
		position: relative;
		align-items: flex-start;
		animation: content-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
	}
	@media (min-width: 1024px) {
		.about-portrait-col { width: 380px; }
	}
	.about-portrait-inner {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		display: flex;
		align-items: flex-end;
	}
	.about-portrait-img {
		width: 100%;
		height: auto;
		max-height: 65vh;
		object-fit: contain;
		object-position: bottom center;
		position: relative;
		z-index: 2;
		filter: drop-shadow(0 0 30px rgba(22,207,251,0.1));
		animation: portrait-float 4s ease-in-out infinite;
	}
	@keyframes portrait-float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
	.about-portrait-glass {
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, transparent 60%, rgba(0,62,150,0.3) 100%);
		z-index: 3;
		pointer-events: none;
	}
	.about-portrait-shadow {
		position: absolute;
		bottom: 0;
		left: 10%;
		width: 80%;
		height: auto;
		opacity: 0.15;
		z-index: 1;
		pointer-events: none;
	}

	/* === Info Column === */
	.about-info-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		animation: content-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
	}
	@keyframes content-in {
		from { opacity: 0; transform: translateY(15px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* Name plate */
	.about-nameplate-row {
		display: flex;
		align-items: center;
		margin-bottom: 0.25rem;
	}
	.about-nameplate {
		height: 48px;
		width: auto;
		object-fit: contain;
	}
	@media (min-width: 768px) {
		.about-nameplate { height: 60px; }
	}

	/* Headline */
	.about-headline {
		margin-bottom: 0.5rem;
	}
	.about-title {
		font-family: var(--font-new-rodin);
		font-size: 1.5rem;
		color: var(--color-button-1);
		font-weight: 500;
	}
	@media (min-width: 768px) {
		.about-title { font-size: 1.75rem; }
	}
	.about-tagline {
		font-family: var(--font-new-rodin);
		color: var(--color-muted);
		font-style: italic;
		margin-top: 0.25rem;
		font-size: 0.95rem;
	}

	/* Stats row */
	.about-stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	@media (max-width: 767px) {
		.about-stats-row {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.about-stat-card {
		padding: 0.75rem 0.5rem;
		border-radius: 0.5rem;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.about-stat-card:hover {
		border-color: var(--color-pink);
		box-shadow: 0 0 20px rgba(253,119,217,0.1);
	}
	.about-stat-value {
		font-family: var(--font-skip);
		font-size: 1.75rem;
		color: var(--color-pink);
		text-shadow: var(--text-shadow-border);
		line-height: 1;
	}
	.about-stat-label {
		font-family: var(--font-new-rodin);
		font-size: 0.75rem;
		color: var(--color-muted);
		text-align: center;
	}

	/* Social */
	.about-social-row {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}
	.about-social-link {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
		background: rgba(255,255,255,0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	.about-social-link:hover {
		background: rgba(255,255,255,0.15);
		transform: scale(1.1);
		box-shadow: 0 0 15px rgba(253,119,217,0.3);
	}
	.about-social-icon {
		font-size: 1.25rem;
	}

	/* Divider */
	.about-divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(253,119,217,0.3), transparent);
		margin: 0.25rem 0 0.75rem;
	}

	/* === Sub-tab content === */
	:global(.stagger-item) {
		opacity: 0;
		animation: content-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
	}

	/* Bio text */
	.about-bio-text p {
		font-size: 1rem;
		line-height: 1.7;
	}

	/* Bio full */
	.about-bio-paragraph {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-muted);
		white-space: pre-wrap;
	}
	.about-bio-separator {
		text-align: center;
		color: rgba(255,255,255,0.08);
		font-size: 0.875rem;
		margin: 1.5rem 0;
	}
	.about-focus-card {
		padding: 1.25rem;
		border-radius: 0.75rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
	}
	.about-focus-title {
		font-family: var(--font-skip);
		font-size: 1.5rem;
		color: var(--color-pink);
		margin-bottom: 1rem;
		text-shadow: var(--text-shadow-border);
	}
	.about-focus-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.about-focus-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-muted);
		font-family: var(--font-new-rodin);
		font-size: 0.95rem;
	}
	.about-focus-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}
</style>
