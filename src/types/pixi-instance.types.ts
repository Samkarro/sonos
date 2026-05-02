import { BloomFilter } from "pixi-filters";
import * as PIXI from "pixi.js";
import { CanvasElement, FilterConfig } from "./canvas-element.types";

export type PixiInstance = {
  container: PIXI.Container;
  destroy: () => void;
  update?: (updates: Partial<CanvasElement>) => void;
  applyFilters?: (filters: FilterConfig) => void;
  filterRefs?: {
    blur?: PIXI.BlurFilter;
    bloom?: BloomFilter;
    colorMatrix?: PIXI.ColorMatrixFilter;
  };
};
