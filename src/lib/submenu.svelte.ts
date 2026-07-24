import { onMount } from "svelte";

type Phase = "eye" | "aoa" | "content";

export interface SubmenuConfig {
  /** Image paths to pre-warm on mount */
  images: string[];
  /** Duration in ms before switching from "eye" → "aoa" (default: 1500) */
  eyeDuration?: number;
  /** Duration in ms before switching from "aoa" → "content" (default: 2000) */
  aoaDuration?: number;
}

export interface SubmenuState {
  phase: Phase;
  closing: boolean;
  activeTab: number;
  handleClose: () => void;
  skipToContent: () => boolean;
  handleKeydown: (e: KeyboardEvent, tabsLength: number, onClose?: () => void) => void;
  handleTabClick: (index: number) => void;
  setupLifecycle: () => void;
}

export function createSubmenu(config: SubmenuConfig): SubmenuState {
  const { images, eyeDuration = 1500, aoaDuration = 2000 } = config;

  let phase = $state<Phase>("eye");
  let closing = $state(false);
  let activeTab = $state(0);

  function skipToContent(): boolean {
    if (phase === "content") return false;
    phase = "content";
    return true;
  }

  function handleClose() {
    if (closing) return;
    closing = true;
    setTimeout(() => {
      // Dispatch a custom event so parent can listen instead of window.closeSubmenu hack
      window.dispatchEvent(new CustomEvent("submenu-close"));
    }, 350);
  }

  function handleKeydown(e: KeyboardEvent, tabsLength: number, onClose?: () => void) {
    if (closing) return;
    e.stopPropagation();

    if (e.key === "ArrowRight" && activeTab < tabsLength - 1) {
      activeTab++;
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && activeTab > 0) {
      activeTab--;
      e.preventDefault();
    } else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
      e.preventDefault();
      if (phase !== "content") {
        skipToContent();
      } else {
        (onClose ?? handleClose)();
      }
    }
  }

  function handleTabClick(index: number) {
    if (index === activeTab) return;
    activeTab = index;
  }

  function setupLifecycle() {
    // Pre-warm image cache
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    t1 = setTimeout(() => {
      if (phase === "content") return;
      phase = "aoa";
    }, eyeDuration);

    t2 = setTimeout(() => {
      if (phase === "content") return;
      phase = "content";
    }, eyeDuration + aoaDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }

  return {
    get phase() { return phase; },
    set phase(v: Phase) { phase = v; },
    get closing() { return closing; },
    get activeTab() { return activeTab; },
    set activeTab(v: number) { activeTab = v; },
    handleClose,
    skipToContent,
    handleKeydown,
    handleTabClick,
    setupLifecycle,
  };
}
