import { CanvasElement } from "@/types/canvas-element.types";
import { ColorPicker } from "../color-picker";

export const EditVisualizer = ({
  element,
  updateElement,
}: {
  element: CanvasElement;
  updateElement: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
}) => {
  const config = element.config!;
  const id = element.id;

  const updateConfig = (partial: Partial<typeof config>) => {
    updateElement?.(id, {
      config: {
        ...config,
        ...partial,
      },
    });
  };

  return (
    <>
      {/* numBars */}
      <div className="editable-property-input-container">
        <label>Bars: {config.numBars}</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((config.numBars - 3) / (100 - 3)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={3}
          max={100}
          step={1}
          value={config.numBars}
          onChange={(e) => updateConfig({ numBars: Number(e.target.value) })}
        />
      </div>

      {/* gap */}
      <div className="editable-property-input-container">
        <label>Gap: {config.gap}</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((config.gap - 0) / (20 - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={0}
          max={20}
          step={1}
          value={config.gap}
          onChange={(e) => updateConfig({ gap: Number(e.target.value) })}
        />
      </div>

      {/* fill */}
      <div className="editable-property-input-container">
        <label>Color</label>
        <ColorPicker
          color={config.fill}
          onChange={(color) => updateConfig({ fill: color })}
        />
      </div>
    </>
  );
};
