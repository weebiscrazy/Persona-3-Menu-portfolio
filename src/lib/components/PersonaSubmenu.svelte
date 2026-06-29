<script lang="ts">
	import Submenu from "./Submenu.svelte";
	import { personaData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);

	const tabs = [
		{ name: "Hobbies", index: 0, arcanaNumber: "I" },
		{ name: "Fun Facts", index: 1, arcanaNumber: "XVIII" }
	];

	function stars(n: number): string {
		return "★".repeat(Math.min(n, 5)) + "☆".repeat(Math.max(0, 5 - Math.min(n, 5)));
	}
</script>

<Submenu title="PERSONA" {tabs} onBack={() => (window as any).closeSubmenu?.()} bind:activeTab tarotCards={["/arcana/magician.png", "/arcana/moon.png"]}>
	{#snippet children(currentTab)}
		{#if currentTab === 0}
			<div class="max-w-5xl mx-auto space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each personaData as persona, i}
						<div
							class={cn(
								"stagger-item relative p-6 rounded-2xl bg-fg/5 border border-fg/10",
								"hover:border-pink/50 hover:bg-fg/10 hover:shadow-[0_0_30px_rgba(253,119,217,0.1)]",
								"transition-all duration-300 group"
							)}
							style="animation-delay: {0.08 + i * 0.07}s"
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
			<div class="max-w-2xl mx-auto space-y-6">
				{#each personaData as persona, i}
					<div
						class={cn(
							"stagger-item relative p-6 rounded-2xl bg-fg/5 border border-fg/10",
							"hover:border-pink/50 hover:bg-fg/10 hover:shadow-[0_0_20px_rgba(253,119,217,0.08)]",
							"transition-all duration-300"
						)}
						style="animation-delay: {0.08 + i * 0.07}s"
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

				<div class="mt-12 p-6 rounded-2xl bg-gradient-to-r from-pink/10 to-button-1/10 border border-fg/10 stagger-item">
					<h4 class="font-skip text-xl mb-4 text-center text-pink" style="text-shadow: var(--text-shadow-border)">Current Build</h4>
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
							<p class="font-skip text-3xl text-pink" style="text-shadow: var(--text-shadow-border)">Tailwind 4</p>
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
	{/snippet}
</Submenu>