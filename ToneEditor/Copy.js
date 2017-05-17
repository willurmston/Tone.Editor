define(['./libs/clipboard.min','Utils','ToneEditor', 'Templates/Components/Component'], function (Clipboard, utils, ToneEditor, Component) {

  Component.prototype.toString = function(minify, useRefObjects) {
    var _this = this
    var minify = minify || ToneEditor._options.minify
    var useSettingsObjects = useSettingsObjects || ToneEditor._options.useSettingsObjects

    var flattened = this.toneComponent.get()
    var filtered = {}

    // ONLY INCLUDE PARAMETERS AND SUBPARAMETERS THAT EXIST IN EDITOR
    // I.E. NO ARRAYS
    this.parameters.forEach( function(parameter) {
      filtered[parameter.name] = parameter.parentComponent.toneComponent.get(parameter.name)[parameter.name]
    })

    this.subComponents.forEach( function(subComponent) {
      filtered[subComponent.name] = {}
      subComponent.parameters.forEach( function(parameter) {
        filtered[subComponent.name][parameter.name] = parameter.parentComponent.toneComponent.get(parameter.name)[parameter.name]
      })
    })

    console.log(filtered)

    // MINIFY (default: false)
    // Minify/collapse copied text
    if (minify) {
      var result = JSON.stringify(filtered)
    } else {
      var result = JSON.stringify(filtered, null, 2)
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
{"frequency":110,"detune":0,"portamento":0.036,"volume":-24.993742990301048,"oscillator":{"frequency":110,"detune":0,"phase":0,"volume":0,"mute":false},"filter":{"frequency":0,"rolloff":-12,"Q":2,"gain":0},"envelope":{"attack":0.81,"decay":2.2,"sustain":0,"release":4.85},"filterEnvelope":{"baseFrequency":37.059,"octaves":6.7,"exponent":2,"attack":0.2,"decay":7.1,"sustain":0.1,"release":0.9}};

var reverbSettings =
{"roomSize":0.699999988079071,"dampening":4300,"wet":1};

var synthPartSettings =
{"loop":true,"playbackRate":1,"probability":1,"humanize":false,"mute":false};

var MasterSettings =
{"volume":0,"mute":false};

var TransportSettings =
{"bpm":120,"swing":0,"timeSignature":4,"loopStart":0,"loopEnd":0};
