import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";

export const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const handleOpen = () => {
    if (swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      setPickerPos({
        top: rect.bottom + window.scrollY + -350,
        left: rect.left + window.scrollX - 40,
      });
    }
    setShowPicker((prev) => !prev);
  };

  return (
    <div className="add-element-input-container">
      <button
        ref={swatchRef}
        className="color-swatch-button clickable"
        style={{ backgroundColor: color }}
        onClick={handleOpen}
      />
      {showPicker &&
        createPortal(
          <div
            className="color-picker-overlay"
            style={{ top: pickerPos.top, left: pickerPos.left }}
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
          </div>,
          document.body,
        )}
    </div>
  );
};
