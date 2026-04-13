import { Dispatch, RefObject, SetStateAction } from "react";
import { AudioAnalyser } from "../audio-analyzer";

export const handleAudioUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  analyserRef: RefObject<AudioAnalyser | null>,
  setAudioReady: Dispatch<SetStateAction<boolean>>,
) => {
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
