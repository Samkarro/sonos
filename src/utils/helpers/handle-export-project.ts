import { CanvasElement } from "@/types/canvas-element.types";

export const exportProject = (canvasElements: CanvasElement[]) => {
  const json = JSON.stringify(canvasElements, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "project.json";
  a.click();

  URL.revokeObjectURL(url);
};
