
// pass a UIElement object into this function to add superpowers relevant to the UIType

define(['Utils', 'Templates/UIElements/UIElement'], function(utils, UIElement){

  function Menu(parameterName, parentComponent, meta, options) {
    var _this = this

    UIElement.call(this, parameterName, parentComponent, meta, options)

    // BUILD HTML
    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Menu.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = this.name

    // STORE ELEMENT AND DITCH tempContainer
    this.element = tempContainer.firstElementChild
    this.element.setAttribute('id', this.id)
    this.valueElement = this.element.querySelector('div.value')

    this.menuElement = this.element.getElementsByTagName('select')[0]

    var menuOptions = ''
    meta.menuItems.forEach( function(option) {
      menuOptions+='<option value="'+option+'">'+option+'</option>'
    })
    this.menuElement.innerHTML = menuOptions

    this.valueElement.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        var value = this.innerHTML
        _this.applyValue( value )
        _this.valueElement.setAttribute('contenteditable', false)
      }
    })

    this.menuElement.onchange = function() {
      _this.applyValue(this.value)
      // prevent typing from changing the selection
      this.blur()
    }

    this.applyValue = function(value) {
      if (_this.initialized === true && _this.overwritten === false) {
        _this.element.classList.add('overwritten')
        ToneEditor._editedParameters.push(ui)
        ToneEditor._updateEditCount()
        _this.overwritten = true
      }

      var options = this.menuElement.children
      for (var i = 0; i < options.length; i++) {
        if (options[i].value === value) {
          options[i].setAttribute('selected', '')
        } else {
          options[i].removeAttribute('selected')
        }
      }

      this.parentToneComponent.set(this.parameterName, value)
      this.valueElement.innerHTML = value
    }

    this.applyValue( this.getValue() )

  }

  // inherit UIElement stuff
  Menu.prototype = UIElement.prototype

  module.exports = Menu

})
