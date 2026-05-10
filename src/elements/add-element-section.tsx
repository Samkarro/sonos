"use client";
import { useState } from "react";
import "./styles/add-element-section.styles.css";
import { VisualizerCreationTab } from "./tabs/create-vis-tab";
import { ShapeCreationTab } from "./tabs/create-shape-tab";
import { CanvasElement } from "@/types/canvas-element.types";
import { TextCreationTab } from "./tabs/create-text-tab";

const TABS = ["visualizer", "shape", "text"] as const;
type Tab = (typeof TABS)[number];

export const AddElementSection = ({
  addElement,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const TAB_COMPONENTS: Record<Tab, React.ReactNode> = {
    visualizer: <VisualizerCreationTab addElement={addElement} />,
    shape: <ShapeCreationTab addElement={addElement} />,
    text: <TextCreationTab addElement={addElement} />,
  };

  return (
    <div
      className="add-element-section-container"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="add-element-heading">Create new element</h1>
      <div className="add-element-tab-button-container">
        {TABS.map((val) => (
          <div
            key={val}
            className={`clickable add-element-tab-button ${val === activeTab ? "tab-button-active" : ""}`}
            onClick={() => setActiveTab(val)}
          >
            {val}
          </div>
        ))}
      </div>
      <hr />
      {TAB_COMPONENTS[activeTab]}
    </div>
  );
};
