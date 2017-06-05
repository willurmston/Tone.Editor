define(function() {
  // needs testing and work
  module.exports = function(toneComponent) {
    return toneComponent instanceof Tone.Signal
  }
})
