"use client";
import { useEffect, useRef, useState } from "react";
import "./editor.styles.css";
import * as PIXI from "pixi.js";
import { createAudioAnalyser } from "@/utils/audio-analyzer";
import { handleRecord } from "@/utils/helpers/handle-recording";
import { createVisualizer } from "@/utils/element-creators/create-visualizer";
import { Sortable } from "@/elements/sortable";
import { AddElementSection } from "@/elements/add-element-section";
import { CreateShape } from "@/utils/element-creators/create-shape";
import { DragDropProvider } from "@dnd-kit/react";
import { handleAudioUpload } from "@/utils/helpers/handle-audio-upload";
import { handleDragEnd } from "@/utils/helpers/handle-drag-end";
import { PixiInstance } from "@/types/pixi-instance.types";
import { CanvasElement, FilterConfig } from "@/types/canvas-element.types";
import { createText } from "@/utils/element-creators/create-text";
import { EditElementSection } from "@/elements/edit-element-section";

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
  const [selectedFilterElementId, setSelectedFilterElementId] = useState<
    string | null
  >(null);

  const selectedElement =
    canvasElements.find((el) => el.id === selectedElementId) ?? null;

  const addElement = (element: Omit<CanvasElement, "id">) => {
    const id = crypto.randomUUID();
    const fullElement = { ...element, id };

    upsertElement(fullElement, { isNew: true });
  };

  const updateFilters = (id: string, filterConfig: FilterConfig) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, filters: filterConfig } : el)),
    );

    const instance = visualizerInstancesRef.current.get(id);
    if (!instance) return;
    console.log("updateFilters", id, instance, filterConfig); // ← add this
    instance.update?.({
      filters: filterConfig,
    });
  };

  const updateElement = (
    id: string,
    updates: Partial<Omit<CanvasElement, "id">>,
  ) => {
    setCanvasElements((prev) => {
      const existing = prev.find((el) => el.id === id);
      if (!existing) return prev;

      const updated = { ...existing, ...updates };

      const needsRebuild =
        updated.type === "visualizer" &&
        updates.config?.numBars !== undefined &&
        updates.config.numBars !== existing.config?.numBars;

      if (needsRebuild) {
        upsertElement(updated);
      } else {
        const instance = visualizerInstancesRef.current.get(id);
        instance?.update?.(updates);
      }

      return prev.map((el) => (el.id === id ? updated : el));
    });
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

    // Create initial visualizer from starting state TODO: possibly needs removal
    canvasElements.forEach((el) => {
      if (el.type === "visualizer" && el.config) {
        const instance = createVisualizer(app, analyser, el);
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

  const createInstance = (
    app: PIXI.Application,
    analyser: ReturnType<typeof createAudioAnalyser> | null,
    element: CanvasElement,
  ): PixiInstance | null => {
    if (element.type === "visualizer" && element.config && analyser) {
      return createVisualizer(app, analyser, element);
    }

    if (element.type === "shape" && element.shapeConfig) {
      return CreateShape(app, element);
    }

    if (element.type === "text" && element.textConfig) {
      return createText(app, element);
    }

    return null;
  };

  // These two are specifical for visualizers, as they need recreation every time
  const mountInstance = (id: string, instance: PixiInstance) => {
    const app = appRef.current;
    if (!app) return;

    app.stage.addChild(instance.container);
    visualizerInstancesRef.current.set(id, instance);
  };

  const destroyInstance = (id: string) => {
    const existing = visualizerInstancesRef.current.get(id);
    if (existing) {
      existing.destroy();
      visualizerInstancesRef.current.delete(id);
    }
  };

  const upsertElement = (
    element: CanvasElement,
    options?: { isNew?: boolean },
  ) => {
    const app = appRef.current;
    const analyser = analyserRef.current;
    if (!app) return;

    const id = element.id;

    destroyInstance(id);

    const instance = createInstance(app, analyser, element);
    if (instance) {
      mountInstance(id, instance);
    }

    setCanvasElements((prev) => {
      if (options?.isNew) {
        return [element, ...prev];
      }

      return prev.map((el) => (el.id === id ? element : el));
    });
  };

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
                  }}
                  onEditFilters={(id) => setSelectedFilterElementId(id)}
                />
              ))}
            </ul>
          </DragDropProvider>
        </div>
        <div className="canvas-element-editor-container">
          {selectedElementId != null ? (
            <EditElementSection
              updateElement={updateElement}
              updateFilters={updateFilters}
              selectedElement={selectedElement}
            />
          ) : (
            <div>
              <p>There's nothing to edit ;/</p>
            </div>
          )}
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
            updateFilters={updateFilters}
          />
        </div>
      )}
    </div>
  );
}
