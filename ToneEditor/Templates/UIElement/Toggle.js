
// pass a UIElement object into this function to add superpowers relevant to the UIType

define( function(){


  function Toggle(ui) {
    var meta = ui.meta

    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Toggle.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = ui.name

    // STORE ELEMENT AND DITCH tempContainer
    ui.element = tempContainer.firstElementChild
    ui.element.setAttribute('id', ui.id)
    ui.valueElement = ui.element.querySelector('input.toggle')

    ui.applyValue = function(value) {
      if (ui.initialized === true && ui.overwritten === false) {
        ui.element.classList.add('overwritten')
        ToneEditor._editedParameters.push(ui)
        ToneEditor._updateEditCount()
        ui.overwritten = true
      }

      ui.parentToneComponent.set(ui.parameterName, ui.value)
      ui.valueElement.value = value
    }

    return ui
  }

  module.exports = Toggle

})
