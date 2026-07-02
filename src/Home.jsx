import React, { Component } from 'react';
import MetronomeLogic from './MetronomeLogic';
import './Home.css';
import { Link } from 'react-router-dom';
import calculateBeats from './calculateBeats';
import RingerReminder from './RingerReminder';

const PRESET_STORAGE_KEY = 'pipe-band-metronome-presets';

const presetTemplates = {
  msr: [
    { id: 1, timeSignature: 'rolls', bpm: null, parts: 1, preTransition: 0, postTransition: 4 },
    { id: 2, timeSignature: '2-4', bpm: null, parts: null, preTransition: 0, postTransition: -1 },
    { id: 3, timeSignature: '4str', bpm: null, parts: null, preTransition: 2, postTransition: -1 },
    { id: 4, timeSignature: '2-2', bpm: null, parts: null, preTransition: 2, postTransition: 0 }
  ],
  medley: [
    { id: 1, timeSignature: 'rolls', bpm: null, parts: 1, preTransition: 0, postTransition: 4 },
    { id: 2, timeSignature: '2-4', bpm: null, parts: null, preTransition: 0, postTransition: -1 },
    { id: 3, timeSignature: '6-8', bpm: null, parts: null, preTransition: 2, postTransition: -1 },
    { id: 4, timeSignature: '4slow', bpm: null, parts: null, preTransition: 4, postTransition: 0 },
    { id: 5, timeSignature: '4str', bpm: null, parts: null, preTransition: 4, postTransition: -2 },
    { id: 6, timeSignature: '2-2', bpm: null, parts: null, preTransition: 2, postTransition: 0 }
  ]
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: [{ id: 1, timeSignature: 'rolls', bpm: null, parts: 1, preTransition: 8, postTransition: 0 }],
      currentBeat: 0,
      beatsToDisplay: 0,
      currentTuneLabel: '',
      metronomeViewBeats: [],
      startMetronome: false,
      activePreset: null,
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

  readSavedPresets = () => {
    try {
      const raw = localStorage.getItem(PRESET_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  savePreset = (presetName, dropdowns) => {
    try {
      const savedPresets = this.readSavedPresets();
      savedPresets[presetName] = dropdowns.map((dropdown) => ({
        bpm: dropdown.bpm,
        parts: dropdown.parts
      }));
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(savedPresets));
    } catch (error) {
      // Ignore storage failures so the app still works without persistence.
    }
  }

  applySavedPreset = (presetName) => {
    const template = presetTemplates[presetName];
    const savedPresets = this.readSavedPresets();
    const savedDropdowns = savedPresets[presetName] || [];

    return template.map((dropdown, index) => {
      const saved = savedDropdowns[index] || {};
      return {
        ...dropdown,
        bpm: saved.bpm ?? dropdown.bpm,
        parts: saved.parts ?? dropdown.parts
      };
    });
  }

  addDropdown = () => {
    const newId = this.state.dropdowns.length + 1;
    this.setState(prevState => ({
      dropdowns: [...prevState.dropdowns, { id: newId, timeSignature: '2-4', bpm: null, parts: null, preTransition: null, postTransition: null }]
    }));
  }

  loadMSR = () => {
    this.setState({
      dropdowns: this.applySavedPreset('msr'),
      startMetronome: false,
      activePreset: 'msr',
      notice: 'MSR loaded: March, Strathspey, Reel'
    });
    setTimeout(() => this.setState({ notice: null }), 2200);
  }

  loadMedley = () => {
    this.setState({
      dropdowns: this.applySavedPreset('medley'),
      startMetronome: false,
      activePreset: 'medley',
      notice: 'Medley loaded: Hornpipe, Jig, Slow Air, Strathspey, Reel'
    });
    setTimeout(() => this.setState({ notice: null }), 2200);
  }

  removeDropdown = (id) => {
    // if metronome is running, kill playback first to avoid overlapping loops
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
    this.setState(prevState => {
      const dropdowns = prevState.dropdowns.map(item => item.id === id ? { ...item, [field]: value } : item);
      return { dropdowns };
    }, () => {
      if (this.state.activePreset && (field === 'bpm' || field === 'parts')) {
        this.savePreset(this.state.activePreset, this.state.dropdowns);
      }
    });
  }

  setCurrentBeat = (beat) => {
    this.setState({ currentBeat: beat });
  }

  updateBeatsToDisplay = (beats) => {
    this.setState({ beatsToDisplay: beats });
  }

  updateCurrentTuneLabel = (label) => {
    this.setState({ currentTuneLabel: label || '' });
  }

  startPlayback = () => {
    // Validate that each dropdown has required values before playing
    const invalid = this.state.dropdowns.some(d => !d.bpm || !d.parts || d.bpm <= 0 || d.parts <= 0);
    if (invalid) {
      this.setState({ notice: 'Please set BPM and Parts for each tune before playing.' });
      setTimeout(() => this.setState({ notice: null }), 2200);
      return;
    }

    this.setState({
      currentBeat: 0,
      beatsToDisplay: 0,
      currentTuneLabel: '',
      startMetronome: true,
      notice: null
    });
  }

  stopPlayback = () => {
    this.setState({
      currentBeat: 0,
      beatsToDisplay: 0,
      currentTuneLabel: '',
      startMetronome: false,
      notice: null
    });
  }

  handlePlaybackToggle = () => {
    if (this.state.startMetronome) {
      this.stopPlayback();
      return;
    }

    this.startPlayback();
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
              <div className="current-tune-box" aria-live="polite" aria-atomic="true">
                {this.state.currentTuneLabel}
              </div>
            </div>
            <div className="Dropdowns">
            {this.state.dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="DropdownItem">
                <div className="card">
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
                    value={dropdown.bpm || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      this.handleDropdownChange(dropdown.id, 'bpm', isNaN(val) ? null : val);
                    }}
                    placeholder="BPM"
                    className='text-box form-input'
                  />
                  <input
                    type="number"
                    value={dropdown.parts || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      this.handleDropdownChange(dropdown.id, 'parts', isNaN(val) ? null : val);
                    }}
                    placeholder="Parts"
                    className='text-box form-input'
                  />
                  <input
                    type="number"
                    value={dropdown.preTransition || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      this.handleDropdownChange(dropdown.id, 'preTransition', isNaN(val) ? null : val);
                    }}
                    placeholder="Pre Transition"
                    className='text-box form-input small-input'
                  />
                  <input
                    type="number"
                    value={dropdown.postTransition || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      this.handleDropdownChange(dropdown.id, 'postTransition', isNaN(val) ? null : val);
                    }}
                    placeholder="Post Transition"
                    className='text-box form-input small-input'
                  />
                </div>
                <button className="btn danger" onClick={() => this.removeDropdown(dropdown.id)}>Remove Tune</button>
                </div>
              </div>
            ))}
          </div>
          <div className="button-group">
            <button className="btn ghost" onClick={this.addDropdown}>Add Tune</button>
            <button
              className={this.state.startMetronome ? 'btn danger' : 'btn'}
              onClick={this.handlePlaybackToggle}
            >{this.state.startMetronome ? 'Stop' : 'Start'}</button>
          </div>
          {this.state.notice && (
            <div style={{textAlign:'center', marginTop:12}} className="muted">{this.state.notice}</div>
          )}
          {this.state.startMetronome && (
            <MetronomeLogic
              dropdowns={this.state.dropdowns}
              onBeatUpdate={this.setCurrentBeat}
              onUpdateBeatsToDisplay={this.updateBeatsToDisplay}
              onTuneChange={this.updateCurrentTuneLabel}
              onStopped={() => this.setState({
                startMetronome: false,
                currentBeat: 0,
                beatsToDisplay: 0,
                currentTuneLabel: '',
                notice: 'Playback finished.'
              })}
            />
          )}
        </main>
          <div className="Footer">
            <footer>
              <div className="Links">
                <button onClick={this.loadMSR} className="btn ghost small">MSR</button>
                <Link to="/about" className="btn ghost small">About</Link>
                <button onClick={this.loadMedley} className="btn ghost small">Medley</button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;