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
  colorMatrix.reset();

  if (!filters) {
    blur.blur = 0;
    colorMatrix.reset();
    return;
  }

  // Blur
  if (filters.blur?.enabled) {
    blur.blur = filters.blur.strength;
  } else {
    blur.blur = 0;
  }

  // Color adjustments
  if (filters.colorMatrix?.enabled) {
    colorMatrix.reset();
    adjustments.brightness = filters.colorMatrix.brightness ?? 1;
    adjustments.saturation = filters.colorMatrix.saturation ?? 1;
    colorMatrix.contrast(filters.colorMatrix.contrast ?? 0, false);
  } else {
    colorMatrix.reset();
  }

  if (filters.bloom?.enabled) {
    bloom.blur = filters.bloom.strength;
  } else {
    bloom.blur = 0;
  }
};
