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
			count: 40,
			color: "#B8B0A8",
			secondaryColor: "#FFD700",
			speedRange: [1.5, 4],
			sizeRange: [1.5, 4],
			spawnArea: "edges",
			gravity: 0,
			wind: 0.03,
			emissionRate: 0.3
		},
		data: {
			count: 50,
			color: "#4ADE80",
			secondaryColor: "#22C55E",
			speedRange: [0.5, 2],
			sizeRange: [8, 16],
			spawnArea: "top",
			gravity: 0.008,
			wind: 0.01,
			emissionRate: 0.35
		},
		petals: {
			count: 25,
			color: "#FD77D9",
			secondaryColor: "#F472B6",
			speedRange: [0.3, 1],
			sizeRange: [6, 14],
			spawnArea: "top",
			gravity: 0.004,
			wind: 0.02,
			emissionRate: 0.1
		},
		water: {
			count: 45,
			color: "#16CFFB",
			secondaryColor: "#7DE6FD",
			speedRange: [0.8, 2.5],
			sizeRange: [2, 6],
			spawnArea: "full",
			gravity: 0.01,
			wind: 0.008,
			emissionRate: 0.4
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
			case "line": // Electric spark - jagged lightning bolt
				ctx.strokeStyle = p.color;
				ctx.lineWidth = p.size;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size * 3;
				ctx.beginPath();
				const segments = 5 + Math.floor(p.size);
				ctx.moveTo(-p.size * 3, 0);
				for (let i = 1; i <= segments; i++) {
					const px = (-p.size * 3) + (i / segments) * p.size * 6;
					const py = (Math.random() - 0.5) * p.size * 4;
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
				for (let i = 1; i <= segments; i++) {
					const px = (-p.size * 3) + (i / segments) * p.size * 6;
					const py = (Math.random() - 0.5) * p.size * 2;
					ctx.lineTo(px, py);
				}
				ctx.stroke();
				break;

			case "circle": // Data/hex - glowing hexagons & squares
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = p.size;
				if (Math.random() < 0.4) {
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
				ctx.shadowBlur = p.size * 0.8;
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
				ctx.shadowBlur = p.size;
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