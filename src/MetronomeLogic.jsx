import { useEffect, useRef } from 'react';
import usePlaySound from './playsound';

const waitForBeat = (beatDuration, isStaleRun) => new Promise(resolve => {
    const timeoutId = setTimeout(() => {
        clearInterval(pollId);
        resolve();
    }, beatDuration);

    const pollId = setInterval(() => {
        if (isStaleRun()) {
            clearTimeout(timeoutId);
            clearInterval(pollId);
            resolve();
        }
    }, 40);
});

const getTuneInfo = (timeSignature) => {
    switch (timeSignature) {
        case 'rolls':
            return { label: 'Attack Rolls', beatsPerPart: 8 };
        case '2-4':
            return { label: '2/4 March', beatsPerPart: 32 };
        case '3-4':
            return { label: '3/4 March', beatsPerPart: 48 };
        case '4-4':
            return { label: '4/4 March', beatsPerPart: 32 };
        case '6-8':
            return { label: '6/8 Jig', beatsPerPart: 32 };
        case '9-8':
            return { label: '9/8 Jig', beatsPerPart: 48 };
        case '3slow':
            return { label: '3/4 Slow Air', beatsPerPart: 24 };
        case '4slow':
            return { label: '4/4 Slow Air', beatsPerPart: 32 };
        case '4str':
            return { label: '4/4 Strathspey', beatsPerPart: 32 };
        case '2-2':
            return { label: '2/2 Reel', beatsPerPart: 16 };
        case '3-2':
            return { label: '3/2 Reel', beatsPerPart: 24 };
        default:
            return { label: timeSignature || '', beatsPerPart: null };
    }
};

const formatTuneLabel = (timeSignature, partNumber = null) => {
    const { label } = getTuneInfo(timeSignature);

    if (!label) {
        return '';
    }

    if (partNumber) {
        return `${label} | Part ${partNumber}`;
    }

    return label;
};

const MetronomeLogic = ({ dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, onTuneChange, onStopped }) => {
  const play = usePlaySound();
  const onStoppedRef = useRef(onStopped);
    const cancelledRef = useRef(false);
        const activeRunIdRef = useRef(0);

    // Keep ref updated
    useEffect(() => {
        onStoppedRef.current = onStopped;
    }, [onStopped]);

    useEffect(() => {
        const runId = activeRunIdRef.current + 1;
        activeRunIdRef.current = runId;
        cancelledRef.current = false;

        const isStaleRun = () => activeRunIdRef.current !== runId || cancelledRef.current;

        const playMetronome = async () => {
            for (let dropdown of dropdowns) {
                if (isStaleRun()) break;
                const tuneInfo = getTuneInfo(dropdown.timeSignature);
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
                    if (isStaleRun()) break;
                    play();

                    if (onTuneChange) {
                        if (i >= preTrans && i < preTrans + mainLen && tuneInfo.beatsPerPart) {
                            const currentPart = Math.floor((i - preTrans) / tuneInfo.beatsPerPart) + 1;
                            onTuneChange(formatTuneLabel(dropdown.timeSignature, currentPart));
                        } else {
                            onTuneChange(formatTuneLabel(dropdown.timeSignature));
                        }
                    }
                        
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
                    await waitForBeat(beatDuration, isStaleRun);
                }
            }
            // Playback finished naturally - call onStopped
            if (!isStaleRun() && onStoppedRef.current) {
                onStoppedRef.current();
            }
        };

        playMetronome();
        return () => {
            cancelledRef.current = true;
            if (activeRunIdRef.current === runId) {
                activeRunIdRef.current += 1;
            }
        };
    }, [dropdowns, onBeatUpdate, onUpdateBeatsToDisplay, onTuneChange, play]);

  return null;
};

export default MetronomeLogic;