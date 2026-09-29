import ambedkarPortraitWebp from './ambedkar-portrait.webp';
import audienceCrowdSvg from './ambedkar-atlas-modern-audience.svg';
import parchmentBackdropSvg from './parchment-backdrop.svg';

export interface HeroAssetsConfig {
  ambedkarPortrait: string;
  historicalCrowd: string;
  backdrop: string;
  isCustomPortrait: boolean;
}

export const HERO_ASSETS: HeroAssetsConfig = {
  ambedkarPortrait: ambedkarPortraitWebp,
  historicalCrowd: audienceCrowdSvg,
  backdrop: parchmentBackdropSvg,
  isCustomPortrait: true,
};

