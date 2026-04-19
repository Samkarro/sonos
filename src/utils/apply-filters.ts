import { FilterConfig } from "@/types/canvas-element.types";
import { PixiInstance } from "@/types/pixi-instance.types";
import { BloomFilter } from "pixi-filters";
import * as PIXI from "pixi.js";

export const applyFilters = (instance: PixiInstance, config?: FilterConfig) => {
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const Bloom = new BloomFilter();

  blur.blur = config?.blur?.enabled ? config.blur.strength : 0;
  colorMatrix.brightness(config?.colorMatrix?.brightness ?? 1, false);
  colorMatrix.saturate(config?.colorMatrix?.saturation ?? 0, false);

  instance.container.filters = [blur, colorMatrix];
  instance.filterRefs = { blur, colorMatrix };
};
