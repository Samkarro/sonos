import { VisualizerConfig } from "@/utils/element-creators/create-visualizer";
import { ShapeConfig } from "./shape-config.types";
import { TextConfig } from "./text-config.types";

export type CanvasElementType = "visualizer" | "shape" | "text";

export type FilterConfig = {
  blur?: { enabled: boolean; strength: number; bindToBass?: boolean };
  bloom?: {
    enabled: boolean;
    strength: number;
    quality: number;
    bindToBass?: boolean;
  };
  colorMatrix?: {
    enabled: boolean;
    brightness: number;
    saturation: number;
    contrast: number;
    brightnessBind?: boolean;
    saturationBind?: boolean;
    contrastBind?: boolean;
  };
};

export type CanvasElement = {
  id: string;
  name: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  config?: VisualizerConfig;
  shapeConfig?: ShapeConfig;
  textConfig?: TextConfig;
  filters?: FilterConfig;
};
