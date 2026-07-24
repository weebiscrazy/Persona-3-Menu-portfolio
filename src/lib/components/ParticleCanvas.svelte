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
			count: 250,
			color: "#FFD700",
			secondaryColor: "#FFFFFF",
			speedRange: [2, 8],
			sizeRange: [3, 12],
			spawnArea: "edges",
			gravity: 0,
			wind: 0.05,
			emissionRate: 3.0
		},
		data: {
			count: 300,
			color: "#EAB308",
			secondaryColor: "#FDE047",
			speedRange: [1, 4],
			sizeRange: [15, 35],
			spawnArea: "top",
			gravity: 0.012,
			wind: 0.02,
			emissionRate: 3.5
		},
		petals: {
			count: 200,
			color: "#FD77D9",
			secondaryColor: "#F472B6",
			speedRange: [0.5, 2],
			sizeRange: [12, 28],
			spawnArea: "top",
			gravity: 0.006,
			wind: 0.04,
			emissionRate: 1.5
		},
		water: {
			count: 250,
			color: "#16CFFB",
			secondaryColor: "#7DE6FD",
			speedRange: [1, 4],
			sizeRange: [5, 14],
			spawnArea: "full",
			gravity: 0.015,
			wind: 0.012,
			emissionRate: 3.0
		}
	};

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		secondaryColor: string;
		opacity: number;
		rotation: number;
		rotationSpeed: number;
		life: number;
		maxLife: number;
		type: "line" | "circle" | "petal" | "drop";
		/** Pre-generated zigzag Y offsets for electric particles (stable per particle) */
		segments: number[];
		/** Pre-determined shape for data particles: true = hexagon, false = square */
		isHex: boolean;
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

		// Pre-generate electric zigzag segments (avoid Math.random() in draw loop)
		const segCount = 5 + Math.floor(config.sizeRange[1]);
		const segments: number[] = [];
		for (let i = 0; i <= segCount; i++) {
			segments.push((Math.random() - 0.5) * config.sizeRange[1] * 4);
		}

		const particleType = type === "electric" ? "line" : type === "data" ? "circle" : type === "petals" ? "petal" : "drop";

		return {
			x,
			y,
			vx: type === "petals" ? (Math.random() - 0.5) * 0.5 : vx,
			vy: type === "petals" ? config.speedRange[0] + Math.random() * 0.5 : vy,
			size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
			color: useSecondary ? config.secondaryColor : config.color,
			secondaryColor: config.secondaryColor,
			opacity: 0.3 + Math.random() * 0.5,
			rotation: Math.random() * Math.PI * 2,
			rotationSpeed: (Math.random() - 0.5) * 0.02,
			life: 0,
			maxLife: 100 + Math.random() * 200,
			type: particleType,
			segments,
			isHex: Math.random() < 0.4,
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
			case "line": // Electric spark - jagged lightning bolt (uses pre-generated segments)
				ctx.strokeStyle = p.color;
				ctx.lineWidth = p.size;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size * 14;
				ctx.beginPath();
				ctx.moveTo(-p.size * 3, 0);
				const segLen = p.segments.length - 1;
				for (let i = 1; i <= segLen; i++) {
					const px = (-p.size * 3) + (i / segLen) * p.size * 6;
					const py = p.segments[i] * (p.size / config.sizeRange[1]);
					ctx.lineTo(px, py);
				}
				ctx.stroke();
				// Core bright line
				ctx.shadowBlur = 0;
				ctx.strokeStyle = "#fff";
				ctx.lineWidth = Math.max(1, p.size * 0.3);
				ctx.globalAlpha *= 0.8;
				ctx.beginPath();
				ctx.moveTo(-p.size * 3, 0);
				for (let i = 1; i <= segLen; i++) {
					const px = (-p.size * 3) + (i / segLen) * p.size * 6;
					const py = p.segments[i] * (p.size / config.sizeRange[1]) * 0.5;
					ctx.lineTo(px, py);
				}
				ctx.stroke();
				break;

			case "circle": // Data/hex - glowing hexagons & squares (pre-determined at spawn)
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size * 6;
				if (p.isHex) {
					// Hexagon
					ctx.beginPath();
					for (let i = 0; i < 6; i++) {
						const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
						ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
					}
					ctx.closePath();
					ctx.fill();
				} else {
					// Square with rounded corners
					const r = p.size * 0.2;
					ctx.beginPath();
					ctx.roundRect(-p.size, -p.size, p.size * 2, p.size * 2, r);
					ctx.fill();
				}
				// Inner glow
				ctx.globalAlpha *= 0.5;
				ctx.fillStyle = "#fff";
				ctx.beginPath();
				ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
				ctx.fill();
				break;

			case "petal": // Rose petal - organic teardrop shape
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size * 5;
				ctx.beginPath();
				ctx.moveTo(0, -p.size);
				ctx.bezierCurveTo(
					p.size * 0.7, -p.size * 0.3,
					p.size * 0.8, p.size * 0.4,
					0, p.size * 0.8
				);
				ctx.bezierCurveTo(
					-p.size * 0.8, p.size * 0.4,
					-p.size * 0.7, -p.size * 0.3,
					0, -p.size
				);
				ctx.fill();
				// Vein detail
				ctx.globalAlpha *= 0.35;
				ctx.strokeStyle = p.secondaryColor;
				ctx.lineWidth = Math.max(1, p.size * 0.15);
				ctx.beginPath();
				ctx.moveTo(0, -p.size * 0.9);
				ctx.quadraticCurveTo(0, 0, 0, p.size * 0.6);
				ctx.stroke();
				break;

			case "drop": // Water droplet - with ripple
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size * 5;
				ctx.beginPath();
				ctx.moveTo(0, -p.size);
				ctx.bezierCurveTo(
					p.size * 0.7, -p.size * 0.2,
					p.size * 0.8, p.size * 0.5,
					0, p.size * 0.7
				);
				ctx.bezierCurveTo(
					-p.size * 0.8, p.size * 0.5,
					-p.size * 0.7, -p.size * 0.2,
					0, -p.size
				);
				ctx.fill();
				// Specular highlight
				ctx.globalAlpha *= 0.7;
				ctx.fillStyle = "#fff";
				ctx.beginPath();
				ctx.ellipse(-p.size * 0.25, -p.size * 0.4, p.size * 0.35, p.size * 0.15, -0.3, 0, Math.PI * 2);
				ctx.fill();
				// Inner caustic
				ctx.globalAlpha *= 0.4;
				ctx.fillStyle = "#7DE6FD";
				ctx.beginPath();
				ctx.arc(0, p.size * 0.1, p.size * 0.25, 0, Math.PI * 2);
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
		while (accumulator >= emitInterval && particles.length < config.count * 5) {
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