import * as PIXI from "pixi.js";
import { FilterConfig } from "@/types/canvas-element.types";
import { BloomFilter } from "pixi-filters";

export const applyFilters = (
  container: PIXI.Container,
  config?: FilterConfig,
) => {
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const bloom = new BloomFilter();

  blur.blur = config?.blur?.enabled ? config.blur.strength : 0;

  colorMatrix.reset();

  if (config?.colorMatrix?.enabled) {
    const c = config.colorMatrix;

    colorMatrix.brightness(c.brightness ?? 1, false);
    colorMatrix.saturate(c.saturation ?? 0, false);
    colorMatrix.contrast(c.contrast ?? 0, false);
  }

  if (config?.bloom?.enabled) {
    bloom.blur = config.bloom.strength;
  } else {
    bloom.blur = 0;
  }

  const active = [blur, colorMatrix];
  container.filters = active;
};
