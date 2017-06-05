
  define('ToneEditor', ['Utils'], function(utils) {

    Tone.Editor = function() {

      // See README for documentation
      this._options = {
        // public options (accessible from API)
        minify: false,
        filename: document.title.split(' ').join('')+'_ToneSettings.js',
        align: 'left',

        // private options
        transportScrubIn: 0,
        transportScrubOut: 180,
        columnWidth: 272,
        minPanelWidth: 290
      }
      this.components = []
      this.componentsById = {}

      var _this = this
      this._updateEditCount = function() {
        if (this._editedParameters.length === 1) {
          _this._copyAllButton.classList.add('visible')
        } else {
        }
      }
      this.resizedWidth = 280 //272
      this.isCollapsed = false

      this._copyAllButton = null // defined later _this.element.querySelector('div.copy-all')
      this.element = document.querySelectorAll('div.tone-editor_container')[0]

      //BUILD HTML
      var tempContainer = document.createElement('div')
      tempContainer.innerHTML = require('./Templates/ToneEditor.html')

      this.element = tempContainer.firstElementChild

      this.componentContainer = this.element.querySelector('.component-container')

      this.expandTriangle = this.element.querySelector('.panel-expand-triangle')


      // inject css
      require('./sass/main.sass')

      this.draw = function() {
        document.body.appendChild(this.element)
        _this._copyAllButton = _this.element.querySelector('div.copy-all')

        return _this.element
      }
      this.expand = function() {
        this.element.classList.remove('collapsed')
        this.expandTriangle.classList.add('expanded')
        this.resize(this.resizedWidth)
        this.isCollapsed = false

        require('State').save()
      }
      this.collapse = function() {
        this.element.classList.add('collapsed')
        this.element.style.width = ''
        this.expandTriangle.classList.remove('expanded')

        this.isCollapsed = true

        require('State').save()
      }
      this.toggle = function() {
        if (this.element.classList.contains('collapsed')) {
          this.expand()
        } else {
          this.collapse()
        }
      }
    }

    Tone.Editor.prototype._focusValueElement = function(element) {
      element.setAttribute('data-previous-value', element.innerHTML)
      element.setAttribute('contenteditable', true)
      element.focus()
      document.execCommand('selectAll',false,null)
    }

    Tone.extend(Tone.Editor)

    // INITIALIZE Tone.Editor
    var EditorConstructor = Tone.Editor
    Tone.Editor = new EditorConstructor()

    module.exports = Tone.Editor

  })
