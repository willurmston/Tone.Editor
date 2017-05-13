// API
define(['./utils','./ToneEditor','./Component', './Keyboard','./Copy'], function(utils, ToneEditor, Component, Keyboard, Copy) {

  ToneEditor.add = function(name, component) {
    if (ToneEditor.initialized === false) ToneEditor.init()

    // PARSE ARGUMENTS
    // check if an object
    if (name !== null && typeof name === 'object' ) {
      // check if name is a Tone object, not a string
      if ( name instanceof Tone) {
        addComponent(name)
      } else { // it's an object of names and components
        for (var key in name) {
          addComponent(name[key], key)
        }
      }
    } else { // it's a name
      addComponent(component, name)
    }

    function addComponent(component, name) {
      // if (component instanceof Tone.Instrument || component instanceof Tone.Effect || component instanceof Tone.Player || component === Tone.Master) {
        var name = name || generateName()

        // ADD PARAMETERS TO OBJECT
        var newComponent = new Component( name, component)
        ToneEditor.components.push(newComponent)
        ToneEditor.componentsById[name] = newComponent

        //DRAW ELEMENT TO DOM
        newComponent.draw()

        if (component === Tone.Master) {
          ToneEditor.masterShown = true
        }
      // } else { // UNSUPPORTED TONE OBJECT
      //   console.log('%cIgnored unsupported Tone object', 'color: DarkOrange', component)
      //   console.log('%cTone-Editor only supports Tone.Instrument, Tone.Effect, Tone.Player', 'color: DarkOrange')
      // }

    }

    function generateName() {
      return 'component-'+ToneEditor.components.length
    }
    return ToneEditor
  }

  ToneEditor.show = function() {
    if (!ToneEditor.initialized) ToneEditor.init()

    ToneEditor.element.classList.remove('hidden')
    return ToneEditor
  }

  ToneEditor.hide = function() {
    if (!ToneEditor.initialized) ToneEditor.init()

    ToneEditor.element.classList.add('hidden')
    return ToneEditor
  }

  //REMOVE

  // ToneEditor.keyboard = function() {
  //   if (ToneEditor.initialized === false) ToneEditor.init()
  //
  //   Keyboard.show()
  //
  //   // try and target an instrument in ToneEditor.components
  //   ToneEditor.components.forEach( function(element) {
  //     if (element.heritage[0] === 'Instrument') Keyboard.setTarget(element)
  //   })
  //   return ToneEditor
  // }

  // Shortcut for adding Tone.Master, and always keeps it at the bottom
  ToneEditor.master = function() {
    ToneEditor.add('Master', Tone.Master)
    return ToneEditor
  }

  // Shows transport controls, and optionally a scrubber
  ToneEditor.transport = function(timeIn, timeOut) {
    ToneEditor.add('Transport', Tone.Transport)
    return ToneEditor
  }

  ToneEditor.options = function(options) {
    utils.extend(this._options, options)

    // alignment
    if (options.align === 'right') {
      ToneEditor.element.classList.add('align-right')
    } else if (options.align === 'left'){
      ToneEditor.element.classList.remove('align-right')
    }

    return ToneEditor
  }

  module.exports = ToneEditor
})
