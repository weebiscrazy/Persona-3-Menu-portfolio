<script lang="ts">
	import Submenu from "./Submenu.svelte";
	import { profileData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);

	const tabs = [
		{ name: "Profile", index: 0, arcanaNumber: "0" },
		{ name: "Stats", index: 1, arcanaNumber: "XI" },
		{ name: "Bio", index: 2, arcanaNumber: "IX" }
	];
</script>

<Submenu title="ABOUT" {tabs} onBack={() => (window as any).closeSubmenu?.()} bind:activeTab tarotCards={["/arcana/fool.png", "/arcana/strength.png", "/arcana/hermit.png"]}>
	{#snippet children(currentTab)}
		{#if currentTab === 0}
			<div class="flex flex-col items-center gap-8 max-w-2xl mx-auto text-center">
				<div class="stagger-item" style="animation-delay: 0.08s">
					<div class="size-48 rounded-full bg-gradient-to-br from-pink to-button-1 flex items-center justify-center overflow-hidden border-4 border-fg/20 shadow-[0_0_40px_rgba(253,119,217,0.3)]">
						{#if profileData.avatar}
							<img src={profileData.avatar} alt={profileData.name} class="size-full object-cover" />
						{:else}
							<span class="font-skip text-6xl text-bg">AY</span>
						{/if}
					</div>
					<div class="absolute -bottom-4 -right-4 size-12 rounded-full bg-button-1 border-4 border-bg flex items-center justify-center animate-pulse">
						<iconify-icon icon="mdi:check-circle" class="text-2xl text-bg"></iconify-icon>
					</div>
				</div>
				<div class="flex flex-col gap-2 stagger-item" style="animation-delay: 0.14s">
					<h2 class="font-skip text-4xl tracking-tight" style="text-shadow: var(--text-shadow-border)">{profileData.name}</h2>
					<p class="text-button-1 font-new-rodin text-xl italic">{profileData.title}</p>
					<p class="text-muted font-new-rodin italic max-w-md mt-2">"{profileData.tagline}"</p>
				</div>
				<div class="text-fg/10 font-skip text-xl tracking-[0.5em] stagger-item" style="animation-delay: 0.17s">✦ ✦ ✦</div>
				<div class="flex gap-4 mt-2 stagger-item" style="animation-delay: 0.2s">
					{#each profileData.socialLinks as link}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="size-12 rounded-full bg-fg/10 hover:bg-fg/20 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(253,119,217,0.4)]"
							style="color: {link.color}"
							aria-label={link.platform}
						>
							<iconify-icon icon={link.icon} class="text-2xl"></iconify-icon>
						</a>
					{/each}
				</div>
			</div>
		{:else if currentTab === 1}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
				{#each profileData.stats as stat, i}
					<div
						class={cn(
							"stagger-item relative p-8 rounded-xl bg-fg/5 border border-fg/10 hover:border-pink/50 transition-all duration-300",
							"hover:shadow-[0_0_30px_rgba(253,119,217,0.15)]"
						)}
						style="animation-delay: {0.08 + i * 0.06}s"
					>
						<div class="relative z-10 flex flex-col items-center gap-2">
							<span class="font-skip text-5xl text-pink" style="text-shadow: var(--text-shadow-border)">{stat.value}</span>
							<span class="font-new-rodin text-muted text-lg">{stat.label}</span>
						</div>
						<iconify-icon
							class="absolute top-4 right-4 text-3xl opacity-20 hover:opacity-100 transition-opacity"
							icon="mdi:chart-line"
							style="color: var(--color-pink)"
						></iconify-icon>
					</div>
				{/each}
			</div>
		{:else}
			<div class="max-w-2xl mx-auto">
				<p class="text-lg leading-relaxed text-muted whitespace-pre-wrap font-new-rodin italic stagger-item" style="animation-delay: 0.08s">{profileData.bio}</p>
				<div class="text-fg/10 font-skip text-xl tracking-[0.5em] mt-8 mb-2 text-center stagger-item" style="animation-delay: 0.1s">━━━</div>
				<div class="mt-6 p-6 rounded-xl bg-fg/5 border border-fg/10 stagger-item" style="animation-delay: 0.14s">
					<h3 class="font-skip text-2xl mb-4 text-pink" style="text-shadow: var(--text-shadow-border)">Current Focus</h3>
					<ul class="space-y-3 text-muted font-new-rodin">
						<li class="flex items-center gap-3">
							<iconify-icon icon="mdi:rocket-launch" class="text-pink shrink-0"></iconify-icon>
							Building portfolio sites with game-inspired UX
						</li>
						<li class="flex items-center gap-3">
							<iconify-icon icon="mdi:code-braces" class="text-button-1 shrink-0"></iconify-icon>
							Learning Rust for systems programming
						</li>
						<li class="flex items-center gap-3">
							<iconify-icon icon="mdi:gamepad-variant" class="text-button-2 shrink-0"></iconify-icon>
							Experimenting with Godot 4 for game jams
						</li>
					</ul>
				</div>
			</div>
		{/if}
	{/snippet}
</Submenu>

<style>
	@keyframes content-in {
		from { opacity: 0; transform: translateY(15px); }
		to { opacity: 1; transform: translateY(0); }
	}

	:global(.stagger-item) {
		opacity: 0;
		animation: content-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s both;
	}
</style>