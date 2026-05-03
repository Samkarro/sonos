import { CanvasElement } from "@/types/canvas-element.types";

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
      <div>
        <label>Bars: {config.numBars}</label>
        <input
          type="range"
          min={3}
          max={100}
          step={1}
          value={config.numBars}
          onChange={(e) => updateConfig({ numBars: Number(e.target.value) })}
        />
      </div>

      {/* gap */}
      <div>
        <label>Gap: {config.gap}</label>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={config.gap}
          onChange={(e) => updateConfig({ gap: Number(e.target.value) })}
        />
      </div>

      {/* fill */}
      <div>
        <label>Color</label>
        <input
          type="color"
          value={config.fill}
          onChange={(e) => updateConfig({ fill: e.target.value })}
        />
      </div>
    </>
  );
};
