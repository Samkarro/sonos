import * as PIXI from "pixi.js";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement } from "@/types/canvas-element.types";
import { AdjustmentFilter, BloomFilter } from "pixi-filters";
import { applyFilters } from "../apply-filters";

export const createText = (
  app: PIXI.Application,
  element: CanvasElement,
): PixiInstance => {
  if (!element.textConfig) throw new Error("Text requires textConfig");

  const { textConfig } = element;
  const container = new PIXI.Container();
  container.x = element.x;
  container.y = element.y;

  // Filter setup
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const adjustments = new AdjustmentFilter();
  const bloom = new BloomFilter();
  container.filters = [blur, bloom, colorMatrix, adjustments];

  const style = new PIXI.TextStyle({
    fontFamily: textConfig.fontFamily,
    fontSize: textConfig.fontSize,
    fill: textConfig.fill,
    fontWeight: textConfig.fontWeight,
    align: textConfig.align,
  });

  const text = new PIXI.Text(textConfig.content, style);
  container.addChild(text);

  const update = (updates: Partial<CanvasElement>) => {
    if (updates.x !== undefined) container.x = updates.x;
    if (updates.y !== undefined) container.y = updates.y;

    if (updates.textConfig) {
      const t = updates.textConfig;
      if (t.content !== undefined) text.text = t.content;
      if (t.fontFamily !== undefined) text.style.fontFamily = t.fontFamily;
      if (t.fontSize !== undefined) text.style.fontSize = t.fontSize;
      if (t.fill !== undefined) text.style.fill = t.fill;
      if (t.fontWeight !== undefined) text.style.fontWeight = t.fontWeight;
      if (t.align !== undefined) text.style.align = t.align;
    }

    if (updates.filters)
      applyFilters(colorMatrix, adjustments, blur, bloom, updates.filters);
  };

  const destroy = () => {
    container.destroy({ children: true });
  };
  applyFilters(colorMatrix, adjustments, blur, bloom, element.filters);

  return { container, destroy, update };
};
