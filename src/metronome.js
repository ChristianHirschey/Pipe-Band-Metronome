import usePlaySound from './playsound';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const useMetronome = (dropdowns) => {
  const play = usePlaySound();

  const playMetronome = async () => {
    for(let dropdown of dropdowns) {
      let len;

      let trans = 0;
      if(dropdown.transition != null) trans = dropdown.transition;

      if(dropdown.timeSignature === 'rolls') len = (dropdown.parts * 8) + trans; 
      else if(dropdown.timeSignature === '2-4') len = (dropdown.parts * 32) + trans;
      else if(dropdown.timeSignature === '3-4') len = (dropdown.parts * 48) + trans;
      else if(dropdown.timeSignature === '4-4') len = (dropdown.parts * 32) + trans;
      else if(dropdown.timeSignature === '6-8') len = (dropdown.parts * 32) + trans;
      else if(dropdown.timeSignature === '9-8') len = (dropdown.parts * 24) + trans;
      else if(dropdown.timeSignature === '3slow') len = (dropdown.parts * 24) + trans;
      else if(dropdown.timeSignature === '4slow') len = (dropdown.parts * 32) + trans;
      else if(dropdown.timeSignature === '4str') len = (dropdown.parts * 32) + trans;
      else if(dropdown.timeSignature === '2-2') len = (dropdown.parts * 16) + trans;
      else if(dropdown.timeSignature === '3-2') len = (dropdown.parts * 24) + trans;

      const beatDuration = 60000 / dropdown.bpm;

      for (let i = 0; i < len; i++) {
          play();
          await delay(beatDuration);
      }
    }
  }

  return playMetronome;
}

export default useMetronome;