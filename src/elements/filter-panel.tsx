"use client";
import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";

interface FilterPanelProps {
  element: CanvasElement;
  updateFilters: (id: string, filterConfig: FilterConfig) => void;
}

export const FilterPanel = ({ element, updateFilters }: FilterPanelProps) => {
  const filters = element.filters ?? {};

  const update = (partial: Partial<FilterConfig>) => {
    updateFilters(element.id, { ...filters, ...partial });
  };

  return (
    <div className="creation-tab">
      {/* Blur */}
      <div className="filter-section">
        <div className="filter-header">
          <label>Blur</label>
          <input
            type="checkbox"
            checked={filters.blur?.enabled ?? false}
            onChange={(e) =>
              update({
                blur: {
                  strength: filters.blur?.strength ?? 0,
                  enabled: e.target.checked,
                },
              })
            }
          />
        </div>
        {filters.blur?.enabled && (
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={filters.blur?.strength ?? 0}
            onChange={(e) =>
              update({
                blur: { enabled: true, strength: parseFloat(e.target.value) },
              })
            }
          />
        )}
      </div>

      {/* Bloom */}
      <div className="filter-section">
        <div className="filter-header">
          <label>Bloom</label>
          <input
            type="checkbox"
            checked={filters.bloom?.enabled ?? false}
            onChange={(e) =>
              update({
                bloom: {
                  strength: filters.bloom?.strength ?? 2,
                  quality: filters.bloom?.quality ?? 4,
                  enabled: e.target.checked,
                },
              })
            }
          />
        </div>
        {filters.bloom?.enabled && (
          <>
            <label>Strength</label>
            <input
              type="range"
              min={0}
              max={20}
              step={0.1}
              value={filters.bloom?.strength ?? 2}
              onChange={(e) =>
                update({
                  bloom: {
                    enabled: true,
                    quality: filters.bloom?.quality ?? 4,
                    strength: parseFloat(e.target.value),
                  },
                })
              }
            />
            <label>Quality</label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={filters.bloom?.quality ?? 4}
              onChange={(e) =>
                update({
                  bloom: {
                    enabled: true,
                    strength: filters.bloom?.strength ?? 2,
                    quality: parseInt(e.target.value),
                  },
                })
              }
            />
          </>
        )}
      </div>

      {/* Color Matrix */}
      <div className="filter-section">
        <div className="filter-header">
          <label>Color Adjustments</label>
          <input
            type="checkbox"
            checked={filters.colorMatrix?.enabled ?? false}
            onChange={(e) =>
              update({
                colorMatrix: {
                  brightness: filters.colorMatrix?.brightness ?? 1,
                  saturation: filters.colorMatrix?.saturation ?? 0,
                  contrast: filters.colorMatrix?.contrast ?? 0,
                  enabled: e.target.checked,
                },
              })
            }
          />
        </div>
        {filters.colorMatrix?.enabled && (
          <>
            <label>Brightness</label>
            <input
              type="range"
              min={0}
              max={3}
              step={0.01}
              value={filters.colorMatrix?.brightness ?? 1}
              onChange={(e) =>
                update({
                  colorMatrix: {
                    ...(filters.colorMatrix ?? {
                      enabled: true,
                      saturation: 0,
                      contrast: 0,
                    }),
                    brightness: parseFloat(e.target.value),
                  },
                })
              }
            />
            <label>Saturation</label>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={filters.colorMatrix?.saturation ?? 0}
              onChange={(e) =>
                update({
                  colorMatrix: {
                    ...(filters.colorMatrix ?? {
                      enabled: true,
                      brightness: 1,
                      contrast: 0,
                    }),
                    saturation: parseFloat(e.target.value),
                  },
                })
              }
            />
            <label>Contrast</label>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={filters.colorMatrix?.contrast ?? 0}
              onChange={(e) =>
                update({
                  colorMatrix: {
                    ...(filters.colorMatrix ?? {
                      enabled: true,
                      brightness: 1,
                      saturation: 0,
                    }),
                    contrast: parseFloat(e.target.value),
                  },
                })
              }
            />
          </>
        )}
      </div>
    </div>
  );
};
