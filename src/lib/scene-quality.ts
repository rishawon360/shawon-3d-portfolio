export function sceneQuality(mobile: boolean, reducedMotion: boolean) {
  return {
    mobile,
    reducedMotion,
    pixelRatio: mobile ? 1 : 1.5,
    terrainSegments: mobile ? [24, 32] as const : [90, 120] as const,
    clusterCount: mobile ? 48 : 150,
    frameInterval: mobile ? 1000 / 30 : 1000 / 60,
  };
}

export function shouldAnimate(mobile: boolean, reducedMotion: boolean, hidden: boolean, sinceScroll: number) {
  return !hidden && !reducedMotion && (!mobile || sinceScroll < 900);
}