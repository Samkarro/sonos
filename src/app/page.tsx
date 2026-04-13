"use client";
import { useEffect, useRef, useState } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";
import { createAudioAnalyser } from "@/utils/audio-analyzer";
import { handleRecord } from "@/utils/handle-recording";
import {
  createVisualizer,
  VisualizerConfig,
  VisualizerInstance,
} from "@/utils/create-visualizer";
import { Sortable } from "@/elements/sortable";
import { AddElementSection } from "@/elements/add-element-section";
import { ShapeConfig } from "@/elements/tabs/create-shape";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export type CanvasElement = {
  id: string;
  name: string;
  type: string;
  config?: VisualizerConfig;
  shapeConfig?: ShapeConfig;
};

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<ReturnType<typeof createAudioAnalyser> | null>(
    null,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const visualizerInstancesRef = useRef<Map<string, VisualizerInstance>>(
    new Map(),
  );
  const appRef = useRef<PIXI.Application | null>(null);

  const [audioReady, setAudioReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

  const addElement = (element: Omit<CanvasElement, "id">) => {
    const id = crypto.randomUUID();
    const elementWithId = { ...element, id };

    setCanvasElements((prev) => [...prev, elementWithId]);

    if (
      element.type === "visualizer" &&
      element.config &&
      appRef.current &&
      analyserRef.current
    ) {
      const instance = createVisualizer(
        appRef.current,
        analyserRef.current,
        element.config,
      );
      appRef.current.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    }
  };

  const [showAddElementScreen, setShowAddElementScreen] =
    useState<boolean>(false);

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
    appRef.current = app;

    canvasRef.current.appendChild(app.view as HTMLCanvasElement);

    const analyser = createAudioAnalyser(audioRef.current);
    analyserRef.current = analyser;

    // Create initial visualizer from starting state
    canvasElements.forEach((el) => {
      if (el.type === "visualizer" && el.config) {
        const instance = createVisualizer(app, analyser, el.config);
        app.stage.addChild(instance.container);
        visualizerInstancesRef.current.set(el.id, instance);
      }
    });

    analyser.audio.onplay = () => {
      if (analyser.context.state === "suspended") {
        analyser.context.resume();
      }
    };

    return () => {
      visualizerInstancesRef.current.forEach((v) => v.destroy());
      visualizerInstancesRef.current.clear();
      analyser.destroy();
      app.destroy(true);
    };
  }, []);

  return (
    <div className="view">
      <div className="controls-section-container">
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
          <button
            className="add-element-button"
            onClick={() => setShowAddElementScreen(true)}
          >
            Add Element
          </button>
          <ul className="canvas-element-list">
            {canvasElements.map((item, index) => (
              <Sortable
                key={item.id}
                id={item.id}
                index={index}
                name={item.name}
                setCanvasElements={setCanvasElements}
                visualizerInstancesRef={visualizerInstancesRef}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
      {showAddElementScreen && (
        <div
          className="add-element-section-overlay"
          onClick={() => setShowAddElementScreen(false)}
        >
          <AddElementSection addElement={addElement} />
        </div>
      )}
    </div>
  );
}
