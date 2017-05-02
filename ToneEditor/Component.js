define(['./utils','./ToneEditor','./UIElement','./Keyboard'], function(utils, ToneEditor, UIElement, Keyboard){
  var Component = function(name, toneComponent, options) {
    var options = options || {}
    this.name = name
    // this.id = 'tone-component-'+Date.now()
    this.id = this.name
    this.heritage = utils.classify(toneComponent)

    this.class = this.heritage[1] || this.heritage[0] || ''

    this.isSubcomponent = options.isSubcomponent || false
    this.parentComponent = options.parentComponent || undefined

    this.toneComponent = toneComponent


    var _this = this
    this.deferred = []
    this.deferUntilDrawn = function(callback) {
      _this.deferred.push(callback)
    }

    //BUILD HTML
    var tempContainer = document.createElement('div')

    // import html template
    if (this.isSubcomponent) {
      this.expanded = true

      tempContainer.innerHTML = require('./Templates/Subcomponent.html')

      this.element = tempContainer.firstElementChild

    } else {
      this.expanded = false

      tempContainer.innerHTML = require('./Templates/Component.html')

      this.element = tempContainer.firstElementChild

      this.keyboardTargetButton = this.element.querySelector('.keyboard-target-button')
      this.element.addEventListener('click', function(e) {
        var classList = e.target.classList
        console.log(classList)
        if (classList.contains('keyboardTargetButton')) {
          Keyboard.setTarget(_this)
        } else if (classList.contains('expand-triangle')) {

          if (_this.expanded) {
            _this.collapse()
          } else {
            _this.expand()
          }


          console.log(_this.expanded)

        }
      })

      if (this.heritage[0] === 'Instrument') {

      } else {
        this.keyboardTargetButton.remove()
      }

      // ADD HOOK FOR CLIPBOARD.js
      this.element.querySelector('.copy-button').setAttribute('data-component-id', this.id)
    }

    this.expandTriangle = this.element.querySelector('.expand-triangle')


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

    this.parameters = {}
    this.subComponents = {}

    utils.iterate( flattenedProps, function(key, prop) {
      if (typeof prop === 'object' && _this.isSubcomponent === false) {
        var options = {
          isSubcomponent: true,
          parentComponent: _this
        }

        _this.subComponents[key] = new Component( key, _this.toneComponent[key], options )

      } else if (typeof prop === 'array') {

      } else if (typeof prop === 'number') {
        _this.parameters[key] = new UIElement( key, _this, options )

      } else if (typeof prop === 'string') {
        var options = {}
        // make menu of options instead of slider
        // options.uiType = 'menu'
        _this.parameters[key] = new UIElement( key, _this, options )
      }
    })

  }

  Component.prototype.expand = function() {
    this.element.classList.add('expanded')
    this.expandTriangle.classList.add('expanded')
    this.expanded = true

    console.log('expanded')
    ToneEditor.saveState()
  }

  Component.prototype.collapse = function() {
    this.element.classList.remove('expanded')
    this.expandTriangle.classList.remove('expanded')
    this.expanded = false

    console.log('collapsed')
    ToneEditor.saveState()
  }

  // draws to dom
  Component.prototype.draw = function() {
    var _this = this
    // call draw on all child parameters, append their html to parameter container
    utils.iterate(this.parameters, function(key, parameter) {
      _this.parameterGroupElement.appendChild( parameter.draw() )
    })

    // call draw on all child components
    utils.iterate(this.subComponents, function(key, subComponent) {
      _this.parameterGroupElement.appendChild( subComponent.draw() )
    })

    ToneEditor.componentContainer.appendChild(this.element)

    //call deferred functions
    this.deferred.forEach(function(callback) {
      callback()
    })

    return this.element
  }


  module.exports = Component
})
