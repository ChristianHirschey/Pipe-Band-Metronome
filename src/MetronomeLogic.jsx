import { useEffect, useRef } from 'react';
import usePlaySound from './playsound';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const MetronomeLogic = ({ dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, onStopped }) => {
  const play = usePlaySound();
  const onStoppedRef = useRef(onStopped);

    // Keep ref updated
    useEffect(() => {
        onStoppedRef.current = onStopped;
    }, [onStopped]);

    useEffect(() => {
        let cancelled = false;

        const playMetronome = async () => {
            for (let dropdown of dropdowns) {
                if (cancelled) break;
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
                    if (cancelled) break;
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
                    await Promise.race([
                        delay(beatDuration),
                        new Promise(res => {
                            const check = () => cancelled ? res() : setTimeout(check, 40);
                            check();
                        })
                    ]);
                }
            }
            // Playback finished naturally - call onStopped
            if (!cancelled && onStoppedRef.current) {
                onStoppedRef.current();
            }
        };

        playMetronome();
        return () => { cancelled = true; };
    }, [dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, play]);

  return null;
};

export default MetronomeLogic;