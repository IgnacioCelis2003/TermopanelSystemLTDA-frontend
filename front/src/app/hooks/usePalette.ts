import { ref } from 'vue';

type PaletteType = 'amber' | 'terracotta' | 'blue' | 'editorial' | 'tech' | 'green' | 'yellow' | 'red' | 'sunset';

type PaletteMap = Record<PaletteType, Record<string, string>>;

const palettes: PaletteMap = {
  amber: {
    '--page-bg': '#fffbf5',
    '--surface': '#fff8ee',
    '--sidebar-bg': '#3d2b1a',
    '--sidebar-hover': '#4e3826',
    '--nav-text': '#f0cfc0',
    '--accent': '#d97706',
    '--accent-light': '#fde68a',
    '--border-color': '#e8d9c0',
    '--text-primary': '#2c1f0e',
    '--text-secondary': '#6b4c2a',
    '--text-hint': '#a07850',
  },
  terracotta: {
    '--page-bg': '#fffbf5',
    '--surface': '#fff8ee',
    '--sidebar-bg': '#7a3535',
    '--sidebar-hover': '#8f4040',
    '--nav-text': '#f0cfc0',
    '--accent': '#d97706',
    '--accent-light': '#fde68a',
    '--border-color': '#e8d9c0',
    '--text-primary': '#2c1f0e',
    '--text-secondary': '#6b4c2a',
    '--text-hint': '#a07850',
  },
  blue: {
    '--page-bg': '#f0f6ff',
    '--surface': '#e8f0fb',
    '--sidebar-bg': '#1e3a5f',
    '--sidebar-hover': '#2a5284',
    '--nav-text': '#dbeafe',
    '--accent': '#2563eb',
    '--accent-light': '#bfdbfe',
    '--border-color': '#cbdcf7',
    '--text-primary': '#1e293b',
    '--text-secondary': '#475569',
    '--text-hint': '#94a3b8',
  },
  // --- NUEVAS PALETAS ---
  editorial: {
    '--page-bg': '#ffffff',
    '--surface': '#fcfcfc',
    '--sidebar-bg': '#1a1a1a',
    '--sidebar-hover': '#333333',
    '--nav-text': '#ffffff',
    '--accent': '#000000',
    '--accent-light': '#e5e5e5',
    '--border-color': '#e5e5e5',
    '--text-primary': '#000000',
    '--text-secondary': '#404040',
    '--text-hint': '#737373',
  },
  tech: {
    '--page-bg': '#f6f8ff',
    '--surface': '#eef2ff',
    '--sidebar-bg': '#32436b',
    '--sidebar-hover': '#3b4e7d',
    '--nav-text': '#f5f7ff',
    '--accent': '#38bdf8',
    '--accent-light': '#bae6fd',
    '--border-color': '#d5def0',
    '--text-primary': '#1f2a44',
    '--text-secondary': '#4b5b7c',
    '--text-hint': '#7b89ad',
  },
  green: {
    '--page-bg': '#f0f7f4',
    '--surface': '#e8f1ec',
    '--sidebar-bg': '#2d4739',
    '--sidebar-hover': '#3a5a4a',
    '--nav-text': '#e9edc9',
    '--accent': '#588157',
    '--accent-light': '#a3b18a',
    '--border-color': '#dad7cd',
    '--text-primary': '#344e41',
    '--text-secondary': '#588157',
    '--text-hint': '#a3b18a',
  },
  yellow: {
    '--page-bg': '#fffef0',
    '--surface': '#fffce0',
    '--sidebar-bg': '#5c542e',
    '--sidebar-hover': '#7a703d',
    '--nav-text': '#fefae0',
    '--accent': '#d4a373',
    '--accent-light': '#faedcd',
    '--border-color': '#e9edc9',
    '--text-primary': '#432818',
    '--text-secondary': '#99582a',
    '--text-hint': '#bc6c25',
  },
  red: {
    '--page-bg': '#fff5f5',
    '--surface': '#ffebeb',
    '--sidebar-bg': '#632b2b',
    '--sidebar-hover': '#7a3535',
    '--nav-text': '#fce4e4',
    '--accent': '#e53838',
    '--accent-light': '#ffcccc',
    '--border-color': '#f5d1d1',
    '--text-primary': '#4a1d1d',
    '--text-secondary': '#8c3a3a',
    '--text-hint': '#b86b6b',
  },
  sunset: {
    '--page-bg': '#fff8f5',
    '--surface': '#fff2eb',
    '--sidebar-bg': '#6e3a2b',
    '--sidebar-hover': '#874835',
    '--nav-text': '#fcece4',
    '--accent': '#f45b31',
    '--accent-light': '#ffccbc',
    '--border-color': '#f5dcd1',
    '--text-primary': '#4a251d',
    '--text-secondary': '#8c473a',
    '--text-hint': '#b87a6b',
  },
};

const palette = ref<PaletteType>('amber');

export const usePalette = () => {
  const setPalette = (newPalette: PaletteType) => {
    palette.value = newPalette;
    const colors = palettes[newPalette];
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  return { palette, setPalette };
};