import React, { Component } from 'react';
import MetronomeLogic from './MetronomeLogic';
import './Home.css';
import { Link } from 'react-router-dom';
import calculateBeats from './calculateBeats';
import RingerReminder from './RingerReminder';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: [{ id: 1, timeSignature: 'rolls', bpm: null, parts: 1, transition: 4 }],
      currentBeat: 0,
      beatsToDisplay: 0,
      metronomeViewBeats: [],
      startMetronome: false,
      notice: null
    };
  }

  componentDidMount() {
    this.updateBeats();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dropdowns !== this.state.dropdowns) {
      this.updateBeats();
    }
  }

  updateBeats = () => {
    const beats = calculateBeats(this.state.dropdowns);
    this.setState({ metronomeViewBeats: beats });
  }

  addDropdown = () => {
    const newId = this.state.dropdowns.length + 1;
    this.setState(prevState => ({
      dropdowns: [...prevState.dropdowns, { id: newId, timeSignature: '2-4', bpm: null, parts: null, transition: null }]
    }));
  }

  removeDropdown = (id) => {
    // If metronome is running, kill playback first to avoid overlapping loops
    if (this.state.startMetronome) {
      this.setState({ startMetronome: false, notice: 'Playback stopped because a tune was removed.' }, () => {
        const updatedDropdowns = this.state.dropdowns.filter((dropdown) => dropdown.id !== id);
        this.setState({ dropdowns: updatedDropdowns });
        // clear notice after a short delay
        setTimeout(() => this.setState({ notice: null }), 2200);
      });
    } else {
      const updatedDropdowns = this.state.dropdowns.filter((dropdown) => dropdown.id !== id);
      this.setState({ dropdowns: updatedDropdowns });
    }
  }

  handleDropdownChange = (id, field, value) => {
    this.setState(prevState => ({
      dropdowns: prevState.dropdowns.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }

  setCurrentBeat = (beat) => {
    this.setState({ currentBeat: beat });
  }

  updateBeatsToDisplay = (beats) => {
    this.setState({ beatsToDisplay: beats });
  }

  renderGridBoxes = () => {
    const boxes = [];
    for (let i = 0; i < this.state.beatsToDisplay; i++) {
      boxes.push(
        <div key={i} className={`grid-box ${this.state.currentBeat === i ? 'active' : ''}`}></div>
      );
    }
    return boxes;
  }

  render() {
    return (
      <div className="Home">
        <RingerReminder />
        <div className="container">
          <div className="Header">
            <header>
              <h1>Pipe Band Metronome</h1>
            </header>
          </div>
          <main className="main-area">
            <div className="metronome-card card">
              <div className="MetronomeView metronome-grid">
                {this.renderGridBoxes()}
              </div>
            </div>
            <div className="Dropdowns">
            {this.state.dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="DropdownItem">
                <div className="card" style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
                  <select
                  value={dropdown.timeSignature}
                  onChange={(e) => this.handleDropdownChange(dropdown.id, 'timeSignature', e.target.value)}
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
                    onChange={(e) => this.handleDropdownChange(dropdown.id, 'bpm', parseInt(e.target.value))}
                    placeholder="BPM"
                    className='text-box form-input'
                  />
                  <input
                    type="number"
                    value={dropdown.parts}
                    onChange={(e) => this.handleDropdownChange(dropdown.id, 'parts', parseInt(e.target.value))}
                    placeholder="Number Parts"
                    className='text-box form-input'
                  />
                  <input
                    type="number"
                    value={dropdown.transition}
                    onChange={(e) => this.handleDropdownChange(dropdown.id, 'transition', parseInt(e.target.value))}
                    placeholder="Transition Beats"
                    className='text-box form-input'
                  />
                </div>
                <button className="btn danger" onClick={() => this.removeDropdown(dropdown.id)}>Remove Tune</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12, display:'flex', gap:12, justifyContent:'center', alignItems:'center'}}>
            <button className="btn ghost" onClick={this.addDropdown}>Add Tune</button>
            <button
              className="btn"
              onClick={() => {
                // Validate that each dropdown has required values before playing
                const invalid = this.state.dropdowns.some(d => !d.bpm || !d.parts);
                if (invalid) {
                  this.setState({ notice: 'Please set BPM and Parts for each tune before playing.' });
                  setTimeout(() => this.setState({ notice: null }), 2200);
                  return;
                }
                // start playback; ensure any previous playback was stopped (MetronomeLogic will cancel on prop change)
                this.setState({ startMetronome: true, notice: null });
              }}
            >Play</button>
          </div>
          {this.state.notice && (
            <div style={{textAlign:'center', marginTop:12}} className="muted">{this.state.notice}</div>
          )}
          {this.state.startMetronome && (
            <MetronomeLogic
              dropdowns={this.state.dropdowns}
              onBeatUpdate={this.setCurrentBeat}
              onUpdateBeatsToDisplay={this.updateBeatsToDisplay}
              onStopped={() => this.setState({ startMetronome: false, notice: 'Playback finished.' })}
            />
          )}
        </main>
          <div className="Footer">
            <footer>
              <div className="Links">
                <Link to="/about" className="btn ghost small">About</Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;