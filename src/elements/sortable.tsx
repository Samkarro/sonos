import { useSortable } from "@dnd-kit/react/sortable";

interface SortableProps {
  id: number;
  index: number;
  name: string;
}

export const Sortable = ({ id, index, name }: SortableProps) => {
  const { ref } = useSortable({ id, index });

  return (
    <li ref={ref} className="canvas-element-list-item">
      {name}
    </li>
  );
};
