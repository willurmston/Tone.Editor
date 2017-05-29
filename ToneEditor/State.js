define('State', ['Utils', 'ToneEditor','Keyboard'], function(utils, ToneEditor, Keyboard, State) {

  // STATE MANAGER
  // Layer on top of window.localStorage that allows for certain UI changes to persist across page refreshes
  // See notes/State for more background

  // A temporary state in memory that holds state data before it goes to localStorage.
  var workingState = {
    isCollapsed: false,
    resizedWidth: 272,
    componentsByName: {},
    keyboard: {
      isActive: false,
      isVisible: false,
      targetName: null // Unless the Keyboard.target is unspecified, there should ALWAYS be a name here, even if it doesn't exist in the Editor
    }
  }

  // NOTE: "Stored" refers to data saved in window.localStorage. "Live" refers to corresponding objects in the ToneEditor object. "Working" is an object that holds state data before it goes to localStorage

  function save() {

    var componentsByName = {}
    ToneEditor.components.forEach( function(component) {

      workingState.componentsByName[component.name] = {
        name: component.name,
        subComponentsByName: {},
        expanded: component.expandTriangle ? component.expanded : undefined
      }

      if (component.expandTriangle) {
        workingState.componentsByName[component.name].expanded = component.expanded
      }

      //subcomponents
      component.subComponents.forEach( function(subComponent) {
        workingState.componentsByName[component.name].subComponentsByName[subComponent.name] = {
          name: subComponent.name,
          expanded: subComponent.expanded
        }
      })
    })

    //KEYBOARD
    workingState.keyboard.octave = Keyboard.octave
    workingState.keyboard.isActive = Keyboard.isActive
    workingState.keyboard.isVisible = Keyboard.isVisible
    if (Keyboard.target !== null) workingState.keyboard.targetName = Keyboard.target.name


    //RESIZE
    workingState.resizedWidth = ToneEditor.resizedWidth

    //COLLAPSED
    workingState.isCollapsed = ToneEditor.isCollapsed

    window.localStorage.setItem( 'ToneEditor', JSON.stringify(workingState) )
  }

  // retreive the stored state and update ever
  function get() {
    var storedState = JSON.parse(window.localStorage.getItem('ToneEditor'))

    // return
    if (!storedState) return

    // storedState = utils.merge(workingState, storedState)

    // save state in MEMORY so it can be saved to storage later in .save()
    workingState = storedState

    // COMPONENTS
    utils.iterate(workingState.componentsByName, function( name, storedComponent ) {

      // get the corresponding component from the Editor
      var liveComponent = ToneEditor.componentsById[storedComponent.name]

      // check if it exists in the editor now
      if (liveComponent) {

        // if it's expandable, expand or collapse it
        if (liveComponent.expandTriangle !== null) {
          storedComponent.expanded ? liveComponent.expand() : liveComponent.collapse()
        }

        utils.iterate(storedComponent.subComponentsByName, function(name, storedSubComponent) {
          var liveSubComponent = liveComponent.subComponentsByName[name]

          if (liveSubComponent) {

            if (liveSubComponent.expandTriangle !== null) {
              storedSubComponent.expanded ? liveSubComponent.expand() : liveSubComponent.collapse()
            }
          }
        })
      }
    })

    // KEYBOARD
    Keyboard.octave = storedState.keyboard.octave

    if (storedState.keyboard.targetName === null) {
      // do nothing
    } else if (ToneEditor.componentsById[storedState.keyboard.targetName] !== undefined) {
      console.log('newTarget', newTarget, storedState.keyboard.isActive)
      var newTarget = ToneEditor.componentsById[storedState.keyboard.targetName]
      Keyboard.setTarget(newTarget)

      if (storedState.keyboard.isActive) {
        Keyboard.activate()
      } else {
        Keyboard.deactivate()
      }
    }

    if (storedState.keyboard.isVisible) {
      Keyboard.show()
    } else {
      Keyboard.hide()
    }

    // RESIZE / COLLAPSE
    ToneEditor.resizedWidth = storedState.resizedWidth
    if (!storedState.isCollapsed) {
      ToneEditor.element.classList.remove('transition-width')
      ToneEditor.expand()
      ToneEditor.resize(storedState.resizedWidth)
      ToneEditor.element.classList.add('transition-width')
    } else {
      ToneEditor.collapse()
    }

    return storedState
  }


  module.exports = {
    save: save,
    get: get
  }

})
