define( ['ToneEditor','./Utils'], function(ToneEditor, utils) {

  var resizeHandle = document.createElement('div')
  resizeHandle.classList.add('resize-handle')
  ToneEditor.element.appendChild(resizeHandle)

  var resizing = false
  var mouseX
  var width

  document.addEventListener('mousemove', function(e) {
    if (resizing) {
      mouseX = e.clientX

      var windowWidth = utils.getWindowSize().width

      if (ToneEditor._options.align === 'right') {

        width = windowWidth - mouseX

        if (width <= 272) width = 272

      } else if (ToneEditor._options.align === 'left') {

        // min width
        if (mouseX <= 272) mouseX = 272

        width = mouseX
      }

      ToneEditor.element.style.width = width + 'px'

      // store panel width ratio
      localStorage.panelWidthRatio = width / windowWidth

      // var canvases = ToneEditor.element.querySelectorAll('canvas.nx')
      //
      // for (var i=0; i<canvases.length; i++) {
      //   canvases[i].width = canvases[i].parentElement.offsetWidth
      // }
      //
      // // resize all components
      // ToneEditor.components.forEach(function(component) {
      //   component.update()
      // })

    }
  }, false)
  document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('resize-handle')) {
      resizing = true

    }
  }, false)
  document.addEventListener('mouseup', function() {
    if (resizing) {
      resizing = false
    }
  }, false)

  module.exports = ToneEditor
})
