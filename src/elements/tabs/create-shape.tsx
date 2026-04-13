"use client";
import { CanvasElement } from "@/types/canvas-element.types";
import { useState } from "react";
import { ColorPicker } from "../color-picker";

const SHAPE_TYPES = ["rectangle", "ellipse"] as const;
type ShapeType = (typeof SHAPE_TYPES)[number];

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
  const [imageSrc, setImageSrc] = useState<string | undefined>();

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
        <ColorPicker color={fill} onChange={setFill} />
        <div className="add-element-input-container">
          <label>Image fill (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setImageSrc(reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>

      <button
        className="add-button clickable"
        onClick={() =>
          addElement({
            type: "shape",
            name,
            shapeConfig: {
              shapeType,
              x,
              y,
              width,
              height,
              borderRadius,
              fill,
              imageSrc,
            },
          })
        }
      >
        Add
      </button>
    </div>
  );
};
