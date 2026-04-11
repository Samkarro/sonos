"use client";
import { Dispatch, SetStateAction, useState } from "react";
import "./styles/add-element-section.styles.css";
import { CanvasElement } from "@/app/page";

const TABS = ["visualizer", "misc"] as const;
type Tab = (typeof TABS)[number];

const VisualizerCreationTab = ({
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

const MiscCreationTab = ({
  addElement,
}: {
  addElement: (el: CanvasElement) => void;
}) => {
  const [id, setId] = useState(0);
  const [type, setType] = useState("");
  const [name, setName] = useState("");

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
      <button
        className="add-button clickable"
        onClick={() => addElement({ id, type, name })}
      >
        Add
      </button>
    </div>
  );
};

export const AddElementSection = ({
  addElement,
}: {
  addElement: (el: CanvasElement) => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const TAB_COMPONENTS: Record<Tab, React.ReactNode> = {
    visualizer: <VisualizerCreationTab addElement={addElement} />,
    misc: <MiscCreationTab addElement={addElement} />,
  };

  return (
    <div
      className="add-element-section-container"
      onClick={(e) => e.stopPropagation()}
    >
      {/* TODO: verify if putting h1 here is okay for accessibility */}
      <h1 className="add-element-heading">Create new element</h1>
      <div className="add-element-tab-button-container">
        {TABS.map((val) => {
          return (
            <div
              key={val}
              className={`clickable add-element-tab-button ${val === activeTab ? "tab-button-active" : ""}`}
              onClick={() => setActiveTab(val)}
            >
              {val}
            </div>
          );
        })}
      </div>
      <hr />
      {TAB_COMPONENTS[activeTab]}
    </div>
  );
};
