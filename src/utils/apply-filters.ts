import * as PIXI from "pixi.js";
import { FilterConfig } from "@/types/canvas-element.types";
import { AdjustmentFilter, BloomFilter } from "pixi-filters";

export const applyFilters = (
  colorMatrix: PIXI.ColorMatrixFilter,
  adjustments: AdjustmentFilter,
  blur: PIXI.BlurFilter,
  bloom: BloomFilter,
  filters?: FilterConfig,
) => {
  if (!filters) {
    blur.blur = 0;
    bloom.blur = 0;
    colorMatrix.reset();
    return;
  }

  if (filters.blur?.enabled) {
    if (!filters.blur.bindToBass) blur.blur = filters.blur.strength;
  } else {
    blur.blur = 0;
  }

  if (filters.bloom?.enabled) {
    if (!filters.bloom.bindToBass) bloom.blur = filters.bloom.strength;
  } else {
    bloom.blur = 0;
  }

  if (filters.colorMatrix?.enabled) {
    const anyBound = filters.colorMatrix.brightnessBind;

    if (!anyBound) colorMatrix.reset();

    if (!filters.colorMatrix.brightnessBind)
      adjustments.brightness = filters.colorMatrix.brightness ?? 1;
  } else {
    colorMatrix.reset();
  }
};
