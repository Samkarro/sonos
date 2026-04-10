"use client";
import { useEffect, useRef, useState } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";
import { createAudioAnalyser } from "@/utils/audio-analyzer";
import { handleRecord } from "@/utils/handle-recording";
import { barHeightCalculator } from "@/utils/calculate-slope";
import { Sortable } from "@/elements/sortable";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<ReturnType<typeof createAudioAnalyser> | null>(
    null,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [audioReady, setAudioReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canvasElements, setCanvasElements] = useState<
    { id: number; name: string }[]
  >([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
  ]);

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !analyserRef.current) return;

    const maxSize = 50 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size exceeds the limit of 50MB.");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    const temp = new Audio(url);

    temp.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);

      if (temp.duration > 15 * 60) {
        alert("Audio length exceeds the limit of 15 minutes.");
        e.target.value = "";
        return;
      }

      analyserRef.current!.loadFile(file);
      setAudioReady(true);
    });
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
    const NUM_BARS = 32 * 2;
    const GAP = 5;
    const barWidth = (CANVAS_WIDTH - GAP * NUM_BARS) / NUM_BARS;
    const smoothed = new Float32Array(NUM_BARS);

    for (let i = 0; i < NUM_BARS; i++) {
      const bar = new PIXI.Graphics();
      bar.x = i * (barWidth + GAP);
      bar.y = CANVAS_HEIGHT;
      bars.push(bar);
      barContainer.addChild(bar);
    }

    app.ticker.add(() => {
      for (let i = 0; i < NUM_BARS; i++) {
        const target = analyser.dataArray[i];
        smoothed[i] = smoothed[i] + (target - smoothed[i]) * 0.1;

        const height = barHeightCalculator(smoothed[i], CANVAS_HEIGHT);
        const bar = bars[i];
        bar.clear();
        bar.beginFill(0xffffff);
        bar.drawRect(0, -height, barWidth - 2, height);
        bar.x = i * (barWidth + GAP);
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
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudio}
          disabled={recording}
        />
        <audio
          ref={audioRef}
          controls={!recording}
          style={{ display: audioReady ? "block" : "none" }}
        />
        <button
          className="record-button"
          style={{ display: audioReady ? "block" : "none" }}
          disabled={recording || !audioReady}
          onClick={() =>
            handleRecord(canvasRef, analyserRef, mediaRecorderRef, setRecording)
          }
        >
          {recording ? "Recording..." : "Record!"}
        </button>
        <div className="canvas-element-list-container">
          <ul className="canvas-element-list">
            {canvasElements.map((item, index) => (
              <Sortable
                key={item.id}
                id={item.id}
                index={index}
                name={item.name}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
    </div>
  );
}
