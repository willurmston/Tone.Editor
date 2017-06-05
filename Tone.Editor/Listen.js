define( ['./Utils','ToneEditor', 'Keyboard'], function(utils, ToneEditor, Keyboard) {
  startListeners = function() {

    // DELEGATED CLICK LISTENERS
    ToneEditor.element.addEventListener('click', function(e){
      var classList = e.target.classList
      if (classList.contains('component-class')) {
        // OPEN PAGE IN DOCS
        window.open('https://tonejs.github.io/docs/#'+e.target.innerHTML, '_blank')
      } else if (classList.contains('copy-all')) {
        e.target.style.animation = 'tone-editor_copied 1s'

        //COPY CHANGES
      } else if (classList.contains('value')) {
        if (e.target.getAttribute('contenteditable') === 'false') {
          ToneEditor._focusValueElement(e.target)
          document.execCommand('selectAll',false,null)
        }
      } else if (classList.contains('keyboard-button')) {
        Keyboard.toggle()
      } else if ((classList.contains('panel-expand-triangle') && classList.contains('expand-triangle')) || classList.contains('tone-js-logo')) {
        ToneEditor.toggle()
      } else if (classList.contains('tone-editor_container') && classList.contains('collapsed') ) {
        ToneEditor.expand()
      } else if (classList.contains('download-button')) {
        ToneEditor.download()
      }
    })
    ToneEditor.element.addEventListener('dblclick', function(e) {
      if (e.target.hasClass('value')) {
        ToneEditor._focusValueElement(e.target)
      }
    })
    ToneEditor.element.addEventListener('mousedown', function(e) {
      ToneEditor.element.addClass('mouse-down')
      ToneEditor._mouseIsDown = true
    })
    ToneEditor.element.addEventListener('mouseup', function(e) {
      ToneEditor.element.removeClass('mouse-down')
      ToneEditor._mouseIsDown = false
    })

  } // end startListeners() { }

  module.exports = startListeners
})
