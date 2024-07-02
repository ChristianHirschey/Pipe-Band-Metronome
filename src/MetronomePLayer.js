import React from 'react';
import useMetronome from './metronome';
import doRolls from './App';

const MetronomePlayer = ({ dropdowns }) => {
  const playMetronome = useMetronome(dropdowns, doRolls);

  const handlePlaySound = () => {
    playMetronome();
  };

  return (
    <div>
      <button onClick={handlePlaySound}>Play</button>
    </div>
  );
}

export default MetronomePlayer;
