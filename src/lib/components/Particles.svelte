<script lang="ts">
	const bubbles = Array.from({ length: 22 }, (_, i) => ({
		id: i,
		size: Math.random() * 30 + 10,
		left: Math.random() * 100,
		delay: Math.random() * 8,
		duration: Math.random() * 8 + 10,
		opacity: Math.random() * 0.2 + 0.2,
		drift: Math.random() * 40 - 20,
	}));
</script>

<div class="particles-container" aria-hidden="true">
	{#each bubbles as b}
		<div
			class="bubble"
			style="
				--s: {b.size}px;
				--l: {b.left}%;
				--d: {b.delay}s;
				--dur: {b.duration}s;
				--o: {b.opacity};
				--drift: {b.drift}px;
			"
		></div>
	{/each}
</div>

<style>
	.particles-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;
	}
	.bubble {
		position: absolute;
		bottom: -40px;
		left: var(--l);
		width: var(--s);
		height: var(--s);
		border-radius: 50%;
		background: radial-gradient(circle at 30% 30%, rgba(22,207,251,0.4), rgba(22,207,251,0.06));
		border: 1.5px solid rgba(22,207,251,0.35);
		box-shadow:
			inset -1px -1px 3px rgba(0,0,0,0.1),
			0 0 12px rgba(22,207,251,0.18);
		opacity: 0;
		animation: float var(--dur) ease-in var(--d) infinite;
	}
	@keyframes float {
		0% {
			opacity: 0;
			transform: translateY(0) translateX(0) scale(0.4);
		}
		6% {
			opacity: var(--o);
			transform: translateY(-6vh) translateX(calc(var(--drift) * -0.15)) scale(1);
		}
		85% {
			opacity: calc(var(--o) * 0.5);
		}
		100% {
			opacity: 0;
			transform: translateY(-105vh) translateX(var(--drift)) scale(0.5);
		}
	}
</style>