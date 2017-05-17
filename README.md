

![Banner](https://rawgit.com/willurmston/ToneEditor/master/github-assets/banner.svg)


<!-- # Tone.Editor -->
A GUI overlay for making websites using [Tone.js](https://github.com/Tonejs/Tone.js). Use it during design and development, then throw it out when you're done. **(BETA)**

### Why?
Tone.js is a fun, flexible and hi-performance web music framework, but because it's text-based, the process of being creative with it can be slow. A GUI layer solves this problem, allowing you fiddle with parameters of all your Tone objects in real time, then copy the changes into your code.

### Usage
Include Tone-Editor.min.js in your page *after* Tone.js.

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

// Use ToneEditor.add() to add your Tone objects
// Accepts either:
//    a name and a Tone component
//    an object with keys and values

ToneEditor
  .add('synth', synth)
  .add('reverb', reverb)

```
Any changes made to the GUI will affect your Tone objects. See `example/index.html` for a demo.

### Copying changes back into your code
* Click the clipboard button on any component to copy its settings to the clipboard

* Click the clipboard button at the top of the panel to copy settings for all the components in the Editor

* Click the download button button at the top of the panel to download the settings in a script

### Options
```javascript

ToneEditor
  .master()
  // Adds Tone.Master to the Editor

  .transport('0:0:0', '16:0:0')
  // Adds Tone.Transport to the Editor
  // optional: set the in and out points (in any Tone.Time format) of the progress scrubber

  // Change options (defaults are below)
  .options({
    align: 'left',
    // Align the panel left or right

    minify: true,
    // Minify text before copying to clipboard

    filename: 'yourSiteTitle_ToneSettings.js'
    // Change the name of the downloaded settings file
    // Click the button at the top of the panel to download

    draggable: true
    // Turn on or off draggable functionality
  })


// all methods are chainable ;)
```
