# Tone.Editor
A Graphical User Interace overlay for developing websites using [Tone.js](github.com/https://github.com/Tonejs/Tone.js). Use it during design and development, then throw it out when you're done.

## Why?
Tone.js is a fun, flexible and hi-performance web music framework. However, because it's text-based, the process of making music with it can be a drag. It might take 20 page refreshes to get a synth sound that you like. A GUI layer solves this problem, allowing you fiddle with parameters of all your Tone objects in real time, then copy the changes into your code.

## Usage
Include Tone-Editor.min.js in your page *after* Tone.js.

Then,
```javascript
// Define some Tone objects
var reverb = new Tone.Freeverb({
  "roomSize": 0.7,
	"dampening": 4300
}).toMaster()

var synth = new Tone.MonoSynth({
  oscillator: {
      type: "square"
  },
  filter: {
      Q: 2,
      type: "lowpass",
      rolloff: -12
  },
  envelope: {
      attack: .005,
      decay: 1,
      sustain: 0,
      release: .45
  },
  filterEnvelope: {
      attack: .001,
      decay: .1,
      sustain: .8,
      release: .3,
      baseFrequency: 300,
      octaves: 3.2
  }
}).connect(reverb)

// Use Tone.Editor.add() to initialize the editor and add your Tone objects
Tone.Editor.add(synth, reverb)
```
Any changes made to the GUI will directly effect your Tone objects.
To save your changes, click the **copy** button and your presets will be copied to your clipboard.

## Other Methods
```javascript
// Remove objects from Editor
.remove(synth)

// Change options (defaults are below)
.set({
  // align the panel left or right
  align: 'left',
  // Tone objects can be nested. Choose how many levels are visible.
  nestedLevels: 2,
  // The Editor panel can get out of the way after a certain amount of time
  autoHide: false,
  autoHideTimeout: 1.5,
  // Visualize Tone.Meter objects //
  visualMeters: false
})

// All methods are chainable
```
You can also manipulate Editor from your browser's console if your objects are accessible from the global scope

### This is early in development, so no guarantees. If you have feedback on these ideas I'd love to hear it.
