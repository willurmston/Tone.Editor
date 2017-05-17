define(['./libs/clipboard.min','Utils','ToneEditor', 'Templates/Components/Component'], function (Clipboard, utils, ToneEditor, Component) {

  Component.prototype.toString = function(minify, useRefObjects) {
    var minify = minify || ToneEditor._options.minify
    var useSettingsObjects = useSettingsObjects || ToneEditor._options.useSettingsObjects

    // MINIFY (default: false)
    // Minify/collapse copied text
    if (minify) {
      var result = JSON.stringify(this.toneComponent.get())
    } else {
      var result = JSON.stringify(this.toneComponent.get(), null, 2)
    }

    // USE REF OBJECTS (default: false)
    // Make copying and pasting more convenient by returning the settings as an object that you can reference elsewhere in your code.
    if (useSettingsObjects) {
      result = 'var '+this.name+'Settings=\n'+result
    }

    return result
  }

  // RETURNS FLATTENED PROPERTIES OF TONECOMPONENT
  new Clipboard( '.tone-editor_container .copy-button', {
    text: function(trigger) {
      var text = ''

      if (trigger.classList.contains('copy-all')) { // it's the copy-all button
        ToneEditor.components.forEach( function(component) {
          text+='var '+component.id+'Settings = '+'\n'+component.toString(true, true)+';\n\n'
        })

      } else { // It's a component copy button
        var id = trigger.getAttribute('data-component-id')
        var component = ToneEditor.componentsById[id]

        text+='var '+id+'Settings = '+'\n'+component.toString()
      }


      return text
    }
  })

  ToneEditor.download = function() {
    var text = ''
    ToneEditor.components.forEach( function(component) {
      text+=component.toString(true, true)+';\n\n'
    })

    var filename = this._options.filename

    utils.downloadTextFile(filename, text)
  }

})

var synthSettings =
{"frequency":110,"detune":0,"oscillator":{"frequency":110,"detune":0,"type":"square","phase":0,"partials":[],"volume":0,"mute":false},"filter":{"type":"lowpass","frequency":0,"rolloff":-12,"Q":2,"gain":0},"envelope":{"attack":0.81,"decay":2.2,"sustain":0,"release":4.85,"attackCurve":"linear","releaseCurve":"exponential"},"filterEnvelope":{"baseFrequency":37.059,"octaves":6.7,"exponent":2,"attack":0.2,"decay":7.1,"sustain":0.1,"release":0.9,"attackCurve":"linear","releaseCurve":"exponential"},"portamento":0.036,"volume":-24.993742990301048};

var reverbSettings =
{"roomSize":0.699999988079071,"dampening":4300,"wet":1};

var synthPartSettings =
{"subdivision":"4n","loop":true,"loopEnd":"1m","loopStart":"0","playbackRate":1,"probability":1,"humanize":false,"mute":false};

var MasterSettings =
{"volume":0,"mute":false};

var TransportSettings =
{"bpm":120,"swing":0,"swingSubdivision":"8n","timeSignature":4,"loopStart":0,"loopEnd":0,"PPQ":192};
