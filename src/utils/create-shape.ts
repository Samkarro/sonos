import { PixiInstance } from "@/types/pixi-instance.types";
import { ShapeConfig } from "@/types/shape-config.types";
import * as PIXI from "pixi.js";

const drawShape = (
  graphics: PIXI.Graphics,
  config: ShapeConfig,
  fillColor: number,
) => {
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
    graphics.drawEllipse(
      config.width / 2,
      config.height / 2,
      config.width / 2,
      config.height / 2,
    );
  }
  graphics.endFill();
};

export const CreateShape = (
  app: PIXI.Application,
  config: ShapeConfig,
): PixiInstance => {
  const container = new PIXI.Container();
  container.x = config.x;
  container.y = config.y;

  if (config.imageSrc) {
    const texture = PIXI.Texture.from(config.imageSrc);
    const sprite = new PIXI.Sprite(texture);
    sprite.width = config.width;
    sprite.height = config.height;

    const mask = new PIXI.Graphics();
    drawShape(mask, config, 0xffffff);

    sprite.mask = mask;
    container.addChild(sprite);
    container.addChild(mask);
  } else {
    const graphics = new PIXI.Graphics();
    const fillColor = parseInt(config.fill.replace("#", ""), 16);
    drawShape(graphics, config, fillColor);
    container.addChild(graphics);
  }

  const destroy = () => {
    container.destroy({ children: true });
  };

  return { container, destroy };
};
