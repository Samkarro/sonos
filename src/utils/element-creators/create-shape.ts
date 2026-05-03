import { PixiInstance } from "@/types/pixi-instance.types";
import { ShapeConfig } from "@/types/shape-config.types";
import { CanvasElement } from "@/types/canvas-element.types";
import * as PIXI from "pixi.js";

const drawShape = (
  graphics: PIXI.Graphics,
  config: ShapeConfig,
  width: number,
  height: number,
  fillColor: number,
) => {
  graphics.beginFill(fillColor);
  if (config.shapeType === "rectangle") {
    graphics.drawRoundedRect(0, 0, width, height, config.borderRadius);
  } else if (config.shapeType === "ellipse") {
    graphics.drawEllipse(width / 2, height / 2, width / 2, height / 2);
  }
  graphics.endFill();
};

export const CreateShape = (
  app: PIXI.Application,
  element: CanvasElement,
): PixiInstance => {
  if (!element.shapeConfig) throw new Error("Shape requires shapeConfig");

  const { shapeConfig } = element;
  const container = new PIXI.Container();
  container.x = element.x;
  container.y = element.y;

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

  const update = (updates: Partial<CanvasElement>) => {
    if (updates.x !== undefined) container.x = updates.x;
    if (updates.y !== undefined) container.y = updates.y;

    const needsRedraw =
      updates.width !== undefined ||
      updates.height !== undefined ||
      updates.shapeConfig !== undefined;

    if (needsRedraw) {
      // clear and redraw all children
      container.removeChildren();

      const currentWidth = updates.width ?? element.width;
      const currentHeight = updates.height ?? element.height;
      const currentShapeConfig = { ...shapeConfig, ...updates.shapeConfig };

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
  };

  const destroy = () => {
    container.destroy({ children: true });
  };

  return { container, destroy, update };
};
