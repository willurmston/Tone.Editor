define(['./utils','./ToneEditor', './Keyboard'], function(utils, ToneEditor, Keyboard){

  var UIElement = function( parameterName, parentComponent, options) {
    var options = options || {}

    this.parentComponent = parentComponent
    this.parentToneComponent = parentComponent.toneComponent

    this.name = parameterName
    this.toneParameter = this.parentToneComponent[parameterName]
    this.nxWidget = false
    this.overwritten = false
    this.initialized = false

    this.element = undefined

    // make id from the id of parents
    this.id = parentComponent.id+'_'+parameterName

    var _this = this

    this.getValue = function() { return _this.parentToneComponent.get(parameterName)[parameterName] }

    // var meta = utils.getMeta(_this.toneParameter.units) || utils.getMeta(parameterName) || utils.getMeta('default')

    var meta = utils.getMeta(this)

    // allow uiType to be overwritten when options.uiType is defined
    // meta.uiType = options.uiType || meta.uiType

    var isSignal = utils.isSignal(_this.toneParameter)

    if (meta.uiType === 'slider') {

      this.applyValue = function(value) {
        if (_this.initialized === true && _this.overwritten === false) {
          _this.element.addClass('overwritten')
          ToneEditor._editedParameters.push(_this)
          ToneEditor._updateEditCount()
          _this.overwritten = true
        }
        _this.parentToneComponent.set(parameterName, value)
        _this.nxWidget.set({value: value})
        _this.valueElement.innerHTML = nx.prune(value, 2)
      }

      // BUILD HTML
      var tempContainer = document.createElement('div')
      tempContainer.innerHTML = require('./Templates/Slider.html')

      // INJECT VALUES INTO TEMPLATE
      tempContainer.querySelector('.parameter-name').innerHTML = this.name
      tempContainer.querySelector('.unit').innerHTML = meta.unit

      if (isSignal) {
        tempContainer.firstElementChild.classList.add('signal')
      }

      // STORE ELEMENT AND DITCH tempContainer
      _this.element = tempContainer.firstElementChild
      _this.element.setAttribute('id', _this.id)

      //CREATE nxWidget AFTER ELEMENT IS IN DOM
      _this.parentComponent.deferUntilDrawn(function() {
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
          // console.log(parameterName, value, _this.nxWidget.canvas)
          _this.applyValue(value)
          _this.valueElement.innerHTML = nx.prune(_this.getValue(), 2)
          _this.valueElement.setAttribute('contenteditable', false)
        })

        //ON CREATION, GET TONE, SET VALUE/SLIDER
        var value = _this.getValue()

        // CHECK IF PARAMETER IS CONTROLLED BY ANOTHER SIGNAL
        if (_this.toneParameter.overridden) {
          var blocker = document.createElement('div')
          blocker.classList.add('blocker')
          _this.element.classList.add('overridden-by-signal')
          _this.element.appendChild(blocker)

        } else {
          _this.applyValue(value)
        }
        _this.initialized = true

      }) // END DEFERRED CALLBACK



      //SETUP VALUE ELEMENT
      _this.valueElement = _this.element.querySelector('div.value')
      _this.valueElement.addEventListener('mouseover', function(e) {
        if (ToneEditor.mouseIsDown) {
          e.preventDefault()
        }
      })

      // _this.nxWidget.draw()

      // WHEN ELEMENT SETS VALUE
      _this.valueElement.addEventListener('keydown', function(e) {
        switch(e.which){
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
            if (e.which >= 48 && e.which <= 57 || e.which === 189 /* negative symbol */ ) {

            } else {
              e.preventDefault()
            }
        }
      })


    } else if (meta.uiType === 'menu') {
      // BUILD HTML
      var tempContainer = document.createElement('div')
      tempContainer.innerHTML = require('./Templates/Menu.html')

      // INJECT VALUES INTO TEMPLATE
      tempContainer.querySelector('.parameter-name').innerHTML = this.name

      // STORE ELEMENT AND DITCH tempContainer
      _this.element = tempContainer.firstElementChild
      _this.element.setAttribute('id', _this.id)
      _this.valueElement = _this.element.querySelector('div.value')

      _this.menuElement = _this.element.getElementsByTagName('select')[0]

      var menuOptions = ''
      meta.menuItems.forEach( function(option) {
        menuOptions+='<option value="'+option+'">'+option+'</option>'
      })
      _this.menuElement.innerHTML = menuOptions


      _this.valueElement.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
          var value = _this.valueElement.innerHTML
          _this.applyValue( value )
          _this.valueElement.setAttribute('contenteditable', false)
        }
      })

      _this.menuElement.onchange = function() {
        _this.applyValue(this.value)
        // prevent typing from changing the selection
        this.blur()
      }

      this.applyValue = function(value) {
        if (_this.initialized === true && _this.overwritten === false) {
          _this.element.classList.add('overwritten')
          ToneEditor._editedParameters.push(_this)
          ToneEditor._updateEditCount()
          _this.overwritten = true
        }

        var options = _this.menuElement.children
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === value) {
            options[i].setAttribute('selected', '')
          } else {
            options[i].removeAttribute('selected')
          }
        }

        _this.parentToneComponent.set(parameterName, value)
        _this.valueElement.innerHTML = value
      }

      this.applyValue( this.getValue() )

    } // end if(menu)

    // exports html element
    this.draw = function() {
      return _this.element
    }


  }

  module.exports = UIElement
})
