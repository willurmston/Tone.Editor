
// pass a UIElement object into this function to add superpowers relevant to the UIType

define(['Utils', 'Templates/UIElements/UIElement'], function(utils, UIElement){

  function Toggle(parameterName, parentComponent, meta, options) {
    var _this = this

    UIElement.call(this, parameterName, parentComponent, meta, options)

    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Toggle.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = this.name

    // STORE ELEMENT AND DITCH tempContainer
    this.element = tempContainer.firstElementChild
    this.element.setAttribute('id', this.id)
    this.valueElement = this.element.querySelector('input.toggle')

    this.valueElement.onchange = function() {
      _this.applyValue(this.checked, true)
    }

    this.applyValue = function(value, triggeredByUi) {
      if (_this.initialized === true && _this.overwritten === false) {
        _this.element.classList.add('overwritten')
        _this.overwritten = true
      }

      // call set() on parent parent (works for both poly and mono synths)
      // we have to do this because PolySynth contains multiple voices, so it only works if you call set() from the top down
      // luckily, the same interface works for Mono instruments
      if (this.parentComponent.isSubcomponent) {
        _this.parentComponent.parentComponent.toneComponent.set(_this.parentComponent.name+'.'+_this.name, value)
      } else {
        _this.parentToneComponent.set(_this.name, value)
      } 
      if (!triggeredByUi) _this.valueElement.checked = value
    }

    this.applyValue(this.getValue())

  }

  Toggle.prototype = UIElement.prototype

  module.exports = Toggle

})
