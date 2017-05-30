define( ['ToneEditor','Utils','State'], function(ToneEditor, utils, State) {

  var resizeHandle = document.createElement('div')
  resizeHandle.classList.add('resize-handle')
  ToneEditor.element.appendChild(resizeHandle)

  var resizing = false
  var mouseX
  var width

  var saveTimer

  ToneEditor.resize = function(width) {
    if (width >= ToneEditor._options.minPanelWidth) {
      ToneEditor.element.style.width = width + 'px'
      ToneEditor.resizedWidth = width
    }

    if (width >= ToneEditor._options.columnWidth * 2) {
      ToneEditor.componentContainer.classList.add('multi-column')
    } else {
      ToneEditor.componentContainer.classList.remove('multi-column')
    }



    return this
  }

  document.addEventListener('mousemove', function(e) {
    if (resizing) {
      mouseX = e.clientX

      var windowWidth = utils.getWindowSize().width

      if (ToneEditor._options.align === 'right') {

        width = windowWidth - mouseX

        if (width <= 272) width = 272

      } else if (ToneEditor._options.align === 'left') {

        width = mouseX
      }

      ToneEditor.resize(width)

      // after a second, save the resizedWidth
      clearTimeout(saveTimer)

      saveTimer = setTimeout( function() {
        State.save()
      }, 500)

    }
  }, false)
  document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('resize-handle')) {
      ToneEditor.element.classList.remove('transition-width')
      resizing = true
    }
  }, false)
  document.addEventListener('mouseup', function() {
    if (resizing) {
      ToneEditor.element.classList.add('transition-width')
      resizing = false
    }
  }, false)

  module.exports = ToneEditor
})
