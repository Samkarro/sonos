"use client";

import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";
import { FilterPanel } from "./filter-panel";

export const EditElementSection = ({
  updateElement,
  updateFilters,
  selectedElement,
}: {
  updateElement: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
  updateFilters: (id: string, filterConfig: FilterConfig) => void;
  selectedElement: CanvasElement | null;
}) => {
  if (!selectedElement || selectedElement.type !== "visualizer") {
    return <div className="edit-element-section">Deleted ;p</div>;
  }

  const config = selectedElement.config!;
  const id = selectedElement.id;

  const updateConfig = (partial: Partial<typeof config>) => {
    updateElement?.(id, {
      config: {
        ...config,
        ...partial,
      },
    });
  };

  return (
    <div className="edit-element-section">
      {/* name */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={!selectedElement.name ? "" : selectedElement.name}
          onChange={(e) =>
            updateElement(selectedElement.id, { name: e.target.value })
          }
        />
      </div>
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
      {/* width */}
      <div>
        <label>Width: {config.width}</label>
        <input
          type="range"
          min={1}
          max={1920}
          step={10}
          value={config.width}
          onChange={(e) => updateConfig({ width: Number(e.target.value) })}
        />
      </div>
      {/* height */}
      <div>
        <label>Height: {config.height}</label>
        <input
          type="range"
          min={1}
          max={1080}
          step={10}
          value={config.height}
          onChange={(e) => updateConfig({ height: Number(e.target.value) })}
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
      <FilterPanel
        element={selectedElement}
        updateFilters={updateFilters}
      ></FilterPanel>
    </div>
  );
};
