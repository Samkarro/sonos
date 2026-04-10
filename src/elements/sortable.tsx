import { useSortable } from "@dnd-kit/react/sortable";
import "./styles/sortable.styles.css";
import { Dispatch, SetStateAction } from "react";

interface SortableProps {
  id: number;
  index: number;
  name: string;
  setCanvasElements: Dispatch<
    SetStateAction<
      {
        id: number;
        name: string;
      }[]
    >
  >;
}

export const Sortable = ({
  id,
  index,
  name,
  setCanvasElements,
}: SortableProps) => {
  const { ref, isDragging } = useSortable({ id, index });

  const handleElementDeletion = () => {
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
