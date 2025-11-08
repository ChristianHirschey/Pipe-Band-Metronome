import React from 'react';
import { Link } from 'react-router-dom';
import './About.css'

function About() {
    return (
        <div className='Home'>
            <div className='container'>
              <header>
                  <h1 className='Header'>Pipe Band Metronome</h1>
              </header>
              <main>
                  <div className='card'>
                    <div className='about-paragraph'>
                    <p>
                        Pipe Band Metronome is a metronome web app specifically designed for bagpipe competition sets,
                        most notably MSRs, Medleys, and Hornpipe/Jigs. These sets contain several tunes with varying tempi
                        and time signature, meaning a typical metronome is lackluster due to the inability to switch between
                        tempi and time signatures quickly. Pipe Band Metronome seeks to solve this as an easy to use metronome
                        that transitions between tunes for the user.
                    </p>
                    <br></br>
                    <h1 className='Header'>Usage</h1>
                    <p>
                        Each tune input has several options for the type of tune, alongside the bpm, the number of parts,
                        and the number of "transition beats". For the sake of simplicity, each tune type is the number of 
                        beats per part (so a 2-4 march has 32 beats, 3-4 has 48 beats, and so on). In order to properly transition 
                        from a 2-4 march/hornpipe to a jig/strathspey (for a medley or hornpipe/jig), -1 transition beats is required
                        for the march and 2 for the jig/strathspey. Similarly, extra beats (for example in a medley jig) can be added
                        to transition beats and will be played accordingly. Other transitions can be tested simply by just having the 
                        specific tune types and 1 part set with varying transition inputs before setting up the whole medley and its transitions.
                    </p>
                    </div>
                  </div>
              </main>
              <div className='Footer'>
                <footer>
                    <Link to='/' className="btn ghost">Home</Link>
                </footer>
              </div>
            </div>
        </div>
    );
}

export default About;