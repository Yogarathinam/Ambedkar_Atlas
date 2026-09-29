// Central asset configuration for the Hero section
// Evaluators or contributors can replace these with custom high-resolution PNGs
// by simply saving ambedkar-portrait.png or historical-crowd.png in this folder.

import ambedkarSilhouetteSvg from './ambedkar-silhouette.svg';
import historicalCrowdSvg from './historical-crowd.svg';
import parchmentBackdropSvg from './parchment-backdrop.svg';

export interface HeroAssetsConfig {
  ambedkarPortrait: string;
  historicalCrowd: string;
  backdrop: string;
  isCustomPortrait: boolean;
}

export const HERO_ASSETS: HeroAssetsConfig = {
  // SVG vector illustration default ensures 0 broken images out of the box
  ambedkarPortrait: ambedkarSilhouetteSvg,
  historicalCrowd: historicalCrowdSvg,
  backdrop: parchmentBackdropSvg,
  isCustomPortrait: false,
};
