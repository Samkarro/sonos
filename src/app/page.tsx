"use client";
import { useEffect, useRef, useState } from "react";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [audioReady, setAudioReady] = useState(false);
  const [recording, setRecording] = useState(false);

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
    const barWidth = (CANVAS_WIDTH / analyser.bufferLength) * 0.95;

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

      for (let i = 0; i < analyser.bufferLength - 30; i++) {
        const value = analyser.dataArray[i];
        const height = 2 + (value / 255) * (CANVAS_HEIGHT * 0.8);

        const bar = bars[i];
        bar.clear();
        bar.beginFill(0xffffff);
        bar.drawRect(0, -height, barWidth - 2, height);
        bar.x = i * (barWidth + 5);
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

  const handleRecord = async () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    const analyser = analyserRef.current;
    if (!canvas || !analyser) {
      alert(
        "Audio not loaded! Please upload audio.\nIf you have it uploaded, reload the page and try again.",
      );
      return;
    }

    setRecording(true);

    const canvasStream = canvas.captureStream(60);

    const destination = analyser.context.createMediaStreamDestination();
    analyser.source.connect(destination);
    const audioStream = destination.stream;

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      analyser.source.disconnect(destination);
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.webm";
      a.click();
      URL.revokeObjectURL(url);
      setRecording(false);
    };

    analyser.gainNode.gain.value = 0;
    analyser.audio.currentTime = 0;

    recorder.start();
    try {
      await analyser.audio.play();
    } catch (err) {
      recorder.stop();
      setRecording(false);
      alert("Playback failed, recording cancelled.");
    }

    analyser.audio.onended = () => {
      recorder.stop();
      analyser.gainNode.gain.value = 1;
    };
  };

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
          onClick={handleRecord}
        >
          {recording ? "Recording..." : "Record!"}
        </button>
      </div>
      <div className="canvas-section-container">
        <div className="canvas-container" ref={canvasRef}></div>
      </div>
    </div>
  );
}
