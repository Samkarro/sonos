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

  const maxRadius = Math.floor(Math.min(element.width, element.height) / 2);

  return (
    <>
      {/* borderRadius */}
      <div>
        <label>borderRadius: {config.borderRadius}</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((config.borderRadius - 0) / (maxRadius - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={0}
          max={maxRadius}
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
