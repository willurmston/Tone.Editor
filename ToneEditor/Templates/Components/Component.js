define('Templates/Components/Component', ['Utils','ToneEditor','../UIElements/UIElement','State', 'Keyboard' ], function(utils, ToneEditor, UIElement, State, Keyboard){

  function Component(name, toneComponent, heritage, options) {
    var options = options || {}
    this.name = name
    this.id = this.name
    this.heritage = heritage

    this.class = this.heritage[1] || this.heritage[0] || ''

    this.isSubcomponent = options.isSubcomponent || false
    this.parentComponent = options.parentComponent || undefined

    this.toneComponent = toneComponent

    var _this = this
    this.deferred = []

    //BUILD HTML
    var tempContainer = document.createElement('div')

    // import html template
    if (this.isSubcomponent) {
      this.expanded = false

      tempContainer.innerHTML = require('Templates/Components/Subcomponent.html')

      this.element = tempContainer.firstElementChild

    } else {
      this.expanded = true

      if (this.name === "Master") {
        tempContainer.innerHTML = require('Templates/Components/Master.html')
      } else {
        tempContainer.innerHTML = require('Templates/Components/Component.html')
      }

      this.element = tempContainer.firstElementChild

      if (options.color) this.element.style.background = options.color

      this.keyboardTargetButton = this.element.querySelector('.keyboard-target-button')

      if (this.heritage[0] !== 'Instrument') this.keyboardTargetButton.remove()

      // ADD HOOK FOR CLIPBOARD.js
      this.element.querySelector('.copy-button').setAttribute('data-component-id', this.id)
    }

    this.expandTriangle = this.element.querySelector('.expand-triangle')

    this.element.addEventListener('click', function(e) {
      var classList = e.target.classList
      if (classList.contains('keyboard-target-button')) {

        if (Keyboard.isActive) {
          Keyboard.deactivate().removeTarget()
        } else {
          Keyboard.setTarget(_this).activate().show()
        }

        State.save()

        // save state
      } else if (classList.contains('expand-triangle') && e.target === _this.expandTriangle) {

        if (_this.expanded) {
          _this.collapse()
        } else {
          _this.expand()
        }
        // save state
        State.save()
      }

    })

    // inject values into html template
    tempContainer.querySelector('.component-name').innerHTML = this.name
    tempContainer.querySelector('.component-class').innerHTML = this.class

    this.parameterGroupElement = this.element.querySelector('.parameter-group')

    this.components = [] //fill
    var _this = this

    var flattenedProps = toneComponent.get()

    // sort properties into parameters and subComponents
    var parameters = {}
    var subComponents = {}

    this.parameters = []
    this.subComponents = []
    this.subComponentsByName = {}

    var childComponent = _this.toneComponent

    // if the key doesn't exist, it's probably a PolySynth
    if (toneComponent instanceof Tone.PolySynth)  {
      this.isPolySynth = true
      // tempContainer.querySelector('.component-class').innerHTML +='('+toneComponent.voices.length+')'
      childComponent = _this.toneComponent.voices[0]
    }

    utils.iterate( flattenedProps, function(key, prop) {
      if (typeof prop === 'object' && _this.isSubcomponent === false) {
        var options = {
          isSubcomponent: true,
          parentComponent: _this
        }

        var heritage = utils.classify(childComponent[key])
        var newComp = new Component( key, childComponent[key], heritage, options )
        _this.subComponents.push( newComp )
        _this.subComponentsByName[key] = newComp

      } else if (typeof prop === 'array') {
        // NOTE this might create problems later with parameters that are arrays (i.e. waveform partials).
        // ignore arrays for now

      } else if (typeof prop === 'number') {
        // console.log('number', key, prop)

        var meta = utils.getMeta(key, childComponent[key], _this )


        if (meta.uiType === 'hidden') {

        } else {
          // get the right constructor based on uiType
          var uiConstructor = require('../UIElements/'+meta.uiType.capitalize()+'.js')

          _this.parameters.push( new uiConstructor( key, _this, meta, options ) )
        }

      } else if (typeof prop === 'boolean') {
        // console.log('boolean', key, prop)
        var options = {
          uiType: 'toggle'
        }

        var meta = utils.getMeta(key, childComponent[key], _this )

        if (meta.uiType === 'hidden') {

        } else {

          // get the right constructor based on uiType
          var uiConstructor = require('../UIElements/Toggle.js')
          _this.parameters.push( new uiConstructor( key, _this, meta, options ) )

        }
      } else if (typeof prop === 'string') {
        var options = {
          uiType: 'menu'
        }

        var meta = utils.getMeta(key, childComponent[key], _this )

        if (meta.uiType !== 'hidden') {
          // get the right constructor based on uiType
          var uiConstructor = require('../UIElements/Menu.js')
          _this.parameters.push( new uiConstructor( key, _this, meta, options ) )

        }
      }
    })
  }

  Component.prototype.deferUntilDrawn = function(callback) {
    this.deferred.push(callback)
  }

  Component.prototype.expand = function() {
    this.element.classList.add('expanded')
    this.expandTriangle.classList.add('expanded')
    this.expanded = true
  }

  Component.prototype.collapse = function() {
    this.element.classList.remove('expanded')
    this.expandTriangle.classList.remove('expanded')
    this.expanded = false
  }

  // draws to dom
  Component.prototype.draw = function() {
    var _this = this
    // call draw on all child parameters, append their html to parameter container
    this.parameters.forEach( function(parameter) {
      _this.parameterGroupElement.appendChild( parameter.draw() )
    })

    // call draw on all child components
    this.subComponents.forEach( function(subComponent) {
      _this.parameterGroupElement.appendChild( subComponent.draw() )
    })

    if (ToneEditor.masterShown) {
      ToneEditor.componentContainer.insertBefore(this.element, ToneEditor.componentsById['Master'].element )
    } else {
      ToneEditor.componentContainer.appendChild(this.element)
    }

    //call deferred functions
    this.deferred.forEach(function(callback) {
      callback()
    })

    return this.element
  }

  // updates all nexusUI widget values
  Component.prototype.update = function() {
    this.parameters.forEach( function(parameter) {
      parameter.applyValue( parameter.getValue() )
    })

    this.subComponents.forEach( function(subComponent) {
      // call update on subComponents
      subComponent.update()
    })
  }
  module.exports = Component
})
