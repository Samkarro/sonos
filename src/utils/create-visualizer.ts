import * as PIXI from "pixi.js";
import { AudioAnalyser } from "./audio-analyzer";
import { barHeightCalculator } from "./calculate-slope";

export type VisualizerConfig = {
  numBars: number;
  width: number;
  height: number;
  gap: number;
};

export type VisualizerInstance = {
  container: PIXI.Container;
  destroy: () => void;
};

export const createVisualizer = (
  app: PIXI.Application,
  analyser: AudioAnalyser,
  config: VisualizerConfig,
): VisualizerInstance => {
  const { numBars, width, height, gap } = config;

  const container = new PIXI.Container();
  const bars: PIXI.Graphics[] = [];
  const smoothed = new Float32Array(numBars);
  const barWidth = (width - gap * numBars) / numBars;

  for (let i = 0; i < numBars; i++) {
    const bar = new PIXI.Graphics();
    bar.x = i * (barWidth + gap);
    bar.y = height;
    bars.push(bar);
    container.addChild(bar);
  }

  const tick = () => {
    for (let i = 0; i < numBars; i++) {
      const bandIndex = Math.floor((i / numBars) * analyser.bufferLength);
      const target = analyser.dataArray[bandIndex];
      smoothed[i] = smoothed[i] + (target - smoothed[i]) * 0.1;

      const barHeight = barHeightCalculator(smoothed[i], height);
      const bar = bars[i];
      bar.clear();
      bar.beginFill(0xffffff);
      bar.drawRect(0, -barHeight, barWidth - 2, barHeight);
      bar.endFill();
    }
  };

  app.ticker.add(tick);

  const destroy = () => {
    app.ticker.remove(tick);
    container.destroy({ children: true });
  };

  return { container, destroy };
};
