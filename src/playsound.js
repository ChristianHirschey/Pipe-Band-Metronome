import useSound from 'use-sound';
import metronome from './assets/metronome.wav';

const usePlaySound = () => {
  const [play] = useSound(metronome);
  return play;
};

export default usePlaySound;