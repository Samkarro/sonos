import { CanvasElement } from "@/types/canvas-element.types";

export const EditElementSection = ({
  updateElement,
  selectedElement,
}: {
  updateElement?: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
  selectedElement: CanvasElement | null;
}) => {
  return <div className="edit-element-section">hi :D</div>;
};
