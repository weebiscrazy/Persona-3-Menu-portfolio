/**
 * Persona 3-style programmatic UI sounds using Web Audio API.
 * No external audio files needed — generates tones synthetically.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
	if (!ctx) ctx = new AudioContext();
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}

/** Short click — menu navigation */
export function playNav() {
	const c = getCtx();
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = "square";
	o.frequency.setValueAtTime(880, c.currentTime);
	o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.04);
	g.gain.setValueAtTime(0.08, c.currentTime);
	g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
	o.connect(g).connect(c.destination);
	o.start(c.currentTime);
	o.stop(c.currentTime + 0.06);
}

/** Rising tone — menu selection */
export function playSelect() {
	const c = getCtx();
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = "triangle";
	o.frequency.setValueAtTime(400, c.currentTime);
	o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.12);
	g.gain.setValueAtTime(0.1, c.currentTime);
	g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
	o.connect(g).connect(c.destination);
	o.start(c.currentTime);
	o.stop(c.currentTime + 0.15);
}

/** Sweep whoosh — opening submenu */
export function playOpen() {
	const c = getCtx();
	const t = c.createOscillator();
	const n = c.createOscillator();
	const g = c.createGain();
	// Dual oscillator for richness
	t.type = "sine";
	t.frequency.setValueAtTime(200, c.currentTime);
	t.frequency.exponentialRampToValueAtTime(1800, c.currentTime + 0.3);
	n.type = "triangle";
	n.frequency.setValueAtTime(300, c.currentTime);
	n.frequency.exponentialRampToValueAtTime(2400, c.currentTime + 0.25);
	g.gain.setValueAtTime(0.07, c.currentTime);
	g.gain.linearRampToValueAtTime(0.12, c.currentTime + 0.08);
	g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
	t.connect(g);
	n.connect(g);
	g.connect(c.destination);
	t.start(c.currentTime);
	n.start(c.currentTime);
	t.stop(c.currentTime + 0.35);
	n.stop(c.currentTime + 0.35);
}

/** Descending tone — closing submenu / back */
export function playClose() {
	const c = getCtx();
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = "sine";
	o.frequency.setValueAtTime(1000, c.currentTime);
	o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.2);
	g.gain.setValueAtTime(0.08, c.currentTime);
	g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
	o.connect(g).connect(c.destination);
	o.start(c.currentTime);
	o.stop(c.currentTime + 0.25);
}

/** Impact hit — confirming a choice */
export function playConfirm() {
	const c = getCtx();
	// Low thump
	const thump = c.createOscillator();
	const g1 = c.createGain();
	thump.type = "sine";
	thump.frequency.setValueAtTime(80, c.currentTime);
	thump.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.1);
	g1.gain.setValueAtTime(0.15, c.currentTime);
	g1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
	thump.connect(g1).connect(c.destination);
	thump.start(c.currentTime);
	thump.stop(c.currentTime + 0.12);

	// Sparkle on top
	const spark = c.createOscillator();
	const g2 = c.createGain();
	spark.type = "triangle";
	spark.frequency.setValueAtTime(1200, c.currentTime + 0.03);
	spark.frequency.exponentialRampToValueAtTime(2400, c.currentTime + 0.1);
	g2.gain.setValueAtTime(0.06, c.currentTime + 0.03);
	g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
	spark.connect(g2).connect(c.destination);
	spark.start(c.currentTime + 0.03);
	spark.stop(c.currentTime + 0.15);
}

/** Error / invalid action buzz */
export function playError() {
	const c = getCtx();
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = "sawtooth";
	o.frequency.setValueAtTime(150, c.currentTime);
	o.frequency.linearRampToValueAtTime(100, c.currentTime + 0.15);
	g.gain.setValueAtTime(0.06, c.currentTime);
	g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
	o.connect(g).connect(c.destination);
	o.start(c.currentTime);
	o.stop(c.currentTime + 0.18);
}
