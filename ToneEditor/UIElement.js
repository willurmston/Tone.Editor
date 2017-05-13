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

    // var meta = utils.getMeta(_this.toneParameter.units) || utils.getMeta(parameterName) || utils.getMeta('default')

    var meta = utils.getMeta(this)
    this.meta = meta

    // if options.uiType is defined, override meta.uiType
    if (options.uiType && meta.isDefault) meta.uiType = options.uiType

    this.isSignal = utils.isSignal(_this.toneParameter)

    if (meta.uiType === 'hidden') {
      this.hidden = true
    } else {
      // console.log('./Templates/UIElement/'+meta.uiType.capitalize()+'.js')
      require('./Templates/UIElement/'+meta.uiType.capitalize()+'.js')
    }
  //   if (meta.uiType === 'slider') {
  //
  //     require('./Templates/UIElement/Slider.js')(this)
  //     // this.applyValue( this.getValue() )
  //
  //   } else if (meta.uiType === 'menu') {
  //
  //     require('./Templates/UIElement/Menu.js')(this)
  //     // this.applyValue( this.getValue() )
  //
  //   } else if (meta.uiType === 'toggle') {
  //
  //     require('./Templates/UIElement/Toggle.js')(this)
  //     // this.applyValue( this.getValue() )
  //
  //   } else if (meta.uiType === 'hidden') {
  //     // tells parentComponent to delete this immediately
  //     this.hidden = true
  //   }
  }

  UIElement.prototype.getValue = function() {
    console.log(this.parentToneComponent.get(this.parameterName)[this.parameterValue])
    return this.parentToneComponent.get(this.parameterName)[this.parameterValue]
  }

  UIElement.prototype.draw = function() {
    console.log(this, this.element)
    return this.element
  }


  module.exports = UIElement
})
