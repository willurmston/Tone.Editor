

// INITIALIZE EVERYTHING

define([
  'Utils',
  './libs/nexusUI',
  'ToneEditor',
  'State',
  'Listen',
  'Resize',
  'API',
  'Keyboard',
  'Copy'
], function(utils, NexusUI, ToneEditor, State, Listen) {
  // incorporate state-saving methods
  // utils.extend(ToneEditor, State)
  ToneEditor.initialized = false

  // ONLY called from API methods when ToneEditor.initialized = false
  ToneEditor.init = function() {
    // set base nx style
    function initNexus() {
      nx.colorize('accent','#FFF')
      nx.colorize('fill','rgba(0,0,0,0)')
      nx.colorize('white','rgba(0,0,0,0)')
      nx.globalWidgets = false
    }
    initNexus()

    // start keyboard/mouse listeners
    var listeners = Listen()

    // inject HTML
    ToneEditor.draw()

    // recall saved state
    State.get()

    // init complete
    ToneEditor.initialized = true
  }

  // export global variable
  // Tone.Editor = ToneEditor
})


// // expose ToneEditor
// window.ToneEditor = ToneEditor
