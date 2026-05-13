"use client";

import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";
import { FilterPanel } from "./filter-panel";
import "./styles/filter-panel.styles.css";
import { EditVisualizer } from "./editing-areas/edit-visualizer";
import { EditShape } from "./editing-areas/edit-shape";
import "./styles/edit-element-section.styles.css";

const TYPES = ["visualizer", "shape", "text"] as const;
type Type = (typeof TYPES)[number];

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
  if (!selectedElement) {
    return (
      <div className="missing-element-state">
        <span className="missing-element-state-emote">;P</span>
        <span className="missing-element-state-text">Element deleted</span>
        <span className="missing-element-state-subtext">
          Select a new element to edit.
        </span>
      </div>
    );
  }

  const config = selectedElement.config!;
  const { id, x, y, width, height } = selectedElement;

  // const updateConfig = (partial: Partial<typeof config>) => {
  //   updateElement?.(id, {
  //     config: {
  //       ...config,
  //       ...partial,
  //     },
  //   });
  // };

  const TYPE_COMPONENTS: Record<Type, React.ReactNode> = {
    visualizer: (
      <EditVisualizer element={selectedElement} updateElement={updateElement} />
    ),
    // TODO: add the missing fields that should be editable
    shape: (
      <EditShape element={selectedElement} updateElement={updateElement} />
    ),
    // TODO: Actuall implement this please
    text: <></>,
  };

  // TODO: add color as a default field, fix dimensions,
  return (
    <div className="edit-element-section">
      {/* name */}
      <div className="editable-property-input-container">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={!selectedElement.name ? "" : selectedElement.name}
          maxLength={30}
          onChange={(e) =>
            updateElement(selectedElement.id, { name: e.target.value })
          }
        />
      </div>
      {/* dimensions */}
      <div className="editable-property-input-container">
        <label>x</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((x - 0) / (1920 - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={0}
          max={1920}
          step={1}
          value={x}
          onChange={(e) => updateElement(id, { x: Number(e.target.value) })}
        />
      </div>
      <div className="editable-property-input-container">
        <label>y</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((y - 0) / (1080 - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={0}
          max={1080}
          step={1}
          value={y}
          onChange={(e) => updateElement(id, { y: Number(e.target.value) })}
        />
      </div>
      {/* width */}
      <div className="editable-property-input-container">
        <label>Width: {width}</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((width - 0) / (1920 - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={1}
          max={1920}
          step={10}
          value={width}
          onChange={(e) => updateElement(id, { width: Number(e.target.value) })}
        />
      </div>
      {/* height */}
      <div className="editable-property-input-container">
        <label>Height: {height}</label>
        <input
          className="editable-property-input"
          style={
            {
              "--pct": `${((height - 0) / (1080 - 0)) * 100}%`,
            } as React.CSSProperties
          }
          type="range"
          min={1}
          max={1080}
          step={10}
          value={height}
          onChange={(e) =>
            updateElement(id, { height: Number(e.target.value) })
          }
        />
      </div>
      {/* EXTRAS */}
      {TYPE_COMPONENTS[selectedElement.type]}
      {/* Filters */}
      <FilterPanel
        element={selectedElement}
        updateFilters={updateFilters}
      ></FilterPanel>
    </div>
  );
};
