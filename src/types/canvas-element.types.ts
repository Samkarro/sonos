import { VisualizerConfig } from "@/utils/create-visualizer";
import { ShapeConfig } from "./shape-config.types";
import { TextConfig } from "./text-config.types";

export type CanvasElement = {
  id: string;
  name: string;
  type: string;
  config?: VisualizerConfig;
  shapeConfig?: ShapeConfig;
  textConfig?: TextConfig;
};
