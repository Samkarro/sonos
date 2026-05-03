import * as PIXI from "pixi.js";
import { AudioAnalyser } from "../audio-analyzer";
import { barHeightCalculator } from "../calculate-slope";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement } from "@/types/canvas-element.types";
import { AdjustmentFilter, BloomFilter } from "pixi-filters";
import { applyFilters } from "../apply-filters";
import { getBassLevel } from "../bass-ticker";

export type VisualizerConfig = {
  numBars: number;
  gap: number;
  fill: string;
};

export const createVisualizer = (
  app: PIXI.Application,
  analyser: AudioAnalyser,
  element: CanvasElement,
): PixiInstance => {
  if (!element.config) {
    throw new Error("Visualizer requires config");
  }

  let currentConfig = { ...element.config };
  let currentX = element.x;
  let currentY = element.y;
  let currentWidth = element.width ?? 100;
  let currentHeight = element.height ?? 100;

  const recalcLayout = () => {
    const { numBars, gap } = currentConfig;
    const barWidth = (currentWidth - gap * numBars) / numBars;
    for (let i = 0; i < bars.length; i++) {
      bars[i].x = i * (barWidth + gap);
    }
    return barWidth;
  };

  const container = new PIXI.Container();
  container.x = currentX;
  container.y = currentY;

  // Filter setup
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const adjustments = new AdjustmentFilter();
  const bloom = new BloomFilter();
  container.filters = [blur, bloom, colorMatrix, adjustments];

  // Visualizer specific stuff
  const bars: PIXI.Graphics[] = [];
  const smoothed = new Float32Array(currentConfig.numBars);
  let barWidth = recalcLayout();

  for (let i = 0; i < currentConfig.numBars; i++) {
    const bar = new PIXI.Graphics();
    bar.x = i * (barWidth + currentConfig.gap);
    bar.y = currentHeight;
    bars.push(bar);
    container.addChild(bar);
  }

  const tick = () => {
    const { numBars, fill } = currentConfig;
    for (let i = 0; i < numBars; i++) {
      const bandIndex = Math.floor((i / numBars) * analyser.bufferLength);
      const target = analyser.dataArray[bandIndex];
      smoothed[i] = smoothed[i] + (target - smoothed[i]) * 0.1;
      const barHeight = barHeightCalculator(smoothed[i], currentHeight);
      const bar = bars[i];
      bar.clear();
      bar.beginFill(fill);
      bar.drawRect(0, -barHeight, barWidth - 2, barHeight);
      bar.endFill();
    }
  };

  let currentFilters = element.filters;

  const bassTick = () => {
    if (!currentFilters || !analyser) return;
    const bass = getBassLevel(analyser);

    if (currentFilters.blur?.enabled && currentFilters.blur.bindToBass) {
      blur.blur = barHeightCalculator(
        currentFilters.blur.strength * bass * 5 * 3,
        currentHeight,
      );
    }
    if (currentFilters.bloom?.enabled && currentFilters.bloom.bindToBass) {
      bloom.blur = barHeightCalculator(
        currentFilters.bloom.strength * bass * 5 * 3,
        currentHeight,
      );
    }
    if (
      currentFilters.colorMatrix?.enabled &&
      currentFilters.colorMatrix.brightnessBind
    ) {
      adjustments.brightness = barHeightCalculator(
        currentFilters.colorMatrix.brightness * (0.0 + bass * 5),
        currentHeight,
      );
    }
  };

  app.ticker.add(bassTick);

  app.ticker.add(tick);

  const update = (updates: Partial<CanvasElement>) => {
    if (updates.x !== undefined) {
      currentX = updates.x;
      container.x = currentX;
    }
    if (updates.y !== undefined) {
      currentY = updates.y;
      container.y = currentY;
    }
    if (updates.width !== undefined) {
      currentWidth = updates.width;
      barWidth = recalcLayout();
    }
    if (updates.height !== undefined) {
      currentHeight = updates.height;
      bars.forEach((bar) => (bar.y = currentHeight));
    }

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
      if (next.gap !== undefined) barWidth = recalcLayout();
    }

    if (updates.filters) {
      currentFilters = updates.filters;
      applyFilters(colorMatrix, adjustments, blur, bloom, updates.filters);
    }
  };

  const destroy = () => {
    app.ticker.remove(tick);
    app.ticker.remove(bassTick);
    container.destroy({ children: true });
  };

  applyFilters(colorMatrix, adjustments, blur, bloom, element.filters);
  return { container, destroy, update };
};
