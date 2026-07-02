import { useEffect, useRef } from 'react';
import usePlaySound from './playsound';

const waitForBeat = (beatDuration, cancelledRef) => new Promise(resolve => {
    const timeoutId = setTimeout(() => {
        clearInterval(pollId);
        resolve();
    }, beatDuration);

    const pollId = setInterval(() => {
        if (cancelledRef.current) {
            clearTimeout(timeoutId);
            clearInterval(pollId);
            resolve();
        }
    }, 40);
});

const getTuneLabel = (timeSignature) => {
    switch (timeSignature) {
        case 'rolls':
            return 'Attack Rolls';
        case '2-4':
            return '2/4 (March, Hornpipe)';
        case '3-4':
            return '3/4 (March)';
        case '4-4':
            return '4/4 (March)';
        case '6-8':
            return '6/8 Jig';
        case '9-8':
            return '9/8 Jig';
        case '3slow':
            return '3/4 Slow Air';
        case '4slow':
            return '4/4 Slow Air';
        case '4str':
            return '4/4 Strathspey';
        case '2-2':
            return '2/2 Reel';
        case '3-2':
            return '3/2 Reel';
        default:
            return timeSignature || '';
    }
};

const MetronomeLogic = ({ dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, onTuneChange, onStopped }) => {
  const play = usePlaySound();
  const onStoppedRef = useRef(onStopped);
    const cancelledRef = useRef(false);

    // Keep ref updated
    useEffect(() => {
        onStoppedRef.current = onStopped;
    }, [onStopped]);

    useEffect(() => {
        cancelledRef.current = false;

        const playMetronome = async () => {
            for (let dropdown of dropdowns) {
                if (cancelledRef.current) break;
                if (onTuneChange) {
                    onTuneChange(getTuneLabel(dropdown.timeSignature));
                }
                let mainLen;
                let preTrans = dropdown.preTransition || 0;
                let postTrans = dropdown.postTransition || 0;
                let beats = 0;
                
                if (dropdown.timeSignature === 'rolls') {
                    mainLen = dropdown.parts * 8;
                    beats = 4;
                }
                else if (dropdown.timeSignature === '2-4') {
                    mainLen = dropdown.parts * 32;
                    beats = 2;
                }
                else if (dropdown.timeSignature === '3-4') {
                    mainLen = dropdown.parts * 48;
                    beats = 3;
                }
                else if (dropdown.timeSignature === '4-4') {
                    mainLen = dropdown.parts * 32;
                    beats = 4;
                }
                else if (dropdown.timeSignature === '6-8') {
                    mainLen = dropdown.parts * 32;
                    beats = 2;
                }
                else if (dropdown.timeSignature === '9-8') {
                    mainLen = dropdown.parts * 48;
                    beats = 3;
                }
                else if (dropdown.timeSignature === '3slow') {
                    mainLen = dropdown.parts * 24;
                    beats = 3;
                }
                else if (dropdown.timeSignature === '4slow') {
                    mainLen = dropdown.parts * 32;
                    beats = 4;
                }
                else if (dropdown.timeSignature === '4str') {
                    mainLen = dropdown.parts * 32;
                    beats = 4;
                }
                else if (dropdown.timeSignature === '2-2') {
                    mainLen = dropdown.parts * 16;
                    beats = 2;
                }
                else if (dropdown.timeSignature === '3-2') {
                    mainLen = dropdown.parts * 24;
                    beats = 3;
                }

                const beatDuration = 60000 / dropdown.bpm;
                const totalLen = preTrans + mainLen + postTrans;

                // Play all beats: pre-transition + main tune + post-transition
                for (let i = 0; i < totalLen; i++) {
                    if (cancelledRef.current) break;
                    play();
                        
                    // Determine which phase we're in and update display accordingly
                    if (i < preTrans) {
                        // Pre-transition phase
                        // If negative, display beats + preTrans (e.g., 4 beats + (-1) = 3)
                        // If positive, cap at beats
                        const displayBeats = preTrans < 0 ? Math.max(1, beats + preTrans) : Math.min(preTrans, beats);
                        onBeatUpdate(i % displayBeats);
                        onUpdateBeatsToDisplay(displayBeats);
                    } else if (i < preTrans + mainLen) {
                        // Main tune phase
                        onBeatUpdate((i - preTrans) % beats);
                        onUpdateBeatsToDisplay(beats);
                    } else {
                        // Post-transition phase
                        // If negative, display beats + postTrans (e.g., 4 beats + (-1) = 3)
                        // If positive, cap at beats
                        const displayBeats = postTrans < 0 ? Math.max(1, beats + postTrans) : Math.min(postTrans, beats);
                        onBeatUpdate((i - preTrans - mainLen) % displayBeats);
                        onUpdateBeatsToDisplay(displayBeats);
                    }

                    // cancellable delay: wait for beatDuration but wake early if cancelled
                    await waitForBeat(beatDuration, cancelledRef);
                }
            }
            // Playback finished naturally - call onStopped
            if (!cancelledRef.current && onStoppedRef.current) {
                onStoppedRef.current();
            }
        };

        playMetronome();
        return () => { cancelledRef.current = true; };
    }, [dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, onTuneChange, play]);

  return null;
};

export default MetronomeLogic;