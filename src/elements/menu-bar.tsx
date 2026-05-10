"use client";
import { useEffect, useRef, useState } from "react";
import "./styles/menu-bar.styles.css";

interface MenuBarProps {
  onReset: () => void;
  onUploadAudio: () => void;
  onImport: () => void;
  onExport: () => void;
}

export const MenuBar = ({
  onReset,
  onUploadAudio,
  onImport,
  onExport,
}: MenuBarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (menu: string) =>
    setOpenMenu((prev) => (prev === menu ? null : menu));

  const action = (fn: () => void) => {
    fn();
    setOpenMenu(null);
  };

  return (
    <div className="menu-bar" ref={barRef}>
      <div className="menu-bar-item">
        <button
          className={`menu-bar-trigger ${openMenu === "file" ? "menu-bar-trigger--active" : ""}`}
          onClick={() => toggle("file")}
        >
          File
        </button>
        {openMenu === "file" && (
          <div className="menu-dropdown">
            <button
              className="menu-dropdown-item menu-dropdown-item--danger"
              onClick={() => action(onReset)}
            >
              Reset all elements
            </button>
            <div className="menu-dropdown-separator" />
            <button
              className="menu-dropdown-item"
              onClick={() => action(onUploadAudio)}
            >
              Upload audio file
            </button>
            <div className="menu-dropdown-separator" />
            <button
              className="menu-dropdown-item"
              onClick={() => action(onImport)}
            >
              Import project
            </button>
            <button
              className="menu-dropdown-item"
              onClick={() => action(onExport)}
            >
              Export project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
