
// EXTENDS UIElement.Slider
define(['Utils', 'Templates/UIElements/Slider', 'Keyboard'], function(utils, Slider, UIElement, Keyboard){


  function Scrubber( parameterName, parentComponent, meta, options) {

    Slider.call(this, parameterName, parentComponent, meta, options)

    this.parentComponent = parentComponent

    this.element.classList.add('scrubber')

    var _this = this

  }


  Scrubber.prototype = Slider.prototype

  module.exports = Scrubber

})
