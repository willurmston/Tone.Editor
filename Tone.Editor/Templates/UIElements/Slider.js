
// pass a UIElement object into this function to add superpowers relevant to the UIType

define(['Utils', 'Templates/UIElements/UIElement', 'Keyboard'], function(utils, UIElement, Keyboard){


  function Slider( parameterName, parentComponent, meta, options) {

    UIElement.call(this, parameterName, parentComponent, meta, options)

    this.parentComponent = parentComponent
    this.nxWidget = false

    var _this = this

    this.applyValue = function(value, triggeredByUi) {

      if (_this.initialized === true && _this.overwritten === false) {
        _this.element.addClass('overwritten')

        _this.overwritten = true
      }

      // round value if appropriate
      if (meta.integer) value = Math.round( value )

      // call set() on parent parent (works for both poly and mono synths)
      // we have to do this because PolySynth contains multiple voices, so it only works if you call set() from the top down
      // luckily, the same interface works for Mono instruments
      if (this.parentComponent.isSubcomponent) {
        _this.parentComponent.parentComponent.toneComponent.set(_this.parentComponent.name+'.'+_this.name, value)
      } else {
        _this.parentToneComponent.set(_this.name, value)
      }

      // this prevents a feedback loop
      if (!triggeredByUi) {
        _this.nxWidget.set({value: value})
      }

      _this.valueElement.innerHTML = nx.prune(value, 2)
    }

    // BUILD HTML

    // STORE ELEMENT AND DITCH tempContainer
    this.element = utils.nodeFromString( require('./Slider.html') )

    // INJECT VALUES INTO TEMPLATE
    this.element.querySelector('.parameter-name').innerHTML = this.name
    this.element.querySelector('.unit').innerHTML = meta.unit
    this.element.setAttribute('id', this.id)
    if (this.isSignal) this.element.classList.add('signal')

    //CREATE nxWidget AFTER ELEMENT IS IN DOM
    this.parentComponent.deferUntilDrawn(function() {

      _this.nxWidget = nx.add( meta.uiType, {
        parent: _this.element,
        name: _this.id+'_slider',
        w: '100%',
        h: '100%'
      })

      utils.extend(_this.nxWidget, {
        hslider: true,
        mode: 'relative',
        labelSize: 0,
        min: meta.min,
        max: meta.max,
        canvas: _this.element.querySelector('canvas')
      })

      // WHEN SLIDER SETS VALUE
      _this.nxWidget.on('value', function(value) {
        _this.applyValue(value, true)
        _this.valueElement.setAttribute('contenteditable', false)
      })

      //ON CREATION, GET TONE, SET VALUE/SLIDER
      var value = _this.getValue()

      // CHECK IF PARAMETER IS CONTROLLED BY ANOTHER SIGNAL -- unsupported for now, maybe add later
      // if (_this.toneParameter.overridden) {
      //   var blocker = document.createElement('div')
      //   blocker.classList.add('blocker')
      //   _this.element.classList.add('overridden-by-signal')
      //   _this.element.appendChild(blocker)
      //
      // } else {
      //
      //   _this.applyValue(value)
      // }

      _this.applyValue(value)

      _this.initialized = true

    }) // END DEFERRED CALLBACK


    //SETUP VALUE ELEMENT
    this.valueElement = this.element.querySelector('div.value')
    this.valueElement.addEventListener('mouseover', function(e) {
      if (Tone.Editor.mouseIsDown) {
        e.preventDefault()
      }
    })

    // this.nxWidget.draw()

    // WHEN ELEMENT SETS VALUE
    this.valueElement.addEventListener('keydown', function(e) {
      switch(e.keyCode){
        //ENTER - apply value
        case 13:
          var value = _this.valueElement.innerHTML
          _this.applyValue(parseFloat(value))
          _this.valueElement.setAttribute('contenteditable', false)
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
          var value = parseFloat(_this.valueElement.innerHTML)
          _this.applyValue(value + incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        //DOWN - increment down
        case 40:
          var incrementAmount = 1
          if (Keyboard.shiftIsDown) incrementAmount = 10
          if (Keyboard.optionIsDown) incrementAmount = 0.1
          if (Keyboard.shiftIsDown && Keyboard.optionIsDown) incrementAmount = 100
          var value = parseFloat(_this.valueElement.innerHTML)
          _this.applyValue(value - incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        // ESC - revert to previous value
        case 27:
          var value = parseFloat(_this.valueElement.getAttribute('data-previous-value'))
          _this.applyValue(value)
          _this.valueElement.blur()
          _this.valueElement.setAttribute('contenteditable', false)
          break

        //NUMBERS
        default:
          if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode === 189 /* negative symbol */ || e.keyCode === 190 /* decimal */ ) {

          } else {
            e.preventDefault()
          }
      }
    })

  }


  Slider.prototype = UIElement.prototype

  module.exports = Slider

})
