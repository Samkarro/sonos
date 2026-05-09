"use client";
import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";

interface FilterPanelProps {
  element: CanvasElement | null;
  updateFilters: (id: string, filterConfig: FilterConfig) => void;
}

export const FilterPanel = ({ element, updateFilters }: FilterPanelProps) => {
  if (!element) {
    throw new Error("Filter application requires element.");
  }

  const filters = element.filters ?? {};

  const update = (partial: Partial<FilterConfig>) => {
    updateFilters(element?.id, { ...filters, ...partial });
  };

  return (
    <div className="filter-panel">
      <hr />
      <h2 className="filter-panel-heading">Filters</h2>
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
                  bindToBass: filters.blur?.bindToBass ?? false,
                },
              })
            }
          />
        </div>
        {filters.blur?.enabled && (
          <div className="filter-adjustments-container">
            <input
              type="range"
              min={0}
              max={20}
              step={0.1}
              value={filters.blur?.strength ?? 0}
              onChange={(e) =>
                update({
                  blur: {
                    enabled: true,
                    strength: parseFloat(e.target.value),
                    bindToBass: filters.blur?.bindToBass ?? false,
                  },
                })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={filters.blur?.bindToBass ?? false}
                onChange={(e) =>
                  update({
                    blur: {
                      enabled: true,
                      strength: filters.blur?.strength ?? 0,
                      bindToBass: e.target.checked,
                    },
                  })
                }
              />
              Bind to bass
            </label>
          </div>
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
                  bindToBass: filters.bloom?.bindToBass ?? false,
                },
              })
            }
          />
        </div>
        {filters.bloom?.enabled && (
          <div className="filter-adjustments-container">
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
                    bindToBass: filters.bloom?.bindToBass ?? false,
                  },
                })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={filters.bloom?.bindToBass ?? false}
                onChange={(e) =>
                  update({
                    bloom: {
                      enabled: true,
                      strength: filters.bloom?.strength ?? 2,
                      quality: filters.bloom?.quality ?? 4,
                      bindToBass: e.target.checked,
                    },
                  })
                }
              />
              Bind to bass
            </label>
          </div>
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
                  saturation: filters.colorMatrix?.saturation ?? 1,
                  contrast: filters.colorMatrix?.contrast ?? 0,
                  enabled: e.target.checked,
                  brightnessBind: filters.colorMatrix?.brightnessBind ?? false,
                },
              })
            }
          />
        </div>
        {filters.colorMatrix?.enabled && (
          <div className="filter-adjustments-container">
            <label>Brightness</label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={filters.colorMatrix?.brightness ?? 1}
              onChange={(e) =>
                update({
                  colorMatrix: {
                    ...(filters.colorMatrix ?? {
                      enabled: true,
                      saturation: 1,
                      contrast: 0,
                    }),
                    brightness: parseFloat(e.target.value),
                  },
                })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={filters.colorMatrix?.brightnessBind ?? false}
                onChange={(e) =>
                  update({
                    colorMatrix: {
                      ...(filters.colorMatrix ?? {
                        enabled: true,
                        saturation: 1,
                        contrast: 0,
                        brightness: 1,
                      }),
                      brightnessBind: e.target.checked,
                    },
                  })
                }
              />
              Bind to bass
            </label>

            <label>Saturation</label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={filters.colorMatrix?.saturation ?? 1}
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
              step={0.05}
              value={filters.colorMatrix?.contrast ?? 0}
              onChange={(e) =>
                update({
                  colorMatrix: {
                    ...(filters.colorMatrix ?? {
                      enabled: true,
                      brightness: 1,
                      saturation: 1,
                    }),
                    contrast: parseFloat(e.target.value),
                  },
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
