define('State', ['Utils', 'ToneEditor','Keyboard'], function(utils, ToneEditor, Keyboard) {

  ToneEditor.saveState = function() {
    //global
      //keyboard target
      //for each component
        //isCollapsed


    var componentsById = {}
    utils.iterate(ToneEditor.componentsById, function(key, component) {

      componentsById[key] = {
        id: component.id,
        collapsed: component.expanded,
        subComponents: {}
      }

      //subcomponents
      utils.iterate(component.subComponents, function(key2, subComponent) {
        componentsById[key].subComponents[key2] = JSON.stringify({
          id: subComponent.id,
          collapsed: subComponent.expanded
        })
      })


    })

    localStorage.ToneEditor = {
      componentsById: JSON.stringify(componentsById)
    }

    if (Keyboard.target) {
      var keyboard = {
        targetID: Keyboard.target.id,
        octave: Keyboard.octave
      }
      localStorage.Keyboard = JSON.stringify(keyboard)
    }
  }

  ToneEditor.retrieveState = function() {

    //keyboard


    return localStorage.getItem('ToneEditor')
  }



  return ToneEditor
})
