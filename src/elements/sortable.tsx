import { useSortable } from "@dnd-kit/react/sortable";
import "./styles/sortable.styles.css";
import { Dispatch, RefObject, SetStateAction } from "react";
import { CanvasElement } from "@/types/canvas-element.types";
import { PixiInstance } from "@/types/pixi-instance.types";

interface SortableProps {
  id: string;
  index: number;
  name: string;
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>;
  visualizerInstancesRef: RefObject<Map<string, PixiInstance>>;
  onEdit: (id: string) => void;
}

export const Sortable = ({
  id,
  index,
  name,
  setCanvasElements,
  visualizerInstancesRef,
  onEdit,
}: SortableProps) => {
  const { ref, isDragging } = useSortable({ id, index });

  const handleElementDeletion = () => {
    visualizerInstancesRef.current.get(id)?.destroy();
    visualizerInstancesRef.current.delete(id);
    setCanvasElements((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <li
      ref={ref}
      className={`canvas-element-list-item ${isDragging ? "dragging" : ""}`}
    >
      <p>{name}</p>
      <div className="canvas-item-list-actions-container">
        <img
          onClick={() => onEdit(id)}
          className="canvas-item-list-action-button clickable"
          src="./images/edit.png"
          alt="Edit Element."
        />
      </div>
      <div className="canvas-item-list-actions-container">
        <img
          onClick={() => handleElementDeletion()}
          className="canvas-item-list-action-button clickable"
          src="./images/remove.png"
          alt="Delete Element."
        />
      </div>
    </li>
  );
};
