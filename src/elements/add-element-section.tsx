"use client";
import { useState } from "react";
import "./styles/add-element-section.styles.css";
import { VisualizerCreationTab } from "./tabs/create-vis";
import { ShapeCreationTab } from "./tabs/create-shape";
import { CanvasElement } from "@/types/canvas-element.types";

const TABS = ["visualizer", "shape"] as const;
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
