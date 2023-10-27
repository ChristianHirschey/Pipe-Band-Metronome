import App from './App';

function playMetronome(dropdowns, timeSignature, beatsPerMinute, parts) {
    for(let i = 0; i < dropdowns.length; i++) {
        let dropdown = dropdowns[i];
        if(dropdown.timeSignature === '2-4') playSound(dropdown.bpm, (dropdown.parts * 32) + 15); // 8 beats for tempo, 8 for attack roll - 1 at end for transition, 32 per part
        else if(dropdown.timeSignature === '3-4') playSound(dropdown.bpm, (dropdown.parts * 48) + 15); // 8 beats for tempo, 8 for attack roll - 1 at end for transition, 48 per part
        else if(dropdown.timeSignature === '4-4') playSound(dropdown.bpm, (dropdowns.parts * 32) + 15); // 8 beats for tempo, 8 for attack roll - 1 at end for transition, 32 per part
        else if(dropdown.timeSignature === '6-8') playSound(dropdown.bpm, (dropdowns.parts * 32) + 2); // 32 per part + 2 at end for transition
        else if(dropdown.timeSignature === '9-8') playSound(dropdown.bpm, (dropdowns.parts * 24) + 2); // 24 per part + 2 at end for transition
        else if(dropdown.timeSignature === '3slow') playSound(dropdown.bpm, (dropdowns.parts * 24) - 3); // 24 per part - 3 at end for transition
        else if(dropdown.timeSignature === '4slow') playSound(dropdown.bpm, (dropdowns.parts * 32) - 4); // 32 per part - 4 at end for transition to strathspey
        else if(dropdown.timeSignature === '4str') playSound(dropdown.bpm, (dropdowns.parts * 32) + 1); // 32 per part + 1 at end for transition to reel
        else if(dropdown.timeSignature === '2-2') playSound(dropdown.bpm, (dropdowns.parts * 16) + 1); // 16 per part + 1 for transition
        else if(dropdown.timeSignature === '3-2') playSound(dropdown.bpm, (dropdowns.parts * 24) + 1); // 24 per part + 1 for transition
    }
}

function playSound(beatsPerMinute, len) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Create an audio context

  const oscillator = audioContext.createOscillator(); // Create an oscillator node
  oscillator.type = 'square'; // Set oscillator type to square wave (for a click sound)
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Set frequency to 1000 Hz (adjust as needed)
  oscillator.connect(audioContext.destination); // Connect the oscillator to the audio context destination (speakers)

  // Calculate the duration of each beat based on BPM
  const beatDuration = 60000 / beatsPerMinute; // 60,000 ms (1 minute) divided by BPM

  // Play the sound for the specified number of beats (len)
  for (let i = 0; i < len; i++) {
    oscillator.start(audioContext.currentTime + i * beatDuration / 1000); // Start the oscillator at specific times based on beat duration
    oscillator.stop(audioContext.currentTime + (i + 0.5) * beatDuration / 1000); // Stop the oscillator halfway through each beat
  }
}

export default playMetronome;