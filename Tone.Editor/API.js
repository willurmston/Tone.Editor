// API
define(['Utils','ToneEditor','State', 'Templates/Components/Component', 'Keyboard','Copy'], function(utils, ToneEditor, State, Component, Keyboard, Copy) {

  ToneEditor.add = function(name, component, color) {
    if (!ToneEditor.initialized) ToneEditor.init()

    // PARSE ARGUMENTS
    // check if an object
    if (name !== null && typeof name === 'object' ) {
      // check if name is a Tone object, not a string
      if ( name instanceof Tone) {
        addComponent(name)
      } else { // it's an object of names and components
        var color = arguments[1] // allow assigning a color to a group of components
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

      var options = {}
      if (color) options.color = color

      // CHECK IF NEEDS A SPECIAL COMPONENT TYPE (i.e. Transport or Master)
      if (heritage.includes('Transport')) {

        var TransportComponent = require('Templates/Components/Transport')

        // ADD PARAMETERS TO OBJECT
        var newComponent = new TransportComponent( name, component, heritage, options)

      } else if (heritage.includes('Master')) {

        // ADD PARAMETERS TO OBJECT
        var newComponent = new Component( name, component, heritage, options)

      // } else if (heritage.includes('Instrument') || heritage.includes('Effect') || component instanceof Tone.Sequence){ // Create a generic component
      } else if (component instanceof Tone) {

        // ADD PARAMETERS TO OBJECT
        var newComponent = new Component( name, component, heritage, options)

      } else { // UNSUPPORTED TONE OBJECT
        console.log('%cIgnored unsupported Tone object', 'color: DarkOrange', component)

        return
      }

      ToneEditor.components.push(newComponent)
      ToneEditor.componentsById[name] = newComponent

      //DRAW ELEMENT TO DOM
      newComponent.draw()

      State.get()
    }

    function generateName() {
      return 'component-'+ToneEditor.components.length
    }

    return ToneEditor
  }
  ToneEditor.remove = function(nameOrComponent) {
    if (typeof nameOrComponent === 'string' && ToneEditor.componentsById[nameOrComponent] !== undefined) {
      delete ToneEditor.componentsById[name]
      ToneEditor.components.forEach( function(component, index) {
        if (component.name === nameOrComponent) ToneEditor.components.splice(index, 1)
      })
    }

    State.save()

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
  ToneEditor.master = function(color) {
    ToneEditor.add('Master', Tone.Master, color || 'skyblue')
    return ToneEditor
  }

  // Shows transport controls
  ToneEditor.transport = function(timeIn, timeOut, color) {

    if (timeIn) ToneEditor._options.transportScrubIn = Tone.Time(timeIn).toSeconds()
    if (timeOut) ToneEditor._options.transportScrubOut = Tone.Time(timeOut).toSeconds()

    ToneEditor.add('Transport', Tone.Transport, color || 'orange')
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

  // listen for events
  ToneEditor.on = function(eventName, callback) {
    if (eventName === 'notestart') {
      Keyboard._onNoteStart.push(callback)
    } else if (eventName === 'noteend') {
      Keyboard._onNoteEnd.push(callback)
    }
  }

  module.exports = ToneEditor
})
