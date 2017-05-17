define( ['./Utils','ToneEditor','./Keyboard'], function(utils, ToneEditor, Keyboard) {
  startListeners = function() {

    // DELEGATED CLICK LISTENERS
    ToneEditor.element.addEventListener('click', function(e){
      if (e.target.hasClass('component-class')) {
        // OPEN PAGE IN DOCS
        window.open('https://tonejs.github.io/docs/#'+e.target.innerHTML, '_blank')
      } else if (e.target.hasClass('copy-all')) {
        e.target.style.animation = 'tone-editor_copied 1s'

        //COPY CHANGES
      } else if (e.target.hasClass('value')) {
        if (e.target.getAttribute('contenteditable') === 'false') {
          ToneEditor._focusValueElement(e.target)
          document.execCommand('selectAll',false,null)
        }
      } else if (e.target.hasClass('keyboard-button')) {
        Keyboard.toggle()
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
