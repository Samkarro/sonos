export type AudioAnalyser = {
  audio: HTMLAudioElement;
  context: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
  loadFile: (file: File) => void;
  destroy: () => void;
};

export const createAudioAnalyser = (audio: HTMLAudioElement): AudioAnalyser => {
  const context = new AudioContext();

  const source = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(context.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const loadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    audio.src = url;
  };

  const destroy = () => {
    source.disconnect();
    analyser.disconnect();
    context.close();
  };

  return {
    audio,
    context,
    analyser,
    dataArray,
    bufferLength,
    loadFile,
    destroy,
  };
};
