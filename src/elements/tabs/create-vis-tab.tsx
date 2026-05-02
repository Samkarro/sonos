"use client";

import { CanvasElement } from "@/types/canvas-element.types";
import { VisualizerConfig } from "@/utils/create-visualizer";
import { useState } from "react";
import { ColorPicker } from "../color-picker";

const DEFAULTS = {
  BAR_COUNT: 64,
  WIDTH: 1920,
  HEIGHT: 1080,
  GAP: 5,
  FILL: "#ffffff",
};

interface VisualizerCreationTabProps {
  addElement?: (el: Omit<CanvasElement, "id">) => void;
  updateElement?: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
  initialValues?: {
    id: string;
    name: string;
    config: VisualizerConfig;
  };
}

export const VisualizerCreationTab = ({
  addElement,
  updateElement,
  initialValues,
}: VisualizerCreationTabProps) => {
  const isEditing = !!initialValues;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [numBars, setNumBars] = useState(
    initialValues?.config.numBars ?? DEFAULTS.BAR_COUNT,
  );
  const [width, setWidth] = useState(
    initialValues?.config.width ?? DEFAULTS.WIDTH,
  );
  const [height, setHeight] = useState(
    initialValues?.config.height ?? DEFAULTS.HEIGHT,
  );
  const [gap, setGap] = useState(initialValues?.config.gap ?? DEFAULTS.GAP);
  const [fill, setFill] = useState(initialValues?.config.fill ?? DEFAULTS.FILL);

  const handleSubmit = () => {
    if (isEditing && updateElement && initialValues) {
      updateElement(initialValues.id, {
        config: { numBars, width, height, gap, fill },
        name,
      });
    } else if (addElement) {
      addElement({
        type: "visualizer",
        name,
        config: { numBars, width, height, gap, fill },
      });
    }
  };

  return (
    <div className="creation-tab">
      <div className="add-element-input-container">
        <label htmlFor="name">Name</label>
        <input
          className="add-element-input"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid-2">
        <div className="add-element-input-container">
          <label htmlFor="num-bars">Amount of Bars</label>
          <input
            className="add-element-input"
            type="number"
            name="num-bars"
            value={numBars}
            onChange={(e) => setNumBars(parseInt(e.target.value))}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="gap">Gap Between Bars</label>
          <input
            className="add-element-input"
            type="number"
            name="gap"
            value={gap}
            onChange={(e) => setGap(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="grid-2">
        <div className="add-element-input-container">
          <label htmlFor="width">Container Width</label>
          <input
            className="add-element-input"
            type="number"
            name="width"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="height">Container Height</label>
          <input
            className="add-element-input"
            type="number"
            name="height"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
        </div>
      </div>
      <ColorPicker color={fill} onChange={setFill} />
      <button className="add-button clickable" onClick={handleSubmit}>
        {isEditing ? "Update" : "Add"}
      </button>
    </div>
  );
};
