
"use client"

import { CanvasElement } from "@/app/page";
import { useState } from "react";

export const VisualizerCreationTab = ({
  addElement,
}: {
  addElement: (el: CanvasElement) => void;
}) => {
  const [id, setId] = useState(0);
  const [type, setType] = useState("");
  const [name, setName] = useState("");

  const [numBars, setNumBars] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [gap, setGap] = useState(0);

  return (
    <div className="creation-tab">
      <div className="grid-2">
        <div className="add-element-input-container">
          <label htmlFor="id">ID</label>
          <input
            className="add-element-input"
            type="number"
            name="id"
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="type">type</label>
          <input
            className="add-element-input"
            type="text"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </div>
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
            id,
            type,
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