import { Dispatch, RefObject, SetStateAction } from "react";
import { AudioAnalyser } from "../audio-analyzer";

export const handleRecord = async (
  canvasRef: RefObject<HTMLDivElement | null>,
  analyserRef: RefObject<AudioAnalyser | null>,
  mediaRecorderRef: RefObject<MediaRecorder | null>,
  setRecording: Dispatch<SetStateAction<boolean>>,
) => {
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
