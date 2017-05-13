
// pass a UIElement object into this function to add superpowers relevant to the UIType

define(['../../utils'], function(utils){


  function Slider(ui) {
    var meta = ui.meta

    ui.applyValue = function(value, triggeredByUi) {
      if (ui.initialized === true && ui.overwritten === false) {
        ui.element.addClass('overwritten')
        // ToneEditor._editedParameters.push(ui)
        // ToneEditor._updateEditCount()
        ui.overwritten = true
      }

      // round value if appropriate
      if (meta.integer) value = Math.round( value )

      ui.parentToneComponent.set(ui.parameterName, ui.value)
      if (!triggeredByUi) {
        ui.nxWidget.set({value: value})
      }
      ui.valueElement.innerHTML = nx.prune(value, 2)
    }

    // BUILD HTML
    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = require('./Slider.html')

    // INJECT VALUES INTO TEMPLATE
    tempContainer.querySelector('.parameter-name').innerHTML = ui.name
    tempContainer.querySelector('.unit').innerHTML = meta.unit

    if (ui.isSignal) {
      tempContainer.firstElementChild.classList.add('signal')
    }

    // STORE ELEMENT AND DITCH tempContainer
    ui.element = tempContainer.firstElementChild
    ui.element.setAttribute('id', ui.id)

    //CREATE nxWidget AFTER ELEMENT IS IN DOM
    ui.parentComponent.deferUntilDrawn(function() {
      ui.nxWidget = nx.add( meta.uiType, {
        parent: ui.element,
        name: ui.id+'_slider',
        w: '100%',
        h: '100%'
      })

      utils.extend(ui.nxWidget, {
        hslider: true,
        mode: 'relative',
        labelSize: 0,
        min: meta.min,
        max: meta.max,
        canvas: ui.element.querySelector('canvas')
      })

      // WHEN SLIDER SETS VALUE
      ui.nxWidget.on('value', function(value) {
        ui.applyValue(value, true)
        ui.valueElement.innerHTML = nx.prune(ui.getValue(), 2)
        ui.valueElement.setAttribute('contenteditable', false)
      })

      //ON CREATION, GET TONE, SET VALUE/SLIDER
      var value = ui.getValue()

      // CHECK IF PARAMETER IS CONTROLLED BY ANOTHER SIGNAL
      if (ui.toneParameter.overridden) {
        var blocker = document.createElement('div')
        blocker.classList.add('blocker')
        ui.element.classList.add('overridden-by-signal')
        ui.element.appendChild(blocker)

      } else {

        ui.applyValue(value)
      }
      ui.initialized = true

    }) // END DEFERRED CALLBACK



    //SETUP VALUE ELEMENT
    ui.valueElement = ui.element.querySelector('div.value')
    ui.valueElement.addEventListener('mouseover', function(e) {
      if (ToneEditor.mouseIsDown) {
        e.preventDefault()
      }
    })

    // ui.nxWidget.draw()

    // WHEN ELEMENT SETS VALUE
    ui.valueElement.addEventListener('keydown', function(e) {
      switch(e.which){
        //ENTER - apply value
        case 13:
          var value = ui.valueElement.innerHTML
          ui.applyValue(parseFloat(value))
          ui.valueElement.setAttribute('contenteditable', false)
          break

        //DELETE
        case 8:
          break

        //UP - increment down
        case 38:
          var incrementAmount = 1
          if (Keyboard.shiftIsDown) incrementAmount = 10
          if (Keyboard.optionIsDown) incrementAmount = 0.1
          if (Keyboard.shiftIsDown && Keyboard.optionIsDown) incrementAmount = 100
          var value = parseFloat(ui.valueElement.innerHTML)
          ui.applyValue(value + incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        //DOWN - increment down
        case 40:
          var incrementAmount = 1
          if (Keyboard.shiftIsDown) incrementAmount = 10
          if (Keyboard.optionIsDown) incrementAmount = 0.1
          if (Keyboard.shiftIsDown && Keyboard.optionIsDown) incrementAmount = 100
          var value = parseFloat(ui.valueElement.innerHTML)
          ui.applyValue(value - incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        // ESC - revert to previous value
        case 27:
          var value = parseFloat(ui.valueElement.getAttribute('data-previous-value'))
          ui.applyValue(value)
          ui.valueElement.blur()
          ui.valueElement.setAttribute('contenteditable', false)
          break

        //NUMBERS
        default:
          if (e.which >= 48 && e.which <= 57 || e.which === 189 /* negative symbol */ ) {

          } else {
            e.preventDefault()
          }
      }
    })



    return ui
  }

  module.exports = Slider

})
