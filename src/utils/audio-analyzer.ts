export type AudioAnalyser = {
  audio: HTMLAudioElement;
  context: AudioContext;
  analyser: AnalyserNode;
  gainNode: GainNode;
  dataArray: Uint8Array;
  source: MediaElementAudioSourceNode;
  bufferLength: number;
  loadFile: (file: File) => void;
  destroy: () => void;
};

export const createAudioAnalyser = (audio: HTMLAudioElement): AudioAnalyser => {
  const context = new AudioContext();

  const source = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  const gainNode = context.createGain();

  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(context.destination);

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
    gainNode,
    dataArray,
    source,
    bufferLength,
    loadFile,
    destroy,
  };
};
