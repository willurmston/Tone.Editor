
// pass a UIElement object into this function to add superpowers relevant to the UIType

define( function(){


  function Menu(UIElement) {
    var ui = UIElement
    var meta = ui.meta

    // BUILD HTML
    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Menu.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = ui.name

    // STORE ELEMENT AND DITCH tempContainer
    ui.element = tempContainer.firstElementChild
    ui.element.setAttribute('id', this.id)
    ui.valueElement = ui.element.querySelector('div.value')

    ui.menuElement = ui.element.getElementsByTagName('select')[0]

    var menuOptions = ''
    meta.menuItems.forEach( function(option) {
      menuOptions+='<option value="'+option+'">'+option+'</option>'
    })
    ui.menuElement.innerHTML = menuOptions

    ui.valueElement.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        var value = this.innerHTML
        ui.applyValue( value )
        ui.valueElement.setAttribute('contenteditable', false)
      }
    })

    ui.menuElement.onchange = function() {
      ui.applyValue(ui.value)
      // prevent typing from changing the selection
      this.blur()
    }

    ui.applyValue = function(value) {
      if (ui.initialized === true && ui.overwritten === false) {
        ui.element.classList.add('overwritten')
        ToneEditor._editedParameters.push(ui)
        ToneEditor._updateEditCount()
        ui.overwritten = true
      }

      var options = ui.menuElement.children
      for (var i = 0; i < options.length; i++) {
        if (options[i].value === value) {
          options[i].setAttribute('selected', '')
        } else {
          options[i].removeAttribute('selected')
        }
      }

      ui.parentToneComponent.set(ui.parameterName, value)
      ui.valueElement.innerHTML = value
    }

    ui.applyValue( ui.getValue() )

    return ui
  }

  module.exports = Menu

})
