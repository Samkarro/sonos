import * as PIXI from "pixi.js";
import { AudioAnalyser } from "./audio-analyzer";
import { barHeightCalculator } from "./calculate-slope";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement } from "@/types/canvas-element.types";

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
  config: VisualizerConfig,
): PixiInstance => {
  let currentConfig = { ...config };

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

  app.ticker.add(tick);

  const update = (updates: Partial<CanvasElement>) => {
    if (!updates.config) return;

    const next = updates.config;

    if (next.numBars !== undefined && next.numBars !== currentConfig.numBars) {
      console.warn("numBars change requires full rebuild");
      return;
    }

    currentConfig = { ...currentConfig, ...next };

    if (next.width !== undefined || next.gap !== undefined) {
      barWidth = recalcLayout();
    }
  };

  const destroy = () => {
    app.ticker.remove(tick);
    container.destroy({ children: true });
  };

  return { container, destroy, update };
};
