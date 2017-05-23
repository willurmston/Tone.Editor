define('State', ['./Utils', 'ToneEditor','./Keyboard', 'State'], function(utils, ToneEditor, Keyboard, State) {

  var save = function() {

    var components = []
    ToneEditor.components.forEach( function(component) {

      var storedComponent = {
        name: component.name,
        subComponents: []
      }

      if (component.expandTriangle) {
        storedComponent.expanded = component.expanded

      }

      //subcomponents
      component.subComponents.forEach( function(subComponent) {
        storedComponent.subComponents.push({
          id: subComponent.id,
          expanded: subComponent.expanded
        })
      })

      components.push(storedComponent)
    })

    var keyboard = { octave: Keyboard.octave, isVisible: Keyboard.isVisible }
    if (Keyboard.target) keyboard.targetName = Keyboard.target.name

    var string = JSON.stringify({
      components: components,
      keyboard: keyboard
    })

    console.log('save state')

    window.localStorage.setItem( 'ToneEditor', string )

  }



  var get = function() {
    // retreive the stored state
    var storedState = JSON.parse(window.localStorage.getItem('ToneEditor'))

    // COMPONENTS
    storedState.components.forEach( updateLiveComponent )

    function updateLiveComponent( storedComponent ) {
      // get the corresponding component from the Editor
      var liveComponent = ToneEditor.componentsById[storedComponent.name]

      // check if it exists in the editor now
      if (liveComponent) {
        // if it's expandable, expand or collapse it
        if (liveComponent.expandTriangle !== null) {
          storedComponent.expanded ? liveComponent.expand() : liveComponent.collapse()
        }

        storedComponent.subComponents.forEach( function(storedSubComponent) {
          updateLiveComponent( storedSubComponent )
        })
      }
    }

    // KEYBOARD
    if (storedState.keyboard.targetName) Keyboard.setTarget( ToneEditor.componentsById[storedState.keyboard.targetName] )

    Keyboard.octave = storedState.keyboard.octave

    return storedState
  }

  module.exports = {
    save: save,
    get: get
  }
})
