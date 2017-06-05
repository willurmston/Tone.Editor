define( function() {

  // guess metadata for a parameter, based on...

  // class
    // units
      // name (last resort)
        // if all of these fail, use defaults

  // var defaults = {
  //   slider: {
  //     uiType: 'slider',
  //     unit: '',
  //     min: 0,
  //     max: 100,
  //     isDefault: true
  //   },
  //   menu: {
  //     uiType: 'menu',
  //     menuItems: [],
  //     unit: '',
  //     isDefault: true
  //   }
  // }

  // CHECK BASED ON PARAMETER NAME
  var fromName = {
    // INSTRUMENT
    'portamento': {
      uiType: 'slider',
      unit: 's',
      min: 0,
      max: 5
    },
    // EFFECTS
    'roomSize': {
      uiType: 'slider',
      unit: '',
      min: 0,
      max: 1
    },
    'wet': {
      uiType: 'slider',
      unit: '',
      min: 0,
      max: 1
    },
    'phase': {
      uiType: 'slider',
      unit: 'deg',
      min: 0,
      max: 360
    },
    'volume': {
      uiType: 'slider',
      unit: 'dB',
      min: -100,
      max: 10
    },

    'normalRange': {
      uiType: 'slider',
      unit: '',
      min: 0,
      max: 1
    },
    'default': {
      uiType: 'slider',
      unit: '',
      min: 0,
      max: 100,
      isDefault: true
    }
  }

  // CHECK BASED ON CLASS
  var fromClass = {
    // INSTRUMENT

    // EFFECT
    'Filter': {
      'type': {
        uiType: 'menu',
        unit: 'dB',
        menuItems: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]
      },
      'rolloff': {
        uiType: 'menu',
        unit: 'dB',
        menuItems: [-12, -24, -48, -96]
      },
      'frequency': fromName.frequency
    },

    'Envelope': {
      'attack': {
        uiType: 'slider',
        unit: 's',
        min: 0,
        max: 10
      },
      'decay': {
        uiType: 'slider',
        unit: 's',
        min: 0,
        max: 10
      },
      'sustain': fromName.normalRange,
      'release': {
        uiType: 'slider',
        unit: 's',
        min: 0,
        max: 10
      },
      'attackCurve': {
        uiType: 'menu',
        menuItems: ['linear','exponential','sine','cosine','bounce','ripple','step']
      },
      'releaseCurve': {
        uiType: 'menu',
        menuItems: ['linear','exponential','sine','cosine','bounce','ripple','step']
      }
    },

    // COMPONENT
    'Oscillator': {
      'frequency': fromName.frequency,
      'detune': fromName.detune,
      'type': {
        uiType: 'menu',
        menuItems: ['sine', 'square', 'triangle', 'sawtooth']
      },
      'phase': fromName.phase,
      'volume': fromName.volume
    },

    // CORE
    'Transport': {
      'bpm': {
        uiType: 'slider',
        unit: 'bpm',
        min: 0,
        max: 200
      },
      'swing': {
        uiType: 'slider',
        unit: '',
        min: 0,
        max: 1
      },
      'swingSubdivision': {
        uiType: 'menu',
        menuItems: ['8n', '8t', '16n', '16t', '24n', '24t']
      },
      'timeSignature': {
        uiType: 'slider',
        unit: '',
        min: 1,
        max: 16,
        integer: true
      },
      'loopStart': {
        uiType: 'slider',
        unit: 's',
        min: 0,
        max: 300,
      },
      'loopEnd': {
        uiType: 'slider',
        unit: 's',
        min: 0,
        max: 300,
      },
      'PPQ': {
        uiType: 'hidden'
      }
    }

  }

  // CHECK BASED ON UNIT
  var fromUnit = {
    'frequency': {
      uiType: 'slider',
      unit: 'hz',
      min: 0,
      max: 20000
    },
    'db': {
      uiType: 'slider',
      unit: 'dB',
      min: -100,
      max: 10
    },
    'cents': {
      uiType: 'slider', // add 'cslider' later
      unit: 'c',
      min: -100,
      max: 100
    }
  }

  module.exports = function (uiElementOrName,     toneParam, parentComponent) {

    if (typeof uiElementOrName === 'object') {
      var name = uiElementOrName.name
      var toneParam = uiElementOrName.toneParameter
      var parentComponent = uiElementOrName.parentComponent
    } else {
      var name = uiElementOrName
    }

    var meta = {}

    var classMeta = fromClass[ parentComponent.heritage[1] ] || fromClass[ parentComponent.heritage[2] ] || fromClass[ parentComponent.heritage[0] ]

    if (classMeta !== undefined && classMeta[name] !== undefined) {
      meta = classMeta[name]

    } else if (fromUnit[toneParam.units] !== undefined) {
      meta = fromUnit[toneParam.units]

    } else if (fromName[name] !== undefined) {
      meta = fromName[name]

    } else {
      meta = fromName.default
    }

    return meta
  }

})
