import { CanvasElement } from "@/types/canvas-element.types";

export const EditShape = ({
  element,
  updateElement,
}: {
  element: CanvasElement;
  updateElement: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
}) => {
  const config = element.shapeConfig!;
  const id = element.id;

  const updateConfig = (partial: Partial<typeof config>) => {
    updateElement?.(id, {
      shapeConfig: {
        ...config,
        ...partial,
      },
    });
  };

  return (
    <>
      {/* borderRadius */}
      <div>
        <label>borderRadius: {config.borderRadius}</label>
        <input
          type="range"
          min={0}
          max={element.height / 2}
          step={1}
          value={config.borderRadius}
          onChange={(e) =>
            updateConfig({ borderRadius: Number(e.target.value) })
          }
        />
      </div>
    </>
  );
};
