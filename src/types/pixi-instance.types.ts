import { BloomFilter } from "pixi-filters";
import * as PIXI from "pixi.js";

export type PixiInstance = {
  container: PIXI.Container;
  destroy: () => void;
  filterRefs?: {
    blur?: PIXI.BlurFilter;
    bloom?: BloomFilter;
    colorMatrix?: PIXI.ColorMatrixFilter;
  };
};
