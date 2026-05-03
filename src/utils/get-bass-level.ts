import { AudioAnalyser } from "./audio-analyzer";

export const getBassLevel = (analyser: AudioAnalyser): number => {
  const bassEnd = Math.floor(analyser.bufferLength * 0.05); // bottom 5%
  let sum = 0;
  for (let i = 0; i < bassEnd; i++) {
    sum += analyser.dataArray[i];
  }
  return sum / bassEnd / 255;
};
