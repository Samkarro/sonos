"use client";
import { CanvasElement } from "@/types/canvas-element.types";
import { TextConfig } from "@/types/text-config.types";
import { useState } from "react";
import { ColorPicker } from "@/elements/color-picker";

const FONT_WEIGHTS: TextConfig["fontWeight"][] = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "normal",
  "bold",
];

const ALIGN_OPTIONS: TextConfig["align"][] = ["left", "center", "right"];

export const TextCreationTab = ({
  addElement,
}: {
  addElement: (el: Omit<CanvasElement, "id">) => void;
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(32);
  const [fill, setFill] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState<TextConfig["fontWeight"]>("400");
  const [align, setAlign] = useState<TextConfig["align"]>("left");

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
          <label htmlFor="content">Content</label>
          <input
            className="add-element-input"
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
      <div className="grid-2">
        <div className="add-element-input-container">
          <label htmlFor="fontFamily">Font Family</label>
          <input
            className="add-element-input"
            type="text"
            name="fontFamily"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          />
        </div>
        <div className="add-element-input-container">
          <label htmlFor="fontSize">Font Size</label>
          <input
            className="add-element-input"
            type="number"
            name="fontSize"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="grid-3">
        <div className="add-element-input-container">
          <label htmlFor="fontWeight">Font Weight</label>
          <select
            className="add-element-input"
            name="fontWeight"
            value={fontWeight}
            onChange={(e) =>
              setFontWeight(e.target.value as TextConfig["fontWeight"])
            }
          >
            {FONT_WEIGHTS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="add-element-input-container">
          <label htmlFor="align">Align</label>
          <select
            className="add-element-input"
            name="align"
            value={align}
            onChange={(e) => setAlign(e.target.value as TextConfig["align"])}
          >
            {ALIGN_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <ColorPicker color={fill} onChange={setFill} />
      </div>
      <button
        className="add-button clickable"
        onClick={() =>
          addElement({
            type: "text",
            name,
            textConfig: {
              content,
              x,
              y,
              fontFamily,
              fontSize,
              fill,
              fontWeight,
              align,
            },
          })
        }
      >
        Add
      </button>
    </div>
  );
};
