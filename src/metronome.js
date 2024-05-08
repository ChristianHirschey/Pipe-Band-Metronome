import usePlaySound from './playsound';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const useMetronome = (dropdowns) => {
  const play = usePlaySound();

  const playMetronome = async () => {
    for(let dropdown of dropdowns) {
        let len;
        if(dropdown.timeSignature === '2-4') len = (dropdown.parts * 32) + 15;
        else if(dropdown.timeSignature === '3-4') len = (dropdown.parts * 48) + 15;
        else if(dropdown.timeSignature === '4-4') len = (dropdown.parts * 32) + 15;
        else if(dropdown.timeSignature === '6-8') len = (dropdown.parts * 32) + 2;
        else if(dropdown.timeSignature === '9-8') len = (dropdown.parts * 24) + 2;
        else if(dropdown.timeSignature === '3slow') len = (dropdown.parts * 24) - 3;
        else if(dropdown.timeSignature === '4slow') len = (dropdown.parts * 32) - 4;
        else if(dropdown.timeSignature === '4str') len = (dropdown.parts * 32) + 1;
        else if(dropdown.timeSignature === '2-2') len = (dropdown.parts * 16) + 1;
        else if(dropdown.timeSignature === '3-2') len = (dropdown.parts * 24) + 1;

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