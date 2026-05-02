import * as PIXI from "pixi.js";
import { AudioAnalyser } from "./audio-analyzer";
import { barHeightCalculator } from "./calculate-slope";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement } from "@/types/canvas-element.types";
import { AdjustmentFilter, BloomFilter } from "pixi-filters";

export type VisualizerConfig = {
  numBars: number;
  width: number;
  height: number;
  gap: number;
  fill: string;
};

// TODO: add guides: do not update smoothed and numbars, prompt user to remake if so.
export const createVisualizer = (
  app: PIXI.Application,
  analyser: AudioAnalyser,
  element: CanvasElement,
): PixiInstance => {
  if (!element.config) {
    throw new Error("Visualizer requires config");
  }
  let currentConfig = { ...element.config };

  const recalcLayout = () => {
    const { numBars, width, gap } = currentConfig;
    const barWidth = (width - gap * numBars) / numBars;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      bar.x = i * (barWidth + gap);
    }

    return barWidth;
  };

  const container = new PIXI.Container();
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const adjustments = new AdjustmentFilter();
  const bloom = new BloomFilter();
  container.filters = [blur, colorMatrix, adjustments];
  const bars: PIXI.Graphics[] = [];
  const smoothed = new Float32Array(currentConfig.numBars);
  let barWidth = recalcLayout();

  for (let i = 0; i < currentConfig.numBars; i++) {
    const bar = new PIXI.Graphics();
    bar.x = i * (barWidth + currentConfig.gap);
    bar.y = currentConfig.height;
    bars.push(bar);
    container.addChild(bar);
  }

  const tick = () => {
    const { numBars, height, fill } = currentConfig;

    for (let i = 0; i < numBars; i++) {
      const bandIndex = Math.floor((i / numBars) * analyser.bufferLength);
      const target = analyser.dataArray[bandIndex];

      smoothed[i] = smoothed[i] + (target - smoothed[i]) * 0.1;

      const barHeight = barHeightCalculator(smoothed[i], height);
      const bar = bars[i];

      bar.clear();
      bar.beginFill(fill);
      bar.drawRect(0, -barHeight, barWidth - 2, barHeight);
      bar.endFill();
    }
  };

  const applyFilters = (filters?: CanvasElement["filters"]) => {
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

    // Color Matrix
    if (filters.colorMatrix?.enabled) {
      colorMatrix.reset();
      console.log(filters.colorMatrix.brightness);
      colorMatrix.brightness(filters.colorMatrix.brightness ?? 1, false);
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

  app.ticker.add(tick);

  const update = (updates: Partial<CanvasElement>) => {
    if (updates.config) {
      const next = updates.config;

      if (
        next.numBars !== undefined &&
        next.numBars !== currentConfig.numBars
      ) {
        console.warn("numBars change requires full rebuild");
        return;
      }

      currentConfig = { ...currentConfig, ...next };

      if (next.width !== undefined || next.gap !== undefined) {
        barWidth = recalcLayout();
      }
    }

    if (updates.filters) {
      applyFilters(updates.filters);
    }
  };

  const destroy = () => {
    app.ticker.remove(tick);
    container.destroy({ children: true });
  };

  applyFilters(undefined);
  return { container, destroy, update };
};
