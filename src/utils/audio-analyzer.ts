export type AudioAnalyser = {
  audio: HTMLAudioElement;
  context: AudioContext;
  gainNode: GainNode;
  source: MediaElementAudioSourceNode;
  dataArray: Float32Array;
  bufferLength: number;
  loadFile: (file: File) => void;
  destroy: () => void;
};

export const createAudioAnalyser = (audio: HTMLAudioElement): AudioAnalyser => {
  const context = new AudioContext();
  const source = context.createMediaElementSource(audio);
  const gainNode = context.createGain();

  source.connect(gainNode);
  gainNode.connect(context.destination);

  const NUM_BANDS = 32 * 2;
  const bufferLength = NUM_BANDS;
  const dataArray = new Float32Array(NUM_BANDS);

  const minFreq = 20;
  const maxFreq = 20000;

  const filters: BiquadFilterNode[] = [];
  const analysers: AnalyserNode[] = [];

  for (let i = 0; i < NUM_BANDS; i++) {
    const t = i / (NUM_BANDS - 1);
    const freq = minFreq * Math.pow(maxFreq / minFreq, t);

    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 4;

    const analyser = context.createAnalyser();
    analyser.fftSize = 256;

    source.connect(filter);
    filter.connect(analyser);

    filters.push(filter);
    analysers.push(analyser);
  }

  const tempBuffer = new Uint8Array(128);
  const poll = () => {
    for (let i = 0; i < NUM_BANDS; i++) {
      analysers[i].getByteTimeDomainData(tempBuffer);
      let sum = 0;
      for (let j = 0; j < tempBuffer.length; j++) {
        const val = (tempBuffer[j] - 128) / 128;
        sum += val * val;
      }
      dataArray[i] = Math.sqrt(sum / tempBuffer.length);
    }
  };

  const intervalId = setInterval(poll, 1000 / 60);
  const loadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    audio.src = url;
  };

  const destroy = () => {
    clearInterval(intervalId);
    filters.forEach((f) => f.disconnect());
    analysers.forEach((a) => a.disconnect());
    source.disconnect();
    gainNode.disconnect();
    context.close();
  };

  return {
    audio,
    context,
    gainNode,
    source,
    dataArray,
    bufferLength,
    loadFile,
    destroy,
  };
};
