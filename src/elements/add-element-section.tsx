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
  updateElement,
  selectedElement,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
  updateElement?: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
  selectedElement: CanvasElement | null;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const TAB_COMPONENTS: Record<Tab, React.ReactNode> = {
    visualizer: (
      <VisualizerCreationTab
        addElement={addElement}
        updateElement={updateElement}
        initialValues={
          selectedElement?.type === "visualizer"
            ? {
                id: selectedElement.id,
                name: selectedElement.name,
                config: selectedElement.config!,
              }
            : undefined
        }
      />
    ),
    shape: <ShapeCreationTab addElement={addElement} />,
    text: <TextCreationTab addElement={addElement} />,
  };

  return (
    <div
      className="add-element-section-container"
      onClick={(e) => e.stopPropagation()}
    >
      {/* TODO: verify if putting h1 here is okay for accessibility */}
      <h1 className="add-element-heading">
        {!selectedElement ? "Create" : "Update"} new element
      </h1>
      <div className="add-element-tab-button-container">
        {TABS.map((val) => {
          return (
            <div
              key={val}
              className={`${!selectedElement ? "clickable" : "disabled"} add-element-tab-button ${val === activeTab ? "tab-button-active" : ""}`}
              onClick={() => {
                if (!selectedElement) {
                  setActiveTab(val);
                }
              }}
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
