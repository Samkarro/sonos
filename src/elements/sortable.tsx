import { useSortable } from "@dnd-kit/react/sortable";
import "./styles/sortable.styles.css";
import { Dispatch, RefObject, SetStateAction } from "react";
import { CanvasElement } from "@/app/page";
import { VisualizerInstance } from "@/utils/create-visualizer";

interface SortableProps {
  id: number;
  index: number;
  name: string;
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>;
  visualizerInstancesRef: RefObject<Map<number, VisualizerInstance>>;
}

export const Sortable = ({
  id,
  index,
  name,
  setCanvasElements,
  visualizerInstancesRef,
}: SortableProps) => {
  const { ref, isDragging } = useSortable({ id, index });

  const handleElementDeletion = () => {
    visualizerInstancesRef.current.get(id)?.destroy();
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
          onClick={() => handleElementDeletion()}
          className="canvas-item-list-action-button clickable"
          src="./images/remove.png"
          alt="An X in a circle."
        />
      </div>
    </li>
  );
};
