import React, { Component } from 'react';
import MetronomeLogic from './MetronomeLogic';
import './Home.css';
import { Link } from 'react-router-dom';
import calculateBeats from './calculateBeats';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: [{ id: 1, timeSignature: 'rolls', bpm: null, parts: 1, transition: 4 }],
      currentBeat: 0,
      beatsToDisplay: 0,
      metronomeViewBeats: []
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
    const updatedDropdowns = this.state.dropdowns.filter((dropdown) => dropdown.id !== id);
    this.setState({ dropdowns: updatedDropdowns });
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
        <div className="Header">
          <header>
            <h1>Pipe Band Metronome</h1>
          </header>
        </div>
        <main>
          <div className="MetronomeView">
            {this.renderGridBoxes()}
          </div>
          <div className="Dropdowns">
            {this.state.dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="DropdownItem">
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
                    className='text-box'
                  />
                  <input
                    type="number"
                    value={dropdown.parts}
                    onChange={(e) => this.handleDropdownChange(dropdown.id, 'parts', parseInt(e.target.value))}
                    placeholder="Number Parts"
                    className='text-box'
                  />
                  <input
                    type="number"
                    value={dropdown.transition}
                    onChange={(e) => this.handleDropdownChange(dropdown.id, 'transition', parseInt(e.target.value))}
                    placeholder="Transition Beats"
                    className='text-box'
                  />
                </div>
                <button className="button" onClick={() => this.removeDropdown(dropdown.id)}>Remove Tune</button>
              </div>
            ))}
          </div>
          <button onClick={this.addDropdown}>Add Tune</button>
          <button onClick={() => this.setState({ startMetronome: true })}>Play</button>
          {this.state.startMetronome && (
            <MetronomeLogic
              dropdowns={this.state.dropdowns}
              onBeatUpdate={this.setCurrentBeat}
              onUpdateBeatsToDisplay={this.updateBeatsToDisplay}
            />
          )}
        </main>
        <div className="Footer">
          <footer>
            <div className="Links">
              <Link to="/about">About</Link>
              <a href="mailto:cjhirschey@crimson.ua.edu" target="_blank">Email</a>
              <a href="https://github.com/ChristianHirschey" target="_blank">GitHub</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Home;