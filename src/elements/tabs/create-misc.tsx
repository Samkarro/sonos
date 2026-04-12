"use client";
import { CanvasElement } from "@/app/page";
import { useState } from "react";

export const MiscCreationTab = ({
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
