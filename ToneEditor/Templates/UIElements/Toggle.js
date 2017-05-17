
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

      _this.parentComponent.toneComponent.set(parameterName, value)
      if (!triggeredByUi) _this.valueElement.checked = value
    }

    this.applyValue(this.getValue())

  }

  Toggle.prototype = UIElement.prototype

  module.exports = Toggle

})
