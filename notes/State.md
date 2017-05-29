# Problem: managing states of the Keyboard

## Representations of Keyboard.target

* Keyboard.target => tone instrument or null

* workingState.keyboard.targetName => string or null
    should theoretically always be a string, even if there is no Keyboard.target
    _we should rewrite .get() and .save() to use workingState instead of a bunch of random throwaway objects_

* localStorage.ToneEditor.keyboard.targetName => string or null
    should be mirror of workingState


## Possible keyboard states when State.get() is called

* Stored targetName is defined, but not found in Editor
* Stored targetActive is true or false
  -> keep target name, `Keyboard.target = null`

* Stored targetName is defined, found in Editor
* Stored targetActive is true
  -> keep targetName, `Keyboard.target = {target}`

* Stored targetName is defined, found in Editor
* Stored targetActive is false
  -> keep targetName, `Keyboard.target = null`

* Stored targetName is undefined
  -> do nothing

## So...
  * We need another stored variable, keyboard.targetActive
  * Storage keyboard values are ONLY overwritten from Keyboard.setTarget()
  * workingState is ONLY written to from .save() NOT .get()

# Future
Ideally, State.save() should accept an argument of what part of the program to save, and then only update that part of the workingState (without having to loop through all the components and stuff). Then, a delayed callback (~1s) could be set after any changes are made that loops through everything and writes to window.localStorage.



~~~~~
