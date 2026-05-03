import * as PIXI from "pixi.js";
import { PixiInstance } from "@/types/pixi-instance.types";
import { TextConfig } from "@/types/text-config.types";

export const createText = (
  app: PIXI.Application,
  config: TextConfig,
): PixiInstance => {
  const container = new PIXI.Container();
  container.x = config.x;
  container.y = config.y;

  const style = new PIXI.TextStyle({
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    fill: config.fill,
    fontWeight: config.fontWeight,
    align: config.align,
  });

  const text = new PIXI.Text(config.content, style);
  container.addChild(text);

  const destroy = () => {
    container.destroy({ children: true });
  };

  return { container, destroy };
};
