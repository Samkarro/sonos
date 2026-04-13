"use client";

import { CanvasElement } from "@/types/canvas-element.types";
import { useState } from "react";

const DEFAULTS = {
  BAR_COUNT: 64,
  WIDTH: 1920,
  HEIGHT: 1080,
  GAP: 5,
};

export const VisualizerCreationTab = ({
  addElement,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
}) => {
  const [name, setName] = useState("");

  const [numBars, setNumBars] = useState(DEFAULTS.BAR_COUNT);
  const [width, setWidth] = useState(DEFAULTS.WIDTH);
  const [height, setHeight] = useState(DEFAULTS.HEIGHT);
  const [gap, setGap] = useState(DEFAULTS.GAP);

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
      <button
        className="add-button clickable"
        onClick={() =>
          addElement({
            type: "visualizer",
            name,
            config: { numBars, width, height, gap },
          })
        }
      >
        Add
      </button>
    </div>
  );
};
