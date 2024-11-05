import React, { useEffect } from 'react';
import usePlaySound from './playsound';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const MetronomeLogic = ({ dropdowns, onBeatUpdate, onUpdateBeatsToDisplay }) => {
  const play = usePlaySound();

  useEffect(() => {
    const playMetronome = async () => {
      for (let dropdown of dropdowns) {
        let len;
        let trans = 0;
        let beats = 0;
        if (dropdown.transition != null) trans = dropdown.transition;
        if (dropdown.timeSignature === 'rolls') {
            len = (dropdown.parts * 8) + trans;
            beats = 4;
        }
        else if (dropdown.timeSignature === '2-4') {
            len = (dropdown.parts * 32) + trans;
            beats = 2;
        }
        else if (dropdown.timeSignature === '3-4') {
            len = (dropdown.parts * 48) + trans;
            beats = 3;
        }
        else if (dropdown.timeSignature === '4-4') {
            len = (dropdown.parts * 32) + trans;
            beats = 4;
        }
        else if (dropdown.timeSignature === '6-8') {
            len = (dropdown.parts * 32) + trans;
            beats = 2;
        }
        else if (dropdown.timeSignature === '9-8') {
            len = (dropdown.parts * 48) + trans;
            beats = 3;
        }
        else if (dropdown.timeSignature === '3slow') {
            len = (dropdown.parts * 24) + trans;
            beats = 3;
        }
        else if (dropdown.timeSignature === '4slow') {
            len = (dropdown.parts * 32) + trans;
            beats = 4;
        }
        else if (dropdown.timeSignature === '4str') {
            len = (dropdown.parts * 32) + trans;
            beats = 4;
        }
        else if (dropdown.timeSignature === '2-2') {
            len = (dropdown.parts * 16) + trans;
            beats = 2;
        }
        else if (dropdown.timeSignature === '3-2') {
            len = (dropdown.parts * 24) + trans;
            beats = 3;
        }

        const beatDuration = 60000 / dropdown.bpm;
        let display = beats;

        for (let i = 0; i < len; i++) {
            play();
            if(trans < 0) trans = beats - trans; // if transition is negative, update to be beats - trans
            if(display === beats) { // only update to transition if hasn't yet updated
                onBeatUpdate(i % beats);
                if(beats >= trans) display = beats < len - i ? beats : trans; // only update to trans if displaybeats is greater than trans
                else display = beats < len - i - beats ? beats : trans; // update sooner if beats < trans
            }
            else onBeatUpdate(i % trans);
            onUpdateBeatsToDisplay(display);
            await delay(beatDuration);
        }
      }
    };

    playMetronome();
  }, [dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, play]);

  return null;
};

export default MetronomeLogic;