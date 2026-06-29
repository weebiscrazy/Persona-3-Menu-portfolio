<script lang="ts">
	import Submenu from "./Submenu.svelte";
	import { friendsData } from "$lib/portfolio";
	import { cn } from "$lib/utils";

	let currentSlide = $state(0);
	let activeTab = $state(0);
	const slidesPerView = 2;

	const tabs = [
		{ name: "Allies", index: 0, arcanaNumber: "VII" },
		{ name: "Testimonials", index: 1, arcanaNumber: "XIX" }
	];

	function nextSlide() {
		const maxSlide = Math.max(0, friendsData.length - slidesPerView);
		currentSlide = currentSlide < maxSlide ? currentSlide + 1 : 0;
	}

	function prevSlide() {
		const maxSlide = Math.max(0, friendsData.length - slidesPerView);
		currentSlide = currentSlide > 0 ? currentSlide - 1 : maxSlide;
	}
</script>

<Submenu title="FRIENDS" {tabs} onBack={() => (window as any).closeSubmenu?.()} bind:activeTab tarotCards={["/arcana/chariot.png", "/arcana/sun.png"]}>
	{#snippet children(currentTab)}
		{#if currentTab === 0}
			<div class="max-w-5xl mx-auto">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{#each friendsData as friend, i}
						<div
							class={cn(
								"stagger-item relative p-6 rounded-2xl bg-fg/5 border border-fg/10",
								"hover:border-pink/50 hover:bg-fg/10 hover:shadow-[0_0_30px_rgba(253,119,217,0.1)]",
								"transition-all duration-300 group"
							)}
							style="animation-delay: {0.08 + i * 0.08}s"
						>
							<div class="relative mb-4">
								<div class="size-20 rounded-xl bg-gradient-to-br from-pink/20 to-button-1/20 flex items-center justify-center overflow-hidden border-2 border-fg/10 group-hover:border-pink/50 transition-colors">
									{#if friend.avatar}
										<img src={friend.avatar} alt={friend.name} class="size-full object-cover" />
									{:else}
										<span class="font-skip text-3xl text-pink">{friend.name.charAt(0)}</span>
									{/if}
								</div>
								<div class="absolute -bottom-2 -right-2 size-8 rounded-full bg-button-1 border-2 border-bg flex items-center justify-center">
									<iconify-icon icon="mdi:account-check" class="text-xl text-bg"></iconify-icon>
								</div>
							</div>
							<div class="mb-3">
								<h4 class="font-skip text-xl text-fg" style="text-shadow: var(--text-shadow-border)">{friend.name}</h4>
								<p class="text-button-1 text-sm font-new-rodin">{friend.role}</p>
							</div>
							<p class="text-muted text-sm mb-4 italic font-new-rodin">"{friend.quote}"</p>
							{#if friend.url}
								<a
									href={friend.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 text-sm font-new-rodin text-pink hover:text-button-1 transition-colors"
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
									<div class="h-full p-8 rounded-2xl bg-fg/5 border border-fg/10 hover:border-pink/30 transition-all">
										<div class="flex items-center gap-4 mb-6">
											<div class="size-16 rounded-xl bg-gradient-to-br from-pink/20 to-button-1/20 flex items-center justify-center overflow-hidden border-2 border-fg/10">
												{#if friend.avatar}
													<img src={friend.avatar} alt={friend.name} class="size-full object-cover" />
												{:else}
													<span class="font-skip text-2xl text-pink">{friend.name.charAt(0)}</span>
												{/if}
											</div>
											<div>
												<h4 class="font-skip text-xl text-fg" style="text-shadow: var(--text-shadow-border)">{friend.name}</h4>
												<p class="text-button-1 text-sm font-new-rodin">{friend.role}</p>
											</div>
										</div>
										<div class="relative">
											<span class="block font-skip text-6xl text-pink/20 leading-none absolute -top-2 -left-2">"</span>
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
							class="size-12 rounded-full bg-fg/10 hover:bg-fg/20 hover:border-pink/50 border border-fg/20 flex items-center justify-center transition-all"
							aria-label="Previous testimonial"
						>
							<iconify-icon icon="mdi:chevron-left" class="text-2xl"></iconify-icon>
						</button>
						<div class="flex gap-2 items-center">
							{#each friendsData as _, i}
								<button
									class={cn(
										"size-2 rounded-full transition-all duration-200",
										i === currentSlide ? "bg-pink w-6" : "bg-fg/30 hover:bg-fg/50"
									)}
									onclick={() => currentSlide = i}
									aria-label="Go to testimonial"
								></button>
							{/each}
						</div>
						<button
							onclick={nextSlide}
							class="size-12 rounded-full bg-fg/10 hover:bg-fg/20 hover:border-pink/50 border border-fg/20 flex items-center justify-center transition-all"
							aria-label="Next testimonial"
						>
							<iconify-icon icon="mdi:chevron-right" class="text-2xl"></iconify-icon>
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</Submenu>