// API
define(['Utils','ToneEditor','Templates/Components/Component', 'Keyboard','Copy'], function(utils, ToneEditor, Component, Keyboard, Copy) {

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
      var name = name || generateName()

      var heritage = utils.classify(component)

      // CHECK IF NEEDS A SPECIAL COMPONENT TYPE (i.e. Transport or Master)
      if (heritage.includes('Transport')) {

        var TransportComponent = require('Templates/Components/Transport')

        // ADD PARAMETERS TO OBJECT
        var newComponent = new TransportComponent( name, component, heritage)

      } else if (heritage.includes('Master')) {

        // ADD PARAMETERS TO OBJECT
        var newComponent = new Component( name, component, heritage)

      // } else if (heritage.includes('Instrument') || heritage.includes('Effect') || component instanceof Tone.Sequence){ // Create a generic component
      } else if (component instanceof Tone) {

        // ADD PARAMETERS TO OBJECT
        var newComponent = new Component( name, component, heritage)

      } else { // UNSUPPORTED TONE OBJECT
        console.log('%cIgnored unsupported Tone object', 'color: DarkOrange', component)
        // console.log('%cTone-Editor only supports Tone.Instrument or Tone.Effect', 'color: DarkOrange')

        return
      }

      ToneEditor.components.push(newComponent)
      ToneEditor.componentsById[name] = newComponent

      //DRAW ELEMENT TO DOM
      newComponent.draw()

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

  // Shortcut for adding Tone.Master
  ToneEditor.master = function() {
    ToneEditor.add('Master', Tone.Master)
    return ToneEditor
  }

  // Shows transport controls
  ToneEditor.transport = function(timeIn, timeOut) {

    if (timeIn) ToneEditor._options.transportScrubIn = Tone.Time(timeIn).toSeconds()
    if (timeOut) ToneEditor._options.transportScrubOut = Tone.Time(timeOut).toSeconds()

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
