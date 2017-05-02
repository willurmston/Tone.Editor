define( function() {

  // guess metadata for a parameter, based on...

  // class
    // units
      // name (last resort)
        // if all of these fail, use defaults


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
    'default': {
      uiType: 'slider',
      unit: '',
      min: 0,
      max: 100
    }
  }

  // CHECK BASED ON CLASS
  var fromClass = {
    // INSTRUMENT
    // EFFECT
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

  module.exports = function (uiElement) {
    var parentComponent = uiElement.parentComponent
    var name = uiElement.name
    var toneParam = uiElement.toneParameter

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
