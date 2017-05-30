

![Banner](https://cdn.rawgit.com/willurmston/ToneEditor/40cb09e8/github-assets/banner.svg)


<!-- # Tone.Editor -->
A GUI overlay for making websites using [Tone.js](https://github.com/Tonejs/Tone.js). Use it during design and development, then throw it out when you're done. **(BETA)**

### Why?
Tone.js is a fun, flexible and hi-performance web music framework, but because it's text-based, the process of being creative with it can be slow. A GUI layer solves this problem, allowing you fiddle with parameters of all your Tone objects in real time, then copy the changes into your code. Play with a demo [here](http://urmston.xyz/tone-editor-demo).

### Setup
Include Tone-Editor.min.js in your page *after* Tone.js.
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/0.10.0/Tone.min.js"></script>
<script src="js/Tone-Editor.js" charset="utf-8"></script>
```
Define some Tone components and their settings.
*Your workflow will be simplest if you keep settings in separate objects.*
```javascript
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
```
### .add()
Use `ToneEditor.add()` to add your Tone objects to the Editor. Optional: customize a component's color.

```javascript
ToneEditor
  .add('synth', synth)
  .add({
    reverb: reverb,
    kickDrum: kickDrum
  })

  // give an extra argument to customize a component's color
  .add('ocarina', ocarina, 'purple')
  .add({
    snare: snare,
    hiHat: hiHat
  },'lightgreen')
```

Any changes made to the GUI will affect your Tone objects. See `example/index.html` for a demo.

### .master()
Adds Tone.Master to the Editor
```javascript
ToneEditor.master()
```

### .transport()
Adds Tone.Transport to the Editor. *Optional: set the in and out points (in any Tone.Time format) of the progress scrubber*
```javascript
ToneEditor.transport('0:0:0', '16:0:0')
```
### .options()
Change options (defaults are below)
```javascript
ToneEditor.options({
  // Align the panel left or right
  align: 'left',

  // Minify text before copying to clipboard
  minify: true,

  // Change the name of the downloaded settings file
  filename: 'yourSiteTitle_ToneSettings.js'
})
```
All methods are chainable.

### Copying changes back into your code
* Click 📋 on a component to copy its settings to the clipboard
* Click 📋 at the top of the panel to copy settings for all the components in the Editor
* Click 💾 button at the top of the panel to download the settings as a script

### Pro tips
* When playing the keyboard, use the `z` and `x` keys to change octaves
