import React, { useState } from 'react';
import './App.css';
import MetronomePlayer from './MetronomePLayer';

function App() {
  const [dropdowns, setDropdowns] = useState([{ id: 1, timeSignature: 'rolls', bpm: null, parts: 1, transition: 4 }]);

  const addDropdown = () => {
    const newId = dropdowns.length + 1;
    setDropdowns([...dropdowns, { id: newId, timeSignature: '2-4', bpm: null, parts: null, transition: null }]);
  };

  const removeDropdown = (id) => {
    const updatedDropdowns = dropdowns.filter((dropdown) => dropdown.id !== id);
    setDropdowns(updatedDropdowns);
  };

  const handleDropdownChange = (id, field, value) => {
    setDropdowns(dropdowns.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="App">
       <div className="Header">
        <header>
          <h1>Pipe Band Metronome</h1>
        </header>
      </div>
      <main>
        <div className="Dropdowns">
          {dropdowns.map((dropdown) => (
            <div key={dropdown.id} className="DropdownItem">
              <select
                value={dropdown.timeSignature}
                onChange={(e) => handleDropdownChange(dropdown.id, 'timeSignature', e.target.value)}
                className='select'
              >
                <option value="rolls">Attack Rolls</option>
                <option value="2-4">2/4 (March, Hornpipe)</option>
                <option value="3-4">3/4 (March)</option>
                <option value="4-4">4/4 (March)</option>
                <option value="6-8">6/8 Jig</option>
                <option value="9-8">9/8 Jig</option>
                <option value="3slow">3/4 Slow Air</option>
                <option value="4slow">4/4 Slow Air</option>
                <option value="4str">4/4 Strathspey</option>
                <option value="2-2">2/2 Reel</option>
                <option value="3-2">3/2 Reel</option>
              </select>
              <div className='text-boxes'>
                <input
                  type="number"
                  value={dropdown.bpm}
                  onChange={(e) => handleDropdownChange(dropdown.id, 'bpm', parseInt(e.target.value))}
                  placeholder="BPM"
                  className='text-box'
                />
                <input
                  type="number"
                  value={dropdown.parts}
                  onChange={(e) => handleDropdownChange(dropdown.id, 'parts', parseInt(e.target.value))}
                  placeholder="Number Parts"
                  className='text-box'
                />
                <input
                  type="number"
                  value={dropdown.transition}
                  onChange={(e) => handleDropdownChange(dropdown.id, 'transition', parseInt(e.target.value))}
                  placeholder="Transition Beats"
                  className='text-box'
                />
              </div>
              <button className="button" onClick={() => removeDropdown(dropdown.id)}>Remove Tune</button>
            </div>
          ))}
        </div>
        <button onClick={addDropdown}>Add Tune</button>
        <MetronomePlayer dropdowns={dropdowns} />
      </main>
      <div className="Footer">
        <footer>
          <p>&copy; 2023 Pipe Band Metronome. All rights reserved.</p>
          <div className="Links">
            <a href="mailto:cjhirschey@crimson.ua.edu" target="_blank">
                Email
            </a>
            <a href="https://github.com/ChristianHirschey" target="_blank">
                GitHub
            </a>
            <a href="https://www.linkedin.com/in/christianhirschey/" target="_blank">
                LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;