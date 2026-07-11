<script lang="ts">
	import { onMount } from "svelte";
	import Control from "./Control.svelte";
	import { profileData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);
	let phase = $state<"cover" | "eye" | "aoa" | "content">("cover");
	let closing = $state(false);
	let showNameplate = $state(false);

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
		const preloadSrcs = [
			"/T_UI_Camp_Status_Character_Glass_0001.png",
			"/T_Btl_AlloutFinish_Pc01_A1out.png",
			"/T_Btl_AlloutFinishText_Pc01out.png",
			"/T_UI_Camp_Status_Character_0001.png"
		];
		let loaded = 0;
		const onLoad = () => {
			loaded++;
			if (loaded === preloadSrcs.length) startSequence();
		};
		preloadSrcs.forEach(src => {
			const img = new Image();
			img.onload = onLoad;
			img.onerror = onLoad;
			img.src = src;
		});
		setTimeout(() => { if (phase === "cover") startSequence(); }, 2500);

		function startSequence() {
			if (phase !== "cover") return;
			phase = "eye";

			// 900ms eye → aoa
			setTimeout(() => {
				if (phase === "content") return;
				phase = "aoa";
				showNameplate = false;

				// 400ms later: nameplate
				setTimeout(() => {
					if (phase === "content") return;
					showNameplate = true;
				}, 400);
			}, 900);

			// 2500ms aoa → content
			setTimeout(() => {
				if (phase === "content") return;
				phase = "content";
			}, 2500);
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="about-root fixed inset-0 z-50"
	role="dialog"
	aria-label="About"
	onkeydown={handleKeydown}
	tabindex="-1"
	class:about-closing={closing}
>
	<!-- ===== AOA ART BG — ALWAYS MOUNTED from start ===== -->
	<!-- Hidden during cover/eye, visible during aoa/content -->
	<div
		class="absolute inset-0 transition-all duration-500 ease-out"
		class:aoa-bg-visible={phase === "aoa" || phase === "content"}
		class:aoa-bg-hidden={phase === "cover" || phase === "eye"}
		style="background: {AOA_BG};"
	>
		<img
			src="/T_Btl_AlloutFinish_Pc01_A1out.png"
			alt=""
			class="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
			class:aoa-img-active={phase === "aoa"}
			class:aoa-img-content={phase === "content"}
		/>
		<div
			class="absolute inset-0 transition-all duration-700 ease-out"
			class:aoa-vignette-content={phase === "content"}
		></div>

		<!-- Water ripple effect (always visible when AOA bg is) -->
		<div class="absolute inset-0 opacity-20 aoa-water-ripple"></div>
	</div>

	<!-- ===== COVER ===== -->
	{#if phase === "cover"}
		<div class="absolute inset-0 z-30" style="background: {AOA_BG};"></div>

	<!-- ===== EYE ===== -->
	{:else if phase === "eye"}
		<div class="absolute inset-0 z-20 aoa-dim-overlay"></div>
		<div class="absolute inset-0 z-30 flex items-center justify-center aoa-eye-wrap">
			<div class="aoa-eye-frame">
				<img
					src="/T_UI_Camp_Status_Character_Glass_0001.png"
					alt="eye cut-in"
					class="aoa-eye-img"
				/>
				<div class="aoa-eye-border"></div>
				<div class="aoa-eye-corner aoa-corner-tl"></div>
				<div class="aoa-eye-corner aoa-corner-tr"></div>
				<div class="aoa-eye-corner aoa-corner-bl"></div>
				<div class="aoa-eye-corner aoa-corner-br"></div>
				<span class="aoa-exclamation aoa-ex-left">!!</span>
				<span class="aoa-exclamation aoa-ex-right">!!</span>
				<div class="aoa-impact-lines"></div>
			</div>
		</div>

	<!-- ===== AOA (nameplate overlays on AOA art bg) ===== -->
	{:else if phase === "aoa"}
		<img
			src="/T_Btl_AlloutFinishText_Pc01out.png"
			alt=""
			class="aoa-nameplate z-20"
			class:aoa-nameplate-visible={showNameplate}
		/>

	<!-- ===== CONTENT ===== -->
	{:else}
		<div class="relative z-20 h-full flex flex-col about-content-panel">
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

			<div class="flex-1 flex flex-col md:flex-row gap-6 about-body">
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

				<div class="about-info-side">
					<img src="/T_Btl_AlloutFinishText_Pc01out.png" alt="" class="about-info-nameplate" />

					<div>
						<h2 class="about-info-title">{profileData.title}</h2>
						<p class="about-info-tagline">"{profileData.tagline}"</p>
					</div>

					<div class="about-stats-grid">
						{#each profileData.stats as stat}
							<div class="about-stat-item">
								<span class="about-stat-val">{stat.value}</span>
								<span class="about-stat-lbl">{stat.label}</span>
							</div>
						{/each}
					</div>

					<div class="about-social-row">
						{#each profileData.socialLinks as link}
							<a href={link.url} target="_blank" rel="noopener noreferrer" class="about-social-link" style="color: {link.color}" aria-label={link.platform}>
								<iconify-icon icon={link.icon} class="about-social-icon"></iconify-icon>
							</a>
						{/each}
					</div>

					<div class="about-content-divider"></div>

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
</div>

<style>
	.about-root { background: transparent; outline: none; }
	.about-closing { animation: about-fade-out 0.35s ease-in forwards; }
	@keyframes about-fade-out { from { opacity: 1; } to { opacity: 0; } }

	/* ===== PERSISTENT AOA BG ===== */
	.aoa-bg-hidden { opacity: 0; pointer-events: none; }
	.aoa-bg-visible { opacity: 1; z-index: 1; }

	.aoa-bg-visible .aoa-water-ripple {
		background:
			radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.04) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.03) 0%, transparent 40%);
		animation: water-drift 6s ease-in-out infinite alternate;
	}
	@keyframes water-drift {
		0% { transform: translateX(-2%) translateY(-1%) scale(1); }
		100% { transform: translateX(2%) translateY(1%) scale(1.02); }
	}

	.aoa-persistent-img {
		object-fit: cover;
		object-position: center 30%;
	}

	.aoa-img-active {
		opacity: 1;
		filter: brightness(1);
		animation: aoa-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes aoa-slam {
		from { opacity: 0; transform: scale(1.3); filter: brightness(1.8); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.aoa-img-content {
		opacity: 0.35;
		filter: blur(3px) brightness(0.55);
	}

	.aoa-bg-visible .aoa-persistent-vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%);
	}
	.aoa-vignette-content {
		background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.4) 100%) !important;
	}

	/* ===== COVER ===== */

	/* ===== EYE ===== */
	.aoa-dim-overlay {
		background: rgba(0,34,90,0.65);
		animation: dim-in 0.4s ease-out forwards;
	}
	@keyframes dim-in { from { opacity: 0; } to { opacity: 1; } }

	.aoa-eye-wrap {
		animation: eye-drop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes eye-drop {
		from { transform: translateY(-100vh); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
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
		width: 100%;
		height: 100%;
		object-fit: contain;
		position: relative;
		z-index: 2;
		animation: eye-zoom 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		filter: drop-shadow(0 0 40px rgba(21,194,252,0.3));
	}
	@keyframes eye-zoom {
		from { opacity: 0; transform: scale(0.7); filter: brightness(2); }
		to { opacity: 1; transform: scale(1); filter: brightness(1); }
	}

	.aoa-eye-border {
		position: absolute; inset: -8px; z-index: 3; pointer-events: none;
		border: 2px solid rgba(21,194,252,0.5);
		clip-path: polygon(0% 5%, 3% 0%, 97% 2%, 100% 4%, 100% 96%, 96% 100%, 4% 98%, 0% 95%);
		animation: border-flick 0.6s ease-out forwards;
	}
	@keyframes border-flick {
		0% { border-color: rgba(255,255,255,0.9); opacity: 0; }
		30% { border-color: rgba(21,194,252,0.8); opacity: 1; }
		60% { border-color: rgba(255,255,255,0.6); }
		100% { border-color: rgba(21,194,252,0.3); opacity: 0.8; }
	}

	.aoa-eye-corner {
		position: absolute; width: 28px; height: 28px; z-index: 4; pointer-events: none;
		border-color: #15c2fc; opacity: 0.8;
	}
	.aoa-corner-tl { top: -14px; left: -14px; border-top: 3px solid; border-left: 3px solid; }
	.aoa-corner-tr { top: -14px; right: -14px; border-top: 3px solid; border-right: 3px solid; }
	.aoa-corner-bl { bottom: -14px; left: -14px; border-bottom: 3px solid; border-left: 3px solid; }
	.aoa-corner-br { bottom: -14px; right: -14px; border-bottom: 3px solid; border-right: 3px solid; }

	.aoa-exclamation {
		position: absolute; font-family: var(--font-skip); font-size: 2.5rem;
		color: #fff; z-index: 5; pointer-events: none; line-height: 1;
		text-shadow: 0 0 20px rgba(21,194,252,0.8), 0 0 40px rgba(21,194,252,0.4);
		animation: ex-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
	}
	.aoa-ex-left { top: -16px; left: 12%; }
	.aoa-ex-right { bottom: -16px; right: 12%; }
	@keyframes ex-pop {
		from { opacity: 0; transform: scale(0.3) rotate(-10deg); }
		to { opacity: 1; transform: scale(1) rotate(0deg); }
	}

	.aoa-impact-lines {
		position: absolute; inset: -30px; z-index: 1; pointer-events: none; opacity: 0;
		background:
			linear-gradient(90deg, transparent 39%, rgba(255,255,255,0.06) 40%, transparent 41%) 0 0 / 100% 100%,
			linear-gradient(0deg, transparent 39%, rgba(255,255,255,0.06) 40%, transparent 41%) 0 0 / 100% 100%,
			linear-gradient(45deg, transparent 39%, rgba(255,255,255,0.04) 40%, transparent 41%) 0 0 / 100% 100%,
			linear-gradient(135deg, transparent 39%, rgba(255,255,255,0.04) 40%, transparent 41%) 0 0 / 100% 100%;
		mask-image: radial-gradient(ellipse at center, black 25%, transparent 60%);
		-webkit-mask-image: radial-gradient(ellipse at center, black 25%, transparent 60%);
		animation: impact-in 0.2s ease-out 0.05s both;
	}
	@keyframes impact-in { from { opacity: 0; } to { opacity: 0.5; } }

	/* ===== AOA NAMEPLATE ===== */
	.aoa-nameplate {
		position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
		width: min(55vw, 450px); height: auto;
		opacity: 0; transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
	}
	.aoa-nameplate-visible { opacity: 1; }

	/* ===== CONTENT PANEL ===== */
	.about-content-panel {
		padding: 1rem;
		max-width: 1320px;
		margin: 0 auto;
		width: 100%;
		animation: panel-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes panel-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

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
		backdrop-filter: blur(8px); box-shadow: 0 0 20px rgba(21,194,252,0.2);
	}
	.about-tab-inactive { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); }
	.about-tab-inactive:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); }

	.about-body { flex: 1; min-height: 0; padding: 0.5rem 0; gap: 1.5rem; }

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

	.about-info-side {
		flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.5rem;
		padding: 0.75rem 1rem; border-radius: 0.75rem;
		background: rgba(0,0,0,0.25); backdrop-filter: blur(8px);
		border: 1px solid rgba(255,255,255,0.06);
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

	.about-social-row { display: flex; gap: 0.4rem; }
	.about-social-link {
		width: 2rem; height: 2rem; border-radius: 9999px;
		background: rgba(255,255,255,0.06); display: flex;
		align-items: center; justify-content: center; transition: all 0.2s;
	}
	.about-social-link:hover { background: rgba(255,255,255,0.12); transform: scale(1.1); }
	.about-social-icon { font-size: 1rem; }

	.about-content-divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(21,194,252,0.15), transparent);
		margin: 0.1rem 0 0.35rem;
	}

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

	.about-footer {
		display: flex; align-items: center; justify-content: center;
		gap: 1.5rem; padding: 0.5rem 0; flex-shrink: 0;
	}
</style>
