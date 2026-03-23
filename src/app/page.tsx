"use client";
import { useEffect, useRef } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";
import { createAudioAnalyser } from "@/utils/audio-analyzer";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<ReturnType<typeof createAudioAnalyser> | null>(
    null,
  );

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !analyserRef.current) return;

    analyserRef.current.loadFile(file);
  };

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    const app = new PIXI.Application({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      autoDensity: true,
      resolution: 1,
    });

    canvasRef.current.appendChild(app.view as HTMLCanvasElement);

    const barContainer = new PIXI.Container();
    app.stage.addChild(barContainer);

    const analyser = createAudioAnalyser(audioRef.current);
    analyserRef.current = analyser;

    const bars: PIXI.Graphics[] = [];
    const barWidth = CANVAS_WIDTH / analyser.bufferLength;

    for (let i = 0; i < analyser.bufferLength; i++) {
      const bar = new PIXI.Graphics();
      bar.x = i * barWidth;
      bar.y = CANVAS_HEIGHT;
      bars.push(bar);
      barContainer.addChild(bar);
    }

    app.ticker.add(() => {
      analyser.analyser.getByteFrequencyData(
        analyser.dataArray as Uint8Array<ArrayBuffer>,
      );

      for (let i = 0; i < analyser.bufferLength; i++) {
        const value = analyser.dataArray[i];
        const height = (value / 255) * CANVAS_HEIGHT;

        const bar = bars[i];
        bar.clear();
        bar.beginFill(0xffffff);
        bar.drawRect(0, -height, barWidth - 2, height);
        bar.endFill();
      }
    });

    analyser.audio.onplay = () => {
      if (analyser.context.state === "suspended") {
        analyser.context.resume();
      }
    };

    return () => {
      analyser.destroy();
      app.destroy(true);
    };
  }, []);

  return (
    <div className="view">
      <div className="controls-section-container">
        Hey
        <input type="file" accept="audio/" onChange={handleAudio} />
        {audioRef != null && <audio ref={audioRef} controls></audio>}
      </div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
    </div>
  );
}
