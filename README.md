# Tone.Editor
A GUI overlay for making websites using [Tone.js](github.com/https://github.com/Tonejs/Tone.js). Use it during design and development, then throw it out when you're done.

## Why?
Tone.js is a fun, flexible and hi-performance web music framework. However, because it's text-based, the process of making music with it can be a drag. It might take 20 page refreshes to get a synth sound that you like. A GUI layer solves this problem, allowing you fiddle with parameters of all your Tone objects in real time, then copy the changes into your code.

## Usage
Include Tone-Editor.min.js in your page *after* Tone.js.

Then,
```javascript

// Define some Tone components and their settings.
// ** Your workflow will be simplest if you keep settings in separate objects. **
var reverbSettings =
{
  "roomSize": 0.7,
	"dampening": 4300
}

var synthSettings =
{
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
}

var reverb = new Tone.Freeverb(reverbSettings).toMaster()

var synth = new Tone.MonoSynth(synthSettings).connect(reverb)

// Use ToneEditor.add() to initialize the editor and add your Tone objects
// Accepts either:
//    a name and a Tone component
//    an object with keys and values

ToneEditor
  .add('synth', synth)
  .add('reverb', reverb)

```
Any changes made to the GUI will affect your Tone objects. See `example/index.html` for a demo.

## Copying changes back into your code
Click the clipboard button on any component to copy its settings to the clipboard

Click the clipboard button at the top of the panel to copy settings for all the components in the Editor

## Options
```javascript

// Adds Tone.Master output to the Editor
ToneEditor
  .master()

// Adds Tone.Transport to the Editor
  // optional: give a start and end time (in any Tone.Time format) to make a timeline appear
  .transport('0:0:0', '16:0:0')

// Change options (defaults are below)
  .options({
    // Align the panel left or right
    align: 'left',

    // Minify text before copying to clipboard
    minify: false,

    // Change the name of the downloaded settings file
    // Click the button at the top of the panel to download
    filename: 'yourSiteTitle_ToneSettings.js'

  })


// all methods are chainable ;)
```
