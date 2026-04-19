"use client";
import { useEffect, useRef, useState } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";
import { createAudioAnalyser } from "@/utils/audio-analyzer";
import { handleRecord } from "@/utils/helpers/handle-recording";
import { createVisualizer, VisualizerConfig } from "@/utils/create-visualizer";
import { Sortable } from "@/elements/sortable";
import { AddElementSection } from "@/elements/add-element-section";
import { CreateShape } from "@/utils/create-shape";
import { DragDropProvider } from "@dnd-kit/react";
import { handleAudioUpload } from "@/utils/helpers/handle-audio-upload";
import { handleDragEnd } from "@/utils/helpers/handle-drag-end";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement } from "@/types/canvas-element.types";
import { createText } from "@/utils/create-text";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<ReturnType<typeof createAudioAnalyser> | null>(
    null,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const visualizerInstancesRef = useRef<Map<string, PixiInstance>>(new Map());
  const appRef = useRef<PIXI.Application | null>(null);

  const [audioReady, setAudioReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );

  const selectedElement =
    canvasElements.find((el) => el.id === selectedElementId) ?? null;

  const addElement = (element: Omit<CanvasElement, "id">) => {
    const id = crypto.randomUUID();
    const elementWithId = { ...element, id };

    setCanvasElements((prev) => [elementWithId, ...prev]);

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
    } else if (
      element.type === "shape" &&
      element.shapeConfig &&
      appRef.current
    ) {
      const instance = CreateShape(appRef.current, element.shapeConfig);
      appRef.current.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    } else if (
      element.type === "text" &&
      element.textConfig &&
      appRef.current
    ) {
      const instance = createText(appRef.current, element.textConfig);
      appRef.current.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    }
  };

  const updateElement = (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => {
    const app = appRef.current;
    const analyser = analyserRef.current;
    if (!app) return;

    const existing = canvasElements.find((el) => el.id === id);
    if (!existing) return;

    const updated = { ...existing, ...updates };

    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? updated : el)),
    );

    const existingInstance = visualizerInstancesRef.current.get(id);
    if (existingInstance) {
      existingInstance.destroy();
      visualizerInstancesRef.current.delete(id);
    }

    if (updated.type === "visualizer" && updated.config && analyser) {
      const instance = createVisualizer(app, analyser, updated.config);
      app.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    } else if (updated.type === "shape" && updated.shapeConfig) {
      const instance = CreateShape(app, updated.shapeConfig);
      app.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    } else if (updated.type === "text" && updated.textConfig) {
      const instance = createText(app, updated.textConfig);
      app.stage.addChild(instance.container);
      visualizerInstancesRef.current.set(id, instance);
    }
  };

  const [showAddElementScreen, setShowAddElementScreen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    const app = new PIXI.Application({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      autoDensity: true,
      resolution: 1,
    });
    appRef.current = app;
    app.stage.sortableChildren = true;

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

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const total = canvasElements.length;
    let zIndex = 0;
    canvasElements.forEach((el) => {
      const instance = visualizerInstancesRef.current.get(el.id);
      if (instance) {
        instance.container.zIndex = total - zIndex;
        zIndex++;
      }
    });

    app.stage.sortChildren();
  }, [canvasElements]);

  return (
    <div className="view">
      <div className="controls-section-container">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleAudioUpload(e, analyserRef, setAudioReady)}
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
          <DragDropProvider
            onDragEnd={(e) => handleDragEnd(e, setCanvasElements)}
          >
            <ul className="canvas-element-list">
              {canvasElements.map((item, index) => (
                <Sortable
                  key={item.id}
                  id={item.id}
                  index={index}
                  name={item.name}
                  setCanvasElements={setCanvasElements}
                  visualizerInstancesRef={visualizerInstancesRef}
                  onEdit={(id) => {
                    setSelectedElementId(id);
                    setShowAddElementScreen(true);
                  }}
                />
              ))}
            </ul>
          </DragDropProvider>
        </div>
      </div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
      {showAddElementScreen && (
        <div
          className="add-element-section-overlay"
          onClick={() => {
            setShowAddElementScreen(false);
            setSelectedElementId(null);
          }}
        >
          <AddElementSection
            addElement={addElement}
            updateElement={updateElement}
            selectedElement={selectedElement}
          />
        </div>
      )}
    </div>
  );
}
