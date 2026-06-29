<script lang="ts">
	import Submenu from "./Submenu.svelte";
	import { profileData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let activeTab = $state(0);

	const tabs = [
		{ name: "Links", index: 0, arcanaNumber: "VI" },
		{ name: "Connect", index: 1, arcanaNumber: "XVII" }
	];

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<Submenu title="SOCIAL" {tabs} onBack={() => (window as any).closeSubmenu?.()} bind:activeTab tarotCards={["/arcana/lovers.png", "/arcana/star.png"]}>
	{#snippet children(currentTab)}
		{#if currentTab === 0}
			<div class="max-w-2xl mx-auto space-y-4">
				{#each profileData.socialLinks as link, i}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						class={cn(
							"stagger-item group flex items-center gap-6 p-6 rounded-xl bg-fg/5 border border-fg/10",
							"hover:border-pink/50 hover:bg-fg/10 hover:shadow-[0_0_30px_rgba(253,119,217,0.1)]",
							"transition-all duration-300",
							"focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-bg"
						)}
						style="animation-delay: {0.08 + i * 0.07}s"
					>
						<div class="size-14 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden" style="background: {link.color}">
							<iconify-icon icon={link.icon} class="text-2xl text-bg"></iconify-icon>
							<div class="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-skip text-xl text-fg group-hover:text-pink transition-colors" style="text-shadow: var(--text-shadow-border)">{link.platform}</p>
							<p class="text-muted text-sm truncate font-new-rodin">{link.url}</p>
						</div>
						<iconify-icon icon="mdi:open-in-new" class="text-muted group-hover:text-pink transition-colors text-2xl shrink-0"></iconify-icon>
					</a>
				{/each}
			</div>
		{:else}
			<div class="max-w-xl mx-auto space-y-8">
				<div class="text-center stagger-item" style="animation-delay: 0.08s">
					<h3 class="font-skip text-3xl mb-4" style="text-shadow: var(--text-shadow-border)">Get In Touch</h3>
					<p class="text-muted font-new-rodin italic">Always open to interesting projects, collaborations, or just chatting about Persona.</p>
				</div>

				<div class="text-fg/10 font-skip text-xl tracking-[0.5em] text-center stagger-item" style="animation-delay: 0.11s">✦ ✦ ✦</div>

				<div class="p-8 rounded-xl bg-gradient-to-r from-pink/10 to-button-1/10 border border-fg/10 stagger-item" style="animation-delay: 0.14s">
					<div class="flex items-center gap-4 mb-4">
						<div class="size-14 rounded-xl bg-button-1 flex items-center justify-center">
							<iconify-icon icon="mdi:email" class="text-2xl text-bg"></iconify-icon>
						</div>
						<div>
							<p class="font-skip text-xl" style="text-shadow: var(--text-shadow-border)">Direct Email</p>
							<p class="text-muted font-new-rodin text-sm">Best for project inquiries</p>
						</div>
					</div>
					<button
						onclick={() => copyToClipboard(profileData.socialLinks[3].url.replace('mailto:', ''))}
						class="w-full py-3 px-6 rounded-lg bg-fg/10 hover:bg-fg/20 font-new-rodin text-lg transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(253,119,217,0.15)]"
					>
						<span>{profileData.socialLinks[3].url.replace('mailto:', '')}</span>
						<iconify-icon icon="mdi:content-copy" class="text-xl"></iconify-icon>
					</button>
				</div>

				<div class="p-6 rounded-xl bg-fg/5 border border-fg/10 stagger-item" style="animation-delay: 0.18s">
					<h4 class="font-skip text-xl mb-4 text-pink" style="text-shadow: var(--text-shadow-border)">Availability</h4>
					<div class="grid grid-cols-2 gap-4 text-center">
						<div class="p-4 rounded-lg bg-fg/5">
							<p class="font-skip text-3xl text-button-1" style="text-shadow: var(--text-shadow-border)">Open</p>
							<p class="text-muted text-sm font-new-rodin">Freelance Projects</p>
						</div>
						<div class="p-4 rounded-lg bg-fg/5">
							<p class="font-skip text-3xl text-button-1" style="text-shadow: var(--text-shadow-border)">Open</p>
							<p class="text-muted text-sm font-new-rodin">Collaborations</p>
						</div>
						<div class="p-4 rounded-lg bg-fg/5">
							<p class="font-skip text-3xl text-pink" style="text-shadow: var(--text-shadow-border)">Closed</p>
							<p class="text-muted text-sm font-new-rodin">Full-time Roles</p>
						</div>
						<div class="p-4 rounded-lg bg-fg/5">
							<p class="font-skip text-3xl text-button-2" style="text-shadow: var(--text-shadow-border)">Always</p>
							<p class="text-muted text-sm font-new-rodin">Persona Talk</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</Submenu>