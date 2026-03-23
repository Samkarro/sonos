"use client";
import { useEffect, useRef } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new PIXI.Application({
      width: 1920,
      height: 1080,
      autoDensity: true,
      resolution: 1,
    });

    canvasRef.current.appendChild(app.view as HTMLCanvasElement);

    return () => {
      app.destroy(true);
    };
  }, []);

  return (
    <div className="view">
      <div className="controls-section-container">Hey</div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
    </div>
  );
}
