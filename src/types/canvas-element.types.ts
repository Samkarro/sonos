import { ShapeConfig } from "@/elements/tabs/create-shape";
import { VisualizerConfig } from "@/utils/create-visualizer";

export type CanvasElement = {
  id: string;
  name: string;
  type: string;
  config?: VisualizerConfig;
  shapeConfig?: ShapeConfig;
};
