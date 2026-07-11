<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	type ParticleType = "electric" | "data" | "petals" | "water";

	interface ParticleConfig {
		count: number;
		color: string;
		secondaryColor: string;
		speedRange: [number, number];
		sizeRange: [number, number];
		spawnArea: "full" | "top" | "bottom" | "edges";
		gravity: number;
		wind: number;
		emissionRate: number;
	}

	const PRESETS: Record<ParticleType, ParticleConfig> = {
		electric: {
			count: 25,
			color: "#78716C",
			secondaryColor: "#FFD700",
			speedRange: [0.8, 2.5],
			sizeRange: [1, 3],
			spawnArea: "edges",
			gravity: 0,
			wind: 0.02,
			emissionRate: 0.15
		},
		data: {
			count: 30,
			color: "#4ADE80",
			secondaryColor: "#10B981",
			speedRange: [0.3, 1.2],
			sizeRange: [2, 6],
			spawnArea: "top",
			gravity: 0.005,
			wind: 0.008,
			emissionRate: 0.2
		},
		petals: {
			count: 20,
			color: "#FD77D9",
			secondaryColor: "#F472B6",
			speedRange: [0.2, 0.8],
			sizeRange: [4, 10],
			spawnArea: "top",
			gravity: 0.003,
			wind: 0.015,
			emissionRate: 0.08
		},
		water: {
			count: 35,
			color: "#16CFFB",
			secondaryColor: "#7DE6FD",
			speedRange: [0.5, 1.8],
			sizeRange: [1, 4],
			spawnArea: "full",
			gravity: 0.008,
			wind: 0.005,
			emissionRate: 0.25
		}
	};

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		opacity: number;
		rotation: number;
		rotationSpeed: number;
		life: number;
		maxLife: number;
		type: "line" | "circle" | "petal" | "drop";
	}

	let { type = "water", className = "", style = "", paused = false }: {
		type?: ParticleType;
		className?: string;
		style?: string;
		paused?: boolean;
	} = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let particles: Particle[] = [];
	let animationId: number;
	let lastTime = 0;
	let accumulator = 0;
	const config = $derived(PRESETS[type]);

	function initCanvas() {
		if (!canvas) return;
		ctx = canvas.getContext("2d")!;
		resize();
		particles = [];
		// Pre-spawn initial particles
		for (let i = 0; i < config.count; i++) {
			spawnParticle(true);
		}
		lastTime = performance.now();
		loop(lastTime);
	}

	function resize() {
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.parentElement?.getBoundingClientRect() ?? { width: 1920, height: 1080 };
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		canvas.style.width = rect.width + "px";
		canvas.style.height = rect.height + "px";
		ctx?.scale(dpr, dpr);
	}

	function spawnParticle(initial = false): Particle {
		const w = canvas?.parentElement?.clientWidth ?? 1920;
		const h = canvas?.parentElement?.clientHeight ?? 1080;
		let x: number, y: number;

		switch (config.spawnArea) {
			case "top":
				x = Math.random() * w;
				y = initial ? Math.random() * h : -20;
				break;
			case "bottom":
				x = Math.random() * w;
				y = initial ? Math.random() * h : h + 20;
				break;
			case "edges":
				if (Math.random() < 0.5) {
					x = Math.random() < 0.5 ? -20 : w + 20;
					y = Math.random() * h;
				} else {
					x = Math.random() * w;
					y = Math.random() < 0.5 ? -20 : h + 20;
				}
				break;
			default: // full
				x = Math.random() * w;
				y = Math.random() * h;
		}

		const angle = Math.random() * Math.PI * 2;
		const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
		const vx = Math.cos(angle) * speed + config.wind;
		const vy = Math.sin(angle) * speed;

		const useSecondary = Math.random() < 0.3;

		return {
			x,
			y,
			vx: type === "petals" ? (Math.random() - 0.5) * 0.5 : vx,
			vy: type === "petals" ? config.speedRange[0] + Math.random() * 0.5 : vy,
			size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
			color: useSecondary ? config.secondaryColor : config.color,
			opacity: 0.3 + Math.random() * 0.5,
			rotation: Math.random() * Math.PI * 2,
			rotationSpeed: (Math.random() - 0.5) * 0.02,
			life: 0,
			maxLife: 100 + Math.random() * 200,
			type: type === "electric" ? "line" : type === "data" ? "circle" : type === "petals" ? "petal" : "drop"
		};
	}

	function updateParticle(p: Particle, dt: number): boolean {
		if (paused) return true;

		p.x += p.vx * dt * 60;
		p.y += p.vy * dt * 60;
		p.vy += config.gravity * dt * 60;
		p.vx += config.wind * dt * 60;
		p.rotation += p.rotationSpeed * dt * 60;
		p.life++;

		const w = canvas?.parentElement?.clientWidth ?? 1920;
		const h = canvas?.parentElement?.clientHeight ?? 1080;
		const margin = 50;

		// Respawn if out of bounds or dead
		if (p.life > p.maxLife || p.x < -margin || p.x > w + margin || p.y < -margin || p.y > h + margin) {
			if (!paused) {
				Object.assign(p, spawnParticle());
			}
			return false;
		}
		return true;
	}

	function drawParticle(p: Particle) {
		if (!ctx) return;
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rotation);
		ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife);

		switch (p.type) {
			case "line": // Electric spark - jagged line
				ctx.strokeStyle = p.color;
				ctx.lineWidth = p.size;
				ctx.lineCap = "round";
				ctx.beginPath();
				const segments = 4 + Math.floor(p.size);
				ctx.moveTo(-p.size * 2, 0);
				for (let i = 1; i <= segments; i++) {
					const px = (-p.size * 2) + (i / segments) * p.size * 4;
					const py = (Math.random() - 0.5) * p.size * 3;
					ctx.lineTo(px, py);
				}
				ctx.stroke();
				break;

			case "circle": // Data/hex - small squares or dots
				ctx.fillStyle = p.color;
				if (Math.random() < 0.5) {
					ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
				} else {
					ctx.beginPath();
					ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
					ctx.fill();
				}
				break;

			case "petal": // Rose petal - ellipse with slight curve
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
				ctx.fill();
				// Inner detail
				ctx.globalAlpha *= 0.4;
				ctx.beginPath();
				ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.2, 0, 0, Math.PI * 2);
				ctx.fill();
				break;

			case "drop": // Water droplet
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.moveTo(0, -p.size);
				ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size * 0.5);
				ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size);
				ctx.fill();
				// Highlight
				ctx.globalAlpha *= 0.6;
				ctx.fillStyle = "#fff";
				ctx.beginPath();
				ctx.ellipse(-p.size * 0.2, -p.size * 0.3, p.size * 0.3, p.size * 0.15, 0, 0, Math.PI * 2);
				ctx.fill();
				break;
		}
		ctx.restore();
	}

	function loop(time: number) {
		if (paused) {
			animationId = requestAnimationFrame(loop);
			return;
		}
		const dt = Math.min((time - lastTime) / 1000, 0.1);
		lastTime = time;

		if (!ctx || !canvas) return;

		const w = canvas.parentElement?.clientWidth ?? 1920;
		const h = canvas.parentElement?.clientHeight ?? 1080;

		ctx.clearRect(0, 0, w, h);

		// Emission
		accumulator += dt;
		const emitInterval = 1 / config.emissionRate;
		while (accumulator >= emitInterval && particles.length < config.count * 1.5) {
			particles.push(spawnParticle());
			accumulator -= emitInterval;
		}

		// Update & draw
		particles = particles.filter(p => updateParticle(p, dt));
		particles.forEach(drawParticle);

		animationId = requestAnimationFrame(loop);
	}

	onMount(() => {
		initCanvas();
		window.addEventListener("resize", resize);
	});

	onDestroy(() => {
		cancelAnimationFrame(animationId);
		window.removeEventListener("resize", resize);
	});
</script>

<canvas
	bind:this={canvas}
	class={className}
	style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;"
	aria-hidden="true"
></canvas>