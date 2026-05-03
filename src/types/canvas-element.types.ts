import { VisualizerConfig } from "@/utils/element-creators/create-visualizer";
import { ShapeConfig } from "./shape-config.types";
import { TextConfig } from "./text-config.types";

export type FilterConfig = {
  blur?: { enabled: boolean; strength: number };
  bloom?: { enabled: boolean; strength: number; quality: number };
  colorMatrix?: {
    enabled: boolean;
    brightness: number;
    saturation: number;
    contrast: number;
  };
};

export type CanvasElement = {
  id: string;
  name: string;
  type: string;
  config?: VisualizerConfig;
  shapeConfig?: ShapeConfig;
  textConfig?: TextConfig;
  filters?: FilterConfig;
};
