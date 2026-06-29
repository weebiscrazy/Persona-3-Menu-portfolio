export interface OptionValue {
  name: string;
  rotation: number;
  zIndex: number;
  offsetX: number;
  offsetY: number;
  description: string;
}

export type SubmenuType = 'about' | 'social' | 'friends' | 'persona' | 'settings';
export type ViewState = 'main' | 'submenu';

export interface SubmenuTab {
  name: string;
  index: number;
  arcanaNumber?: string;
}
