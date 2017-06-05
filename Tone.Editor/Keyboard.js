define('Keyboard', ['Utils', 'ToneEditor','State'], function(utils, ToneEditor, State){

  var State = require('State')

  var Keyboard = {
    element: Tone.Editor.element.querySelector('svg.keyboard'),
    target: null,
    isActive: false,
    isVisible: false,

    // expand the keyboard
    show: function() {
      // this.element.classList.remove('collapsed')
      this.isVisible = true
      Tone.Editor.element.classList.add('keyboard-visible')

      // var State = require('State')
      // State.save()

      return this
    },

    // collapse the keyboard
    hide: function() {
      // this.element.classList.add('collapsed')
      this.isVisible = false
      Tone.Editor.element.classList.remove('keyboard-visible')

      // var State = require('State')
      // State.save()

      return this
    },

    // toggle collapsed/expanded
    toggle: function toggle(){
      if (this.isVisible) {
        this.hide()
      } else {
        this.show()
      }

      return this
    },
    setTarget: function(target) {

      if (this.target !== null) this.removeTarget()

      this.target = target

      // // save state
      // var State = require('State')
      // State.save()

      return this
    },
    removeTarget: function() {

      if (this.target) {
        this.target.keyboardTargetButton.classList.remove('active')
        this.target = null
        // var State = require('State')
        // State.save()
      }

      return this
    },
    activate: function() {
      this.isActive = true
      if (this.target) this.target.keyboardTargetButton.classList.add('active')


      return this
    },
    deactivate: function() {
      this.isActive = false
      if (this.target) this.target.keyboardTargetButton.classList.remove('active')

      return this
    }
  }

  // maps e.keyCode values to noteIndex
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
    75: 12,
    79: 13,
    76: 14,
    80: 15,
    186: 16,
    222: 17
  }

  Keyboard.octave = 4 // middle c

  // note name textbox
  var noteNameEl = Tone.Editor.element.querySelector('.note-name')



  // keys that are down
  var currentNotes = {}

  function startNote(noteIndex) {
    if (Keyboard.isActive && Keyboard.target !== null && noteIndex !== undefined ) {
      Keyboard.element.querySelector('rect[data-index="'+noteIndex+'"]').classList.add('note-playing')

      var note = Tone.Frequency((Keyboard.octave*12)+noteIndex, 'midi')

      if (currentNotes[note] === undefined) {
        currentNotes[note] = true
        noteNameEl.innerHTML = note.toNote() +'<br>'+ note.toMidi()
        Keyboard.target.toneComponent.triggerAttack( note )
      }
    }
  }

  function endNote(noteIndex) {
    if (Keyboard.isActive && Keyboard.target !== null && noteIndex !== undefined) {
      Keyboard.element.querySelector('rect[data-index="'+noteIndex+'"]').classList.remove('note-playing')

      var note = Tone.Frequency((Keyboard.octave*12)+noteIndex, 'midi')

      if (currentNotes[note] === true) {
        // console.log('should end')

        Keyboard.target.toneComponent.triggerRelease( note, '+0' ).triggerRelease()
        currentNotes[note] = undefined
      }

    }
  }

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
        Keyboard.octave--
        require('State').save()
        break
      case 88:
        Keyboard.octave++
        require('State').save()
        break
      default:
        // play keyboard if active and has target instrument
        startNote(noteIndex)
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
        endNote(noteIndex)

    }
  })

  Keyboard.element.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('key')) {
      var index = parseInt(e.target.getAttribute('data-index'))
      startNote(index)
    }
  })
  Keyboard.element.addEventListener('mouseup', function(e) {
    if (e.target.classList.contains('key')) {
      var index = parseInt(e.target.getAttribute('data-index'))
      endNote(index)
    }
  })

  module.exports = Keyboard
})
