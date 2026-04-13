import { ShapeConfig } from "@/elements/tabs/create-shape";
import { PixiInstance } from "@/types/pixi-instance.types";
import * as PIXI from "pixi.js";

export const CreateShape = (
  app: PIXI.Application,
  config: ShapeConfig,
): PixiInstance => {
  const container = new PIXI.Container();
  container.x = config.x;
  container.y = config.y;

  const graphics = new PIXI.Graphics();
  const fillColor = parseInt(config.fill.replace("#", ""), 16);

  graphics.beginFill(fillColor);

  if (config.shapeType === "rectangle") {
    graphics.drawRoundedRect(
      0,
      0,
      config.width,
      config.height,
      config.borderRadius,
    );
  } else if (config.shapeType === "ellipse") {
    graphics.drawEllipse(0, 0, config.width / 2, config.height / 2);
  }

  graphics.endFill();
  container.addChild(graphics);

  const destroy = () => {
    container.destroy({ children: true });
  };

  return { container, destroy };
};
