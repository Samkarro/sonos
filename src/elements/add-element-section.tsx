"use client";
import { Dispatch, SetStateAction, useState } from "react";
import "./styles/add-element-section.styles.css";
import { CanvasElement } from "@/app/page";

const TABS = ["visualizer", "misc"] as const;
type Tab = (typeof TABS)[number];

const VisualizerCreationTab = () => {
  return <div className="visualizer-creation-tab">Vis</div>;
};

const MiscCreationTab = ({
  setCanvasElements,
}: {
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>;
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
        onClick={() =>
          setCanvasElements((prev) => [...prev, { id, type, name }])
        }
      >
        Add
      </button>
    </div>
  );
};

export const AddElementSection = ({
  setCanvasElements,
}: {
  setCanvasElements: Dispatch<SetStateAction<CanvasElement[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const TAB_COMPONENTS: Record<Tab, React.ReactNode> = {
    visualizer: <VisualizerCreationTab />,
    misc: <MiscCreationTab setCanvasElements={setCanvasElements} />,
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
