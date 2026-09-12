import { OfficeProject } from './types';
import { OFFICE_PROJECTS } from './officeProjects';

export const GLOBE_RADIUS = 6.0;
export const CARD_WIDTH = 1.8;
export const CARD_HEIGHT = 2.4;
export const TOTAL_CARDS = 48;

export { OFFICE_PROJECTS };

export function getOfficeProject(index: number): OfficeProject {
  return OFFICE_PROJECTS[index % OFFICE_PROJECTS.length];
}

// Preset studio stamp / badge options for visualization
export interface BadgeOption {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  iconType: 'studio' | 'leed' | 'biophilic' | 'acoustic' | 'minimal' | 'custom';
}

export const PRESET_BADGES: BadgeOption[] = [
  {
    id: 'studio-principal',
    label: 'STUDIO ARCHIVE',
    subtitle: 'Principal Selection',
    color: '#000000',
    iconType: 'studio'
  },
  {
    id: 'leed-esg',
    label: 'ESG / NET ZERO',
    subtitle: 'Sustainability Verified',
    color: '#15803D',
    iconType: 'leed'
  },
  {
    id: 'biophilic-craft',
    label: 'BIOPHILIC SPATIAL',
    subtitle: 'Human-Centered Ecology',
    color: '#047857',
    iconType: 'biophilic'
  },
  {
    id: 'acoustic-focus',
    label: 'ACOUSTIC ARCHITECTURE',
    subtitle: 'Soundscape & Focus',
    color: '#4338CA',
    iconType: 'acoustic'
  },
  {
    id: 'scandinavian-minimal',
    label: 'MODERNIST MINIMAL',
    subtitle: 'Timber & Daylight',
    color: '#334155',
    iconType: 'minimal'
  }
];
