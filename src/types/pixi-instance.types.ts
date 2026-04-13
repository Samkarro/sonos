import * as PIXI from "pixi.js";

export type PixiInstance = {
  container: PIXI.Container;
  destroy: () => void;
};
