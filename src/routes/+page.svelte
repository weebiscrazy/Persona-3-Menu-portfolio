<script lang="ts">
	import Option from "$lib/components/Option.svelte";
	import { fade } from "svelte/transition";
	import type { OptionValue, SubmenuType, ViewState } from "$lib/types";
	import { onMount } from "svelte";
	import { Howl } from "howler";
	import { animate } from "animejs";

	import Control from "$lib/components/Control.svelte";
	import SettingsOption from "$lib/components/SettingsOption.svelte";
	import AboutSubmenu from "$lib/components/AboutSubmenu.svelte";
	import SocialSubmenu from "$lib/components/SocialSubmenu.svelte";
	import FriendsSubmenu from "$lib/components/FriendsSubmenu.svelte";
	import PersonaSubmenu from "$lib/components/PersonaSubmenu.svelte";

	const options: OptionValue[] = [
		{ name: "ABOUT", description: "View Profile & Bio", rotation: -25, zIndex: 1, offsetX: -60, offsetY: 55 },
		{ name: "SOCIAL", description: "Social Links & Contact", rotation: -15, zIndex: 0, offsetX: 0, offsetY: 30 },
		{ name: "FRIENDS", description: "Allies & Testimonials", rotation: -20, zIndex: 1, offsetX: -50, offsetY: 35 },
		{ name: "PERSONA", description: "Hobbies & Fun Facts", rotation: -15, zIndex: 2, offsetX: -80, offsetY: 40 },
		{ name: "SYSTEM", description: "View Settings", rotation: 8, zIndex: 0, offsetX: 0, offsetY: 0 }
	];

	const musicTracks = [
		"Changing Seasons -Reload-.mp3",
		"Color Your Night.mp3",
		"Full Moon Full Life.mp3",
		"It's Going Down Now.mp3",
		"Mass Destruction -Reload-.mp3",
		"When The Moon's Reaching Out Stars -Reload-.mp3",
		"キミの記憶 -Reload-.mp3",
		"全ての人の魂の戦い.mp3",
		"巌戸台分寮 -Reload-.mp3"
	];

	let backgroundVideo: HTMLVideoElement;
	let isStarted = $state(false);
	let isMusicEnabled = $state(true);
	let isSFXEnabled = $state(true);
	let selectedIndex = $state(0);
	let currentOptionElement = $state<HTMLButtonElement>();
	let settingsOptionElement = $state<HTMLDivElement>();
	let currentSettingIndex = $state(0);
	let isMobile = $state(typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);

	// Submenu state
	let currentView = $state<ViewState>("main");
	let activeSubmenu = $state<SubmenuType | null>(null);
	let submenuTabIndex = $state(0);

	const navigationSound = new Howl({
		src: ["/sfx/navigation.wav"],
		volume: 0.5,
	});

	const selectSound = new Howl({
		src: ["/sfx/navigation.wav"],
		volume: 0.6,
	});

	function setIndex(index: number) {
		if (index === selectedIndex) return;
		selectedIndex = index;
		currentOptionElement = document.getElementById(`option-${index}`) as HTMLButtonElement;
		playSound();
	}

	function setSettingsIndex(index: number) {
		if (index === currentSettingIndex) return;
		currentSettingIndex = index;
		animate(settingsOptionElement!, {
			translateY: index * 56,
			duration: 100,
			easing: "easeOutQuad"
		});
	}

	function playSound() {
		if (isSFXEnabled) {
			navigationSound.play();
		}
	}

	function playSelectSound() {
		if (isSFXEnabled) {
			selectSound.play();
		}
	}

	function openSubmenu(type: SubmenuType) {
		activeSubmenu = type;
		currentView = "submenu";
		submenuTabIndex = 0;
		playSelectSound();
		setTimeout(() => {
			const submenu = document.querySelector('[role="dialog"]') as HTMLElement;
			submenu?.focus();
		}, 50);
	}

	function closeSubmenu() {
		activeSubmenu = null;
		currentView = "main";
		playSound();
		setTimeout(() => {
			currentOptionElement?.focus();
		}, 50);
	}

	if (typeof window !== "undefined") {
		(window as any).closeSubmenu = closeSubmenu;
	}

	function start() {
		isStarted = true;
		backgroundVideo.play();

		if (isMusicEnabled) {
			const randomIndex = Math.floor(Math.random() * musicTracks.length);
			new Howl({
				src: `/music/${musicTracks[randomIndex]}`,
				loop: true,
				autoplay: true,
				volume: 0.5,
			});
		}
	}

	function handleMainKeydown(e: KeyboardEvent) {
		if (!isStarted || currentView === "submenu") return;

		if (e.key === "ArrowDown" || e.key === "s") {
			setIndex((selectedIndex + 1) % options.length);
		} else if (e.key === "ArrowUp" || e.key === "w") {
			setIndex((selectedIndex - 1 + options.length) % options.length);
		} else if (e.key === "Enter" || e.key === " " || e.key === "b" || e.key === "B") {
			e.preventDefault();
			const selectedOption = options[selectedIndex].name;
			if (selectedOption === "SYSTEM") {
				setSettingsIndex(0);
			} else {
				openSubmenu(selectedOption.toLowerCase() as SubmenuType);
			}
		} else if (e.key === "Escape" || e.key === "a" || e.key === "A") {
		}
	}

	function handleOptionSelect(index: number) {
		if (isMobile) return;
		setIndex(index);
	}

	function handleOptionConfirm(index: number) {
		const option = options[index].name;
		if (option === "SYSTEM") {
			setSettingsIndex(0);
		} else {
			openSubmenu(option.toLowerCase() as SubmenuType);
		}
	}

	onMount(() => {
		setIndex(0);
		document.addEventListener("keydown", handleMainKeydown);

		const mq = window.matchMedia("(max-width: 767px)");
		mq.addEventListener("change", (e) => { isMobile = e.matches; });
	});
</script>

<main class="h-screen w-screen relative overflow-hidden">
	{#if !isStarted}
		<div class="fixed bg-bg/90 size-full flex flex-col gap-16 md:gap-32 justify-center items-center z-20 px-4" transition:fade>
			<div class="rotate-3 space-y-2 w-full max-w-lg md:max-w-none">
				<h1 class="bg-fg text-bg px-4 md:px-6 py-3 md:py-4 rounded-md text-3xl md:text-6xl tracking-[-0.08em] text-center md:text-left">
					PERSONA 3 RELOAD<br>
					PAUSE MENU
				</h1>
				<h2 class="flex items-center w-full gap-2 italic text-base md:text-xl font-new-rodin text-shadow-under">
					<span class="whitespace-nowrap">
						Recreated with Svelte
					</span>
					<hr class="border border-fg grow shadow-under">
					<a href="https://deltea.space" class="whitespace-nowrap">
						By ayush
					</a>
				</h2>
				{#if isMobile}
					<p class="text-xs md:hidden text-muted italic text-center mt-4 opacity-60">
						Recommended to be viewed on desktop — site may not work as intended on mobile
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-2 relative">
				<SettingsOption onSelect={() => setSettingsIndex(0)} isSelected={currentSettingIndex === 0} bind:value={isMusicEnabled}>
					Toggle Music
				</SettingsOption>
				<SettingsOption onSelect={() => setSettingsIndex(1)} isSelected={currentSettingIndex === 1} bind:value={isSFXEnabled}>
					Toggle SFX
				</SettingsOption>

				<div
					bind:this={settingsOptionElement}
					class="w-[32rem] h-12 bg-red -z-1 absolute -top-2 -right-1 rounded-md"
				></div>
			</div>

			<button onclick={start} class="text-4xl md:text-6xl flex gap-4">
				<span class="tracking-[-0.05em]">ENTER</span>
				<iconify-icon icon="mdi:arrow-right-bold" class="text-4xl md:text-6xl"></iconify-icon>
			</button>
		</div>
	{/if}

	<!-- background -->
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={backgroundVideo}
		loop
		src="/background.mp4"
		class="fixed h-full w-full object-cover object-left -z-10"
	></video>
	<!-- mobile dark overlay -->
	<div class="fixed inset-0 bg-black/40 md:bg-transparent -z-10 pointer-events-none"></div>

	<!-- Submenu Overlay -->
	{#if currentView === "submenu" && activeSubmenu}
		{#if activeSubmenu === "about"}
			<AboutSubmenu />
		{:else if activeSubmenu === "social"}
			<SocialSubmenu />
		{:else if activeSubmenu === "friends"}
			<FriendsSubmenu />
		{:else if activeSubmenu === "persona"}
			<PersonaSubmenu />
		{/if}
	{/if}

	<!-- Main Menu Options -->
	<div class="flex flex-col justify-center h-full relative md:transition-all md:duration-500
	            md:left-[42rem] 3xl:left-[55rem]
	            md:-space-y-32 -space-y-8
	            md:items-start items-center
	            w-full md:w-auto px-4 md:px-0">
		{#each options as option, i}
			<Option
				index={i}
				isSelected={!isMobile && selectedIndex === i}
				onSelect={() => handleOptionSelect(i)}
				onConfirm={() => handleOptionConfirm(i)}
				isMobile={isMobile}
				{option}
			/>
		{/each}
	</div>

	<!-- controls -->
	<div class="fixed md:absolute bottom-0 right-0 font-new-rodin flex flex-col items-start z-10 transition-opacity duration-300" style:opacity={currentView === "submenu" ? 0 : 1}>
		<p class="italic text-3xl pr-20 text-shadow-under hidden md:block">
			{currentView === "main" ? options[selectedIndex].description : "Press B to return"}
		</p>

		<div class="flex items-center w-full gap-1 hidden md:flex">
			<span class="text-shadow-under">Command</span>
			<hr class="border border-fg grow shadow-under">
		</div>

		<!-- controls -->
		<div class="flex gap-4 items-center justify-end w-full pr-4 md:pr-20 mt-4 mb-6 text-shadow-under">
			{#if currentView === "main"}
				{#if isMobile}
					<Control key="Tap">Select</Control>
				{:else}
					<Control key="B">Select</Control>
					<Control key="A">Settings</Control>
					<Control key="↑ ↓">Navigate</Control>
				{/if}
			{/if}
		</div>
	</div>

	<!-- side text -->
	<div class="hidden md:block absolute rotate-90 tracking-[-0.2em] text-muted italic" style="left: -4.5rem; top: -18rem; font-size: 37vh;">
		<span class="z-1">{currentView === "main" ? `0${selectedIndex + 1}` : "##"}</span>
	</div>
</main>