import ambedkarPortraitPng from './ambedkar-portrait.png';
import audienceCrowdSvg from './ambedkar-atlas-modern-audience.svg';
import parchmentBackdropSvg from './parchment-backdrop.svg';

export interface HeroAssetsConfig {
  ambedkarPortrait: string;
  historicalCrowd: string;
  backdrop: string;
  isCustomPortrait: boolean;
}

export const HERO_ASSETS: HeroAssetsConfig = {
  ambedkarPortrait: ambedkarPortraitPng,
  historicalCrowd: audienceCrowdSvg,
  backdrop: parchmentBackdropSvg,
  isCustomPortrait: true,
};

