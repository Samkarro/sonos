import { CanvasElement } from "@/types/canvas-element.types";
import { move } from "@dnd-kit/helpers";
import { Dispatch, SetStateAction } from "react";

export const handleDragEnd = (
  event: any,
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>,
) => {
  setCanvasElements((prev) => move(prev, event));
};
