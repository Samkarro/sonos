import { useSortable } from "@dnd-kit/react/sortable";
import "./styles/sortable.styles.css";
import { Dispatch, RefObject, SetStateAction } from "react";
import { CanvasElement } from "@/types/canvas-element.types";
import { PixiInstance } from "@/types/pixi-instance.types";
import { RemoveSvg } from "../../public/images/remove.svg.tsx";
import { EditSvg } from "../../public/images/edit.svg.tsx";

interface SortableProps {
  id: string;
  index: number;
  name: string;
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>;
  visualizerInstancesRef: RefObject<Map<string, PixiInstance>>;
  onEdit: (id: string) => void;
  onEditFilters: (id: string) => void;
  isSelected: boolean;
}

export const Sortable = ({
  id,
  index,
  name,
  setCanvasElements,
  visualizerInstancesRef,
  onEdit,
  isSelected,
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
      className={`canvas-element-list-item ${isDragging ? "dragging" : ""} ${isSelected ? "selected" : ""}`}
    >
      <span>{index + 1}</span>
      <p>{name}</p>
      <div className="canvas-item-list-actions-container">
        <EditSvg onEdit={onEdit} id={id} />
      </div>
      <RemoveSvg handleElementDeletion={handleElementDeletion} />
    </li>
  );
};
