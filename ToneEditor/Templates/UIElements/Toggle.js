
// pass a UIElement object into this function to add superpowers relevant to the UIType

define(['Utils', 'Templates/UIElements/UIElement'], function(utils, UIElement){

  function Toggle(parameterName, parentComponent, meta, options) {

    // this.prototype = new UIElement(parameterName, parentComponent, meta, options)
    UIElement.call(this, parameterName, parentComponent, meta, options)

    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Toggle.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = this.name

    // STORE ELEMENT AND DITCH tempContainer
    this.element = tempContainer.firstElementChild
    this.element.setAttribute('id', this.id)
    this.valueElement = this.element.querySelector('input.toggle')

    this.applyValue = function(value) {
      if (_this.initialized === true && _this.overwritten === false) {
        _this.element.classList.add('overwritten')
        ToneEditor._editedParameters.push(ui)
        ToneEditor._updateEditCount()
        _this.overwritten = true
      }

      _this.parentToneComponent.set(_this.parameterName, _this.value)
      _this.valueElement.value = value
    }

  }

  Toggle.prototype = UIElement.prototype

  module.exports = Toggle

})
