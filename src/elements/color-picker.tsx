import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <div className="add-element-input-container">
      <button
        className="color-swatch-button clickable"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker((prev) => !prev)}
      />
      {showPicker && (
        <div
          className="color-picker-overlay"
          onClick={(e) => e.stopPropagation()}
          ref={pickerRef}
        >
          <HexColorPicker color={color} onChange={onChange} />
          <input
            className="add-element-input"
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
          <button className="clickable" onClick={() => setShowPicker(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};
