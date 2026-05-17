import { PixiInstance } from "@/types/pixi-instance.types";
import { ShapeConfig } from "@/types/shape-config.types";
import { CanvasElement } from "@/types/canvas-element.types";
import * as PIXI from "pixi.js";
import { applyFilters } from "../apply-filters";
import { AdjustmentFilter, BloomFilter } from "pixi-filters";
import { getBassLevel } from "../get-bass-level";
import { AudioAnalyser } from "../audio-analyzer";
import { barHeightCalculator } from "../calculate-slope";

const drawShape = (
  graphics: PIXI.Graphics,
  config: ShapeConfig,
  width: number,
  height: number,
  fillColor: number,
) => {
  const maxRadius = Math.min(width, height) / 2;
  const clampedRadius = Math.min(config.borderRadius, maxRadius);

  graphics.beginFill(fillColor);
  if (config.shapeType === "rectangle") {
    graphics.drawRoundedRect(0, 0, width, height, clampedRadius);
  } else if (config.shapeType === "ellipse") {
    graphics.drawEllipse(width / 2, height / 2, width / 2, height / 2);
  }
  graphics.endFill();
};

export const CreateShape = (
  app: PIXI.Application,
  element: CanvasElement,
  analyser: AudioAnalyser | null,
): PixiInstance => {
  if (!element.shapeConfig) throw new Error("Shape requires shapeConfig");

  const { shapeConfig } = element;
  const container = new PIXI.Container();
  container.x = element.x;
  container.y = element.y;

  // Filter setup
  const blur = new PIXI.BlurFilter();
  const colorMatrix = new PIXI.ColorMatrixFilter();
  const adjustments = new AdjustmentFilter();
  const bloom = new BloomFilter();
  container.filters = [blur, bloom, colorMatrix, adjustments];

  if (shapeConfig.imageSrc) {
    const texture = PIXI.Texture.from(shapeConfig.imageSrc);
    const sprite = new PIXI.Sprite(texture);
    sprite.width = element.width;
    sprite.height = element.height;

    const mask = new PIXI.Graphics();
    drawShape(mask, shapeConfig, element.width, element.height, 0xffffff);

    sprite.mask = mask;
    container.addChild(sprite);
    container.addChild(mask);
  } else {
    const graphics = new PIXI.Graphics();
    const fillColor = parseInt(shapeConfig.fill.replace("#", ""), 16);
    drawShape(graphics, shapeConfig, element.width, element.height, fillColor);
    container.addChild(graphics);
  }

  let currentFilters = element.filters;
  let currentWidth = element.width;
  let currentHeight = element.height;
  let currentShapeConfig = { ...element.shapeConfig };

  const bassTick = () => {
    if (!currentFilters || !analyser) return;
    const bass = getBassLevel(analyser);

    if (currentFilters.blur?.enabled && currentFilters.blur.bindToBass) {
      blur.blur = barHeightCalculator(
        currentFilters.blur.strength * bass * 5 * 3,
        currentHeight,
      );
    }
    if (currentFilters.bloom?.enabled && currentFilters.bloom.bindToBass) {
      bloom.blur = barHeightCalculator(
        currentFilters.bloom.strength * bass * 5 * 3,
        currentHeight,
      );
    }
    if (
      currentFilters.colorMatrix?.enabled &&
      currentFilters.colorMatrix.brightnessBind
    ) {
      adjustments.brightness = barHeightCalculator(
        currentFilters.colorMatrix.brightness * (0.0 + bass * 5),
        currentHeight,
      );
    }
  };

  app.ticker.add(bassTick);

  const update = (updates: Partial<CanvasElement>) => {
    if (updates.x !== undefined) container.x = updates.x;
    if (updates.y !== undefined) container.y = updates.y;

    const needsRedraw =
      updates.width !== undefined ||
      updates.height !== undefined ||
      updates.shapeConfig !== undefined;

    if (needsRedraw) {
      if (updates.width !== undefined) currentWidth = updates.width;
      if (updates.height !== undefined) currentHeight = updates.height;
      if (updates.shapeConfig !== undefined) {
        currentShapeConfig = { ...currentShapeConfig, ...updates.shapeConfig };
      }

      container.removeChildren();

      if (currentShapeConfig.imageSrc) {
        const texture = PIXI.Texture.from(currentShapeConfig.imageSrc);
        const sprite = new PIXI.Sprite(texture);
        sprite.width = currentWidth;
        sprite.height = currentHeight;
        const mask = new PIXI.Graphics();
        drawShape(
          mask,
          currentShapeConfig,
          currentWidth,
          currentHeight,
          0xffffff,
        );
        sprite.mask = mask;
        container.addChild(sprite);
        container.addChild(mask);
      } else {
        const graphics = new PIXI.Graphics();
        const fillColor = parseInt(
          currentShapeConfig.fill.replace("#", ""),
          16,
        );
        drawShape(
          graphics,
          currentShapeConfig,
          currentWidth,
          currentHeight,
          fillColor,
        );
        container.addChild(graphics);
      }
    }

    if (updates.filters) {
      currentFilters = updates.filters;
      applyFilters(colorMatrix, adjustments, blur, bloom, updates.filters);
    }
  };

  const destroy = () => {
    app.ticker.remove(bassTick);
    container.destroy({ children: true });
  };
  applyFilters(colorMatrix, adjustments, blur, bloom, element.filters);
  return { container, destroy, update };
};
