<script lang="ts">
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import { animate, createTimeline, spring, utils } from "animejs";
  import type { OptionValue } from "$lib/types";

  const colors = [
    "fill-button-1",
    "fill-button-2",
    "fill-button-3"
  ];

  let element: SVGElement = $state()!;
  let textElement: SVGTextElement = $state()!;
  let textRedElement: SVGTextElement = $state()!;
  let backgroundElement: SVGPathElement = $state()!;
  let backgroundMaskElement: SVGPathElement = $state()!;

  let { index, isSelected, onSelect, onConfirm, option, isMobile = false }: {
    index: number,
    isSelected: boolean,
    onSelect: () => void
    onConfirm?: () => void
    option: OptionValue
    isMobile?: boolean
  } = $props();

  function handleTouch(e: TouchEvent) {
    e.preventDefault();
    onConfirm?.();
  }

  const selectorPath = "M 24.853754, 93.31573 135.14625, 49.684266 114.14751, 97.331142 Z";
  const selectorBackgroundPath = "M 12.7428765,95.50088 144.25712,47.499123 116.75625,95.465764 Z";
  const selectorMaskId = $derived(`selector-mask-${index}`);
  const selectorTransform = $derived(`translate(-60, -10) rotate(8, 0, 100) scale(${option.name.replaceAll(" ", "").length * 0.5 + 1.5}, 3)`);

  $effect(() => {
    if (isMobile) return;
    if (isSelected) {
      select();
    } else {
      deselect();
    }
  });

  function select() {
    animate([textElement, textRedElement], {
      scale: 1.5,
      duration: 100,
      ease: spring({ bounce: 0.5, stiffness: 300, duration: 100 }),
      direction: "alternate"
    });
  }

  function deselect() {
    animate([textElement, textRedElement], {
      scale: 1,
      duration: 0
    });
  }

  onMount(() => {
    if (!isMobile) {
      utils.set(element, {
        translateX: option.offsetX,
        translateY: option.offsetY,
        rotate: option.rotation
      });
      createTimeline({
        loop: Infinity
      }).add([backgroundElement, backgroundMaskElement], {
        delay: 600,
        duration: 100,
        scale: 1.05,
      }).add([backgroundElement, backgroundMaskElement], {
        duration: 50,
        scale: 1,
      });
    }
  });
</script>

<div class="relative w-full md:w-auto max-w-[400px] md:max-w-none" style:z-index={isSelected && !isMobile ? 5 : option.zIndex}>
	<!-- Mobile: plain HTML button -->
	<button
		onclick={onConfirm}
		class="md:hidden w-full py-2 text-center text-fg text-5xl italic tracking-[-0.14em] outline-none"
		style="font-family: var(--font-rodin)"
		title={option.description}
	>
		{option.name}
	</button>

	<!-- Desktop: SVG button -->
	<div class="hidden md:block relative pointer-events-none w-[950px] max-w-[950px] h-auto">
		<button
			class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-16 outline-none pointer-events-auto"
			onmouseover={onSelect}
			onfocus={onSelect}
			onclick={onConfirm}
			ontouchstart={handleTouch}
			title={option.description}
		></button>

		<svg
			bind:this={element}
			width="950"
			height="200"
			viewBox="0 0 950 200"
			xmlns="http://www.w3.org/2000/svg"
			class="outline-none pointer-events-none w-full h-auto"
			transform-origin="25% center"
		>
			<defs>
				<mask
					id={selectorMaskId}
					maskUnits="userSpaceOnUse"
					maskContentUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="950"
					height="200"
				>
					<rect width="100%" height="100%" fill="black" />
					<g transform={selectorTransform} transform-origin="left center">
						<path
							fill="white"
							d={selectorPath}
						/>
						<path
							bind:this={backgroundMaskElement}
							transform-origin="52 100"
							fill="white"
							d={selectorBackgroundPath}
						/>
					</g>
				</mask>
			</defs>

			<g transform={selectorTransform} transform-origin="left center" style:display={!isMobile && isSelected ? "block" : "none"}>
				<path
					bind:this={backgroundElement}
					class="fill-pink"
					transform-origin="52 100"
					d={selectorBackgroundPath}
				/>
				<path
					class="fill-fg"
					d={selectorPath}
				/>
			</g>

			<text
				bind:this={textElement}
				transform-origin="25% center"
				x="150"
				y="120"
				class={cn(
					"text-7xl tracking-[-0.14em] italic",
					{
						[colors[(index + 2) % colors.length]]: !isSelected,
						"text-black": isSelected && !isMobile,
					}
				)}
			>
				{option.name}
			</text>

			{#if !isMobile && isSelected}
				<g mask={`url(#${selectorMaskId})`}>
					<text
						bind:this={textRedElement}
						transform-origin="25% center"
						x="150"
						y="120"
						class="text-7xl tracking-[-0.14em] italic fill-red"
					>
						{option.name}
					</text>
				</g>
			{/if}
		</svg>
	</div>
</div>