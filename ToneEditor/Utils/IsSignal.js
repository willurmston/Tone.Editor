
// needs testing and work
module.exports = function(toneComponent) {
  // try instanceof Tone.Signal

  // return (toneComponent.unit === !undefined)
  return toneComponent instanceof Tone.Signal
}
