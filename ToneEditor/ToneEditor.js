
  define(['./utils'], function(utils) {
    var ToneEditor = function() {
      // See README for documentation
      this._options = {
        minify: false,
        useSettingsObjects: true,
        showKeyboard: false,
        align: 'left',
        copyLog: false
      }
      this.components = []
      this.componentsById = {}
      var _this = this
      this._updateEditCount = function() {
        if (this._editedParameters.length === 1) {
          _this._copyAllButton.classList.add('visible')
          // _this._copyAllButton.innerHTML = 'copy '+_this._editedParameters.length+' change'
        } else {
          // _this._copyAllButton.innerHTML = 'copy '+_this._editedParameters.length+' changes'
        }
      }

      this._copyAllButton = null // defined later _this.element.querySelector('div.copy-all')
      this.element = document.querySelectorAll('div.tone-editor_container')[0]

      //BUILD HTML
      var tempContainer = document.createElement('div')
      tempContainer.innerHTML = require('./Templates/ToneEditor.html')

      this.element = tempContainer.firstElementChild

      this.componentContainer = this.element.querySelector('.component-container')

      // inject css
      require('./sass/main.sass')

      this.draw = function() {
        document.body.appendChild(this.element)
        _this._copyAllButton = _this.element.querySelector('div.copy-all')

        return _this.element
      }
    }

    ToneEditor.prototype._focusValueElement = function(element) {
      element.setAttribute('data-previous-value', element.innerHTML)
      element.setAttribute('contenteditable', true)
      element.focus()
      document.execCommand('selectAll',false,null)
    }

    // window.ToneEditor = ToneEditor
    module.exports = new ToneEditor()
  })
