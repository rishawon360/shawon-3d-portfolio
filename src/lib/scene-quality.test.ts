import { describe, expect, it } from "vitest";
import { sceneQuality, shouldAnimate } from "./scene-quality";

describe("mobile rendering budget", () => {
  it("caps phone resolution and reduces geometry", () => {
    const phone = sceneQuality(true, false);
    expect(phone.pixelRatio).toBe(1);
    expect(phone.terrainSegments).toEqual([24, 32]);
    expect(phone.clusterCount).toBe(48);
    expect(phone.frameInterval).toBe(1000 / 30);
    expect(phone.clusterCount).toBeLessThan(sceneQuality(false, false).clusterCount);
  });
  it("stops idle phone rendering after scrolling settles", () => {
    expect(shouldAnimate(true, false, false, 899)).toBe(true);
    expect(shouldAnimate(true, false, false, 900)).toBe(false);
    expect(shouldAnimate(false, false, false, 900)).toBe(true);
  });
  it("does not animate hidden pages or reduced-motion scenes", () => {
    expect(shouldAnimate(false, false, true, 0)).toBe(false);
    expect(shouldAnimate(true, true, false, 0)).toBe(false);
    expect(shouldAnimate(false, true, false, 0)).toBe(false);
  });
});