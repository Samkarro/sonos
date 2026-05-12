import { CanvasElement } from "@/types/canvas-element.types";
import { Dispatch, SetStateAction } from "react";

export const importProject = (
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>,
  onImported: (elements: CanvasElement[]) => void,
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as CanvasElement[];
        setCanvasElements(parsed);
        onImported(parsed);
      } catch {
        alert("Invalid project file.");
      }
    };
    reader.readAsText(file);
  };

  input.click();
};
