"use client";
import { useState } from "react";
import "./styles/add-element-section.styles.css";
import "./styles/filter-panel.styles.css";
import { VisualizerCreationTab } from "./tabs/create-vis-tab";
import { ShapeCreationTab } from "./tabs/create-shape-tab";
import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";
import { TextCreationTab } from "./tabs/create-text-tab";
import { FilterPanel } from "./filter-panel";

const TABS = ["visualizer", "shape", "text"] as const;
type Tab = (typeof TABS)[number];

export const AddElementSection = ({
  addElement,
  updateElement,
  selectedElement,
  updateFilters,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
  updateElement?: (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => void;
  selectedElement: CanvasElement | null;
  updateFilters: (id: string, filterConfig: FilterConfig) => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
      <h1 className="add-element-heading">
        {selectedElement ? "Edit Element" : "Create new element"}
      </h1>
      <div className="add-element-tab-button-container">
        {TABS.map((val) => (
          <div
            key={val}
            className={`clickable add-element-tab-button ${val === activeTab ? "tab-button-active" : ""}`}
            onClick={() => {
              setActiveTab(val);
              setShowFilters(false);
            }}
          >
            {val}
          </div>
        ))}
      </div>
      <hr />
      {showFilters && selectedElement ? (
        <FilterPanel element={selectedElement} updateFilters={updateFilters} />
      ) : (
        TAB_COMPONENTS[activeTab]
      )}
      <div
        className={`clickable add-element-tab-button ${showFilters ? "tab-button-active" : ""}`}
        onClick={() => setShowFilters((prev) => !prev)}
      >
        filters
      </div>
      {showFilters && (
        <div
          className="filter-panel-overlay"
          onClick={() => setShowFilters(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterPanel
              element={selectedElement}
              updateFilters={updateFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};
