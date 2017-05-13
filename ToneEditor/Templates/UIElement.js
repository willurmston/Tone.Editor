define('UIElement', ['Utils','ToneEditor','Keyboard', 'Templates/Component'], function(utils, ToneEditor, Keyboard, Component){

  var UIElement = function( parameterName, parentComponent, meta, options) {
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

    // if options.uiType is defined, override meta.uiType
    if (options.uiType && meta.isDefault) meta.uiType = options.uiType

    this.isSignal = utils.isSignal(_this.toneParameter)

  }


  UIElement.prototype.getValue = function() {
    return this.parentToneComponent.get(this.name)[this.name]
  }

  UIElement.prototype.draw = function() {
    return this.element
  }

  // UIElement.prototype.constructor = UIElement

  module.exports = UIElement
})
