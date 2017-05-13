define('Keyboard', ['Utils','ToneEditor'], function(utils, ToneEditor){
  var Keyboard = {
    target: undefined,
    element: ToneEditor.element.querySelector('svg.keyboard'),
    isVisible: false,
    show: function() {
      this.element.classList.remove('collapsed')
      this.isVisible = true
      // this._saveState('keyboardVisible', this.isVisible)
    },
    hide: function() {
      this.element.classList.add('collapsed')
      this.isVisible = false
      this._saveState('keyboardVisible', this.isVisible)
    },
    toggle: function toggle(){
      this.element.classList.toggle('collapsed')
      this.isVisible = !this.isVisible
    },
    setTarget: function(target) {
      if (!this.isVisible) this.show()

      if (this.target) this.target.keyboardTargetButton.classList.remove('active')

      this.target = target

      target.keyboardTargetButton.classList.add('active')

    }
  }

  var keymap = {
    65: 0,
    87: 1,
    83: 2,
    69: 3,
    68: 4,
    70: 5,
    84: 6,
    71: 7,
    89: 8,
    72: 9,
    85: 10,
    74: 11,
    73: 12,
    75: 13
  }

  Keyboard.octave = 4 // middle c

  // keys that are down
  var currentNotes = {}

  // LISTEN FOR KEY PRESSES (KEYBOARD AND MODIFIERS)
  document.addEventListener('keydown', function(e) {
    var noteIndex = keymap[e.keyCode]

    switch (e.keyCode) {
      case 16:
        Keyboard.shiftIsDown = true
        break
      case 18:
        Keyboard.optionIsDown = true
        break
      case 90:
        currentOctave --
        break
      case 88:
        currentOctave ++
        break
      default:
        // play keyboard if active and has target instrument
        if (Keyboard.isVisible && Keyboard.target !== undefined && noteIndex !== undefined ) {
          var note = Tone.Frequency().midiToFrequency((Keyboard.octave*12)+noteIndex)

          if (currentNotes[note] === undefined) {
            console.log('should start')
            console.log(currentNotes[note])
            currentNotes[note] = true
            Keyboard.target.toneComponent.triggerAttack( note )
          }
        }
    }
  })
  document.addEventListener('keyup', function(e) {
    var noteIndex = keymap[e.keyCode]


    switch (e.keyCode) {
      case 16:
        Keyboard.shiftIsDown = false
        break
      case 18:
        Keyboard.optionIsDown = false
        break
      default:
        if (Keyboard.isVisible && Keyboard.target !== undefined && noteIndex !== undefined) {
          var note = Tone.Frequency().midiToFrequency((Keyboard.octave*12)+noteIndex)

          if (currentNotes[note] === true) {
            console.log('should end')

            Keyboard.target.toneComponent.triggerRelease( note, '+0' ).triggerRelease()
            currentNotes[note] = undefined
          }

        }
    }
  })

  module.exports = Keyboard
})
