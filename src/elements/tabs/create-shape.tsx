"use client";
import { CanvasElement } from "@/app/page";
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

const SHAPE_TYPES = ["rectangle", "ellipse"] as const;
type ShapeType = (typeof SHAPE_TYPES)[number];

export type ShapeConfig = {
  shapeType: "rectangle" | "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  fill: string;
};

export const ShapeCreationTab = ({
  addElement,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
}) => {
  const [name, setName] = useState("");
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [borderRadius, setBorderRadius] = useState(0);
  const [fill, setFill] = useState("#ffffff");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="creation-tab">
      <div className="grid-2">
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
        <div className="add-element-input-container">
          <label htmlFor="shapeType">Shape Type</label>
          <select
            className="add-element-input"
            name="shapeType"
            value={shapeType}
            onChange={(e) => setShapeType(e.target.value as ShapeType)}
          >
            {SHAPE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid-2">
        <div className="add-element-input-container">
          <label htmlFor="x">X</label>
          <input
            className="add-element-input"
            type="number"
            value={x}
            onChange={(e) => setX(parseInt(e.target.value))}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="y">Y</label>
          <input
            className="add-element-input"
            type="number"
            value={y}
            onChange={(e) => setY(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="grid-4">
        <div className="add-element-input-container">
          <label htmlFor="width">Width</label>
          <input
            className="add-element-input"
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="height">Height</label>
          <input
            className="add-element-input"
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
        </div>
        {shapeType === "rectangle" && (
          <div className="add-element-input-container">
            <label htmlFor="borderRadius">Border Rounding</label>
            <input
              className="add-element-input"
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
            />
          </div>
        )}
        {/* TODO: Refactor this into its own tsx later */}
        <div className="add-element-input-container">
          <label>Color</label>
          <button
            className="color-swatch-button clickable"
            style={{ backgroundColor: fill }}
            onClick={() => setShowPicker((prev) => !prev)}
          />
          {showPicker && (
            <div
              className="color-picker-overlay"
              onClick={(e) => e.stopPropagation()}
              ref={pickerRef}
            >
              <HexColorPicker color={fill} onChange={setFill} />
              <input
                className="add-element-input"
                type="text"
                value={fill}
                onChange={(e) => setFill(e.target.value)}
              />
              <button
                className="clickable"
                onClick={() => setShowPicker(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        className="add-button clickable"
        onClick={() =>
          addElement({
            type: "shape",
            name,
            shapeConfig: { shapeType, x, y, width, height, borderRadius, fill },
          })
        }
      >
        Add
      </button>
    </div>
  );
};
