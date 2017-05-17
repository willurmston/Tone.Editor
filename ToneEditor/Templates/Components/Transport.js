// WRAPPER FOR COMPONENT WITH SPECIAL PROPERTIES
define( ['Utils','ToneEditor', 'Templates/Components/Component', 'Templates/UIElements/Scrubber','Keyboard'], function(utils, ToneEditor, Component, Scrubber, Keyboard){

  function Transport(name, toneComponent, heritage, options) {
    var _this = this

    // wrap 'this' around a new Component
    Component.call(this, name, toneComponent, heritage, options)

    this.element.classList.add('transport')


    // add special Scrubber UIElement
    // by not adding it to this.parameters, it won't get copied or saved
    this.scrubber = new Scrubber( 'seconds', this, utils.getMeta('seconds', Tone.Transport.seconds, this))

    // this.nxWidget only exists after component is drawn to dom
    this.deferUntilDrawn( function() {
      // We can expect values in seconds
      _this.scrubber.nxWidget.min = ToneEditor._options.transportScrubIn
      _this.scrubber.nxWidget.max = ToneEditor._options.transportScrubOut

    })

    this.scrubber.element.querySelector('.parameter-name').innerHTML = 'progress'
    this.scrubber.element.querySelector('.unit').remove()


    var outTime = Tone.Time(ToneEditor._options.transportScrubOut).toBarsBeatsSixteenths()

    // modify inherited applyValue method
    this.scrubber.applyValue = function( value, triggeredByUi ) {
      // round value if appropriate

      Tone.Transport.set('seconds', value)
      if (!triggeredByUi && this.nxWidget !== undefined) {
        this.nxWidget.set({value: value})
      }

      var currentTime = Tone.Time(value).toBarsBeatsSixteenths()
      var split = currentTime.split(':')
      split[2] = parseInt(split[2])
      var joined = split.join(':')

      this.valueElement.innerHTML = joined +'/'+outTime

    }

    this.updateInOut = function() {

    }

    var mouseIsDown = false
    this.element.addEventListener('mousedown', function() {
      mouseIsDown = true
    })
    this.element.addEventListener('mouseup', function() {
      mouseIsDown = false
    })

    // update value on transport tick
    Tone.Transport.scheduleRepeat(function(time){
      if (mouseIsDown === false) {
        _this.scrubber.applyValue(Tone.Transport.seconds)
      }
    }, "0.01");

    this.controlCluster = utils.nodeFromString( require('Templates/UIElements/TransportControlCluster.html') )

    // add scrubber to cluster
    this.controlCluster.insertBefore(this.scrubber.element, this.buttonRow)

    this.buttonRow = this.controlCluster.children[0]
    this.buttonRow.children[0].style['font-size'] = '13px'

    // add whole cluster
    this.element.insertBefore(this.controlCluster, this.element.children[1])
    this.controlCluster.style.marginBottom = '4px'

    var playPause = this.element.querySelector('.play-pause')

    this.buttonRow.addEventListener('click', function(e) {
      var classList = e.target.classList
      if (classList.contains('play-pause')) {
        var state = Tone.Transport.state
        if (state === 'started') {
          Tone.Transport.pause()
        } else if (state === 'paused') {
          Tone.Transport.start()
        } else if (state === 'stopped') {
          Tone.Transport.start()
        }
      } else if (classList.contains('rewind')) {
        Tone.Transport.stop()
        _this.scrubber.applyValue(0)
      }
    })

    // listen for changes in play state
    Tone.Transport.on('start', function() {
      playPause.innerHTML = require('img/pause.svg')
    }).on('pause', function() {
      playPause.innerHTML = require('img/play.svg')
    }).on('stop', function() {
      playPause.innerHTML = require('img/play.svg')
    })

  }

  Transport.prototype = Component.prototype

  module.exports = Transport
})
