/**
 * showy -- Observe and Control Slideshow Applications
 * Copyright (c) 2019 Seth Berrier
 * Based on Slideshow by Dr. Ralf S. Engelschall <http://engelschall.com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License (MPL), version 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * --
 * File:     connector-osx-ppt201X.js
 * Purpose:  connector engine for Microsoft PowerPoint 2011 & 2016 under Mac OS X
 * Language: JXA (JavaScript for Automation)
 * --
 **/

// Turn console.log into something reasonable
console.log = function() {
  ObjC.import('Foundation');
  for (argument of arguments) {
    $.NSFileHandle.fileHandleWithStandardOutput.writeData($.NSString.alloc.initWithString(String(argument) + "\n").dataUsingEncoding($.NSNEXTSTEPStringEncoding));
  }
}

// Different states for PowerPoint, returned by pptGetState()
PPT_STATE = {
  CLOSED: 'closed',
  RUNNING: 'running',
  EDITING: 'editing',
  VIEWING: 'viewing'
}

/************* Internal Helper functions *****************/

// get current presentation object
function _getCurPresentation() {
  // Make sure we have an active presentation
  let state = pptGetState()
  if (state === PPT_STATE.CLOSED) {
    throw new Error('PowerPoint not running')
  } else if (state === PPT_STATE.RUNNING) {
    throw new Error('No active presentation')
  }

  // Get the active presentation
  return Application('Microsoft PowerPoint').presentations[0]
}

// get current slide object
function _getCurSlide() {
  // Get the active presentation
  let presentation = _getCurPresentation()
  if (pptGetState() === PPT_STATE.EDITING) {
  	return presentation.documentWindows[0].selection.slideRange.slides[0]
  } else {
    return presentation.slideShowWindow.slideshowView.slide
  }
}

function _getShapeText(slide, placeholderRegex) {
  let slideText = ''
  
  // Loop over the 'shapes' in the current slide
  for(let i=0; i < slide.shapes.length; i++) {
    let shape = slide.shapes[i]
      
    // Look for a shape that matches the given placeholder regex
    let placeholderTypeStr = shape.placeholderType() || ''
    if (placeholderTypeStr.match(placeholderRegex) !== null && shape.hasTextFrame && shape.textFrame.hasText) {	  	
      // Retrieve the text form the shape and add it to the slide title
      let shapeText = shape.textFrame.textRange.content() || ''
      if (shapeText !== '') {
          if (slideText !== '') {
          slideText = slideText + ' ' + shapeText
        } else {
          slideText = shapeText
        }
      }
    }
  }
  
  return slideText
}

function _getActiveSlideShowView() {
  let slideShowWindows = Application('Microsoft PowerPoint').slideShowWindows
  if (slideShowWindows.length <= 0) {
    throw new Error('Slideshow not playing')
  }
  return slideShowWindows[0].slideshowView
}

function _getActiveDocument() {
  let docWindows = Application('Microsoft PowerPoint').documentWindows
  if (docWindows.length <= 0) {
    throw new Error('No loaded documents')
  }
  return docWindows[0]
}

function _getPresenterView() {
  let state = pptGetState()
  if (state !== PPT_STATE.VIEWING) {
    throw new Error('Not currently presenting')
  }

  // Locate the 'presenter view' window
  Application('Microsoft PowerPoint').activate()
  let proc = Application('System Events').processes.byName('Microsoft PowerPoint')
  let presenterViewWin = null
  for(let i = 0; i < proc.windows.length; i++) {
    if (proc.windows[i].name().match(/Presenter View/) != null) {
      presenterViewWin = proc.windows[i]
    }
  }
  
  if (presenterViewWin == null) {
    throw new Error('No presenter view found')  
  }
  
  return presenterViewWin
}

function _jumpToSlide(num) {
  let pViewWin = _getPresenterView()
  let thumbnailList = pViewWin.scrollAreas[0].lists[0]  
  thumbnailList.uiElements[num - 1].click()
}

/******* public helper functions **********/
// get application state
function pptGetState() {
  // Default to closed
  let state = PPT_STATE.CLOSED

  // Test if powerpoint is running
  if (Application('Microsoft PowerPoint').running()) {
    state = PPT_STATE.RUNNING

    // Test if a presentation is loaded (default to editing mode)
    let presentations = Application('Microsoft PowerPoint').presentations
    if (presentations && presentations.length > 0) {
      state = PPT_STATE.EDITING

      // Test if there's a slideShowWindow (aka slideshow is running)
      let slideShowWindows = Application('Microsoft PowerPoint').slideShowWindows
      if (slideShowWindows && slideShowWindows.length > 0) {
        state = PPT_STATE.VIEWING
      }
    }
  }

  // Return the state set from above
  return state
}

// get current slide
function pptGetCurSlide() {
  // Get the active slide
  let slide = _getCurSlide()
  return slide.slideNumber()
}

// get current slide
function pptGetCurSlideSteps() {
  // Get the active slide
  let slide = _getCurSlide()
  return slide.printSteps()
}

// get maximum slide number (not index)
function pptGetMaxSlide() {
  try {
    let presentation = _getCurPresentation()
    return presentation.slides.length
  } catch (e) {
    return 0
  }
}

/******* command functions **********/
// the STATE command
function cmdSTATE() {
  // If not running or no active presentation
  state = pptGetState()
  if (state === PPT_STATE.CLOSED || state === PPT_STATE.RUNNING) {
    return { response: { state: state, position: 0, slides: 0, steps: 0 } }
  }

  // Otherwise, build and return state object
  return {
  	response: {
      state: state,
      position: pptGetCurSlide(),
      slides: pptGetMaxSlide(),
      steps: pptGetCurSlideSteps()
    }
  }
}

// the THUMBS command
function cmdTHUMBS(path) {
  // Check the state and stop a running slideshow
  let state = pptGetState()
  if (state === PPT_STATE.VIEWING) { cmdCTRL('STOP') }
  else if (state !== PPT_STATE.EDITING) {
  	throw new Error('No open presentation to export')
  }

  // Jump to slide 1 so it is selected  
  cmdCTRL('GOTO', '1')
  
  // Trigger the 'Export' command in the 'File' menu
  Application('Microsoft PowerPoint').activate()
  let proc = Application('System Events').processes.byName('Microsoft PowerPoint')

  if (proc.windows.sheets.length > 0) {
	  proc.windows.sheets[0].buttons.byName('Cancel').click()
  }

  let fileMenu = proc.menuBars[0].menuBarItems.byName('File')
  let exportCmd = fileMenu.menus[0].menuItems.byName('Export...')
  exportCmd.click()

  // Select the 'JPEG' format  
  let formatSelector = proc.windows.sheets[0].popUpButtons[1]
  formatSelector.click()
  formatSelector.menus[0].menuItems.byName('JPEG').click()

  // Ensure 'export all slides' is selected
  proc.windows.sheets[0].radioGroups[0].radioButtons[0].click();

  // Navigate to destination folder
  proc.windows.sheets[0].textFields[0].value = '/'
  proc.windows.sheets[0].sheets[0].comboBoxes[0].value = path
  proc.windows.sheets[0].sheets[0].buttons[0].click()

  // Place in thumbs folder
  proc.windows.sheets[0].textFields[0].value = 'thumbs'
  
  // Export
  proc.windows.sheets[0].buttons.byName('Export').click()
  
  // Handle 'replace' dialog
  if (proc.windows.sheets[0].sheets.length > 0) {
  	proc.windows.sheets[0].sheets[0].buttons.byName('Replace').click()
  }

  // Wait for task to finish
  while(proc.windows.length < 2) {
    delay(1)
  }
  
  // Confirm the final dialog
  proc.windows[0].buttons.byName('OK').click()
  return { response: 'ok' }
}

// the INFO command
function cmdINFO() {
  // Get the active presentation
  if (pptGetMaxSlide() === 0) {
    throw new Error('No active presentation')
  }
  let presentation = _getCurPresentation()

  // First, retrieve the slide titles
  let theTitles = []
  for(let s=0; s < presentation.slides.length; s++) {
  	// Get title text from this slide
    let slideTitle = _getShapeText(presentation.slides[s], / title placeholder/)

    // Add the title to the list
    theTitles.push(slideTitle)
  }

  // Second, retrieve the slide notes
  let theNotes = []
  for(let s=0; s < presentation.slides.length; s++) {
   	// Get text from notes of the slide
    let slideNote = _getShapeText(presentation.slides[s].notesPage, /body placeholder/)
    
    // Clean newline characters
    slideNote = slideNote.replace(/\r/g, '\n')
    
    // Add the title to the list
    theNotes.push(slideNote)
  }

  // Return a response object with the titles and notes
  return {
  	response: {
      titles: theTitles,
      notes: theNotes
    }
  }
}

// the control commands
function cmdCTRL(command, arg) {
  let state = pptGetState()
  switch(command) {
    case 'BOOT':
      if (state !== PPT_STATE.CLOSED) {
        throw new Error('application already running')
      }
      Application('Microsoft PowerPoint').activate()
      break
    
    case 'QUIT':
      if (state === PPT_STATE.CLOSED) {
        throw new Error('application not running')
      }
      Application('Microsoft PowerPoint').quit()
      break

    case 'OPEN':
      if (state === PPT_STATE.EDITING || state === PPT_STATE.VIEWING) {
        throw new Error('Presentation already loaded')
      }
      Application('Finder').open(arg, { using: Path('/Applications/Microsoft PowerPoint.app')})
      break
	
    case 'CLOSE':
      // Make sure a presentation is loaded first
      if (state !== PPT_STATE.EDITING && state !== PPT_STATE.VIEWING) {
        throw new Error('No presentation loaded')
      }

      // Close the presentation (always saving if needed)
      Application('Microsoft PowerPoint').close(_getActiveDocument(), { saving: 'yes' })
      break

    case 'START':
      // Make sure there's a loaded presentation that is not already in slideshow mode
      if (state === PPT_STATE.VIEWING) { throw new Error('Slideshow already started') }
      if (state !== PPT_STATE.EDITING) { throw new Error('No presentation loaded') }

      // Start the slideshow in presenter mode
      let showSettings = _getCurPresentation().slideShowSettings
      showSettings.showType = 'slide show type presenter'
      Application('Microsoft PowerPoint').runSlideShow(showSettings)
      break
  
    case 'STOP':
      // Make sure a slideshow is started
      if (state !== PPT_STATE.VIEWING) { throw new Error('Slideshow not currently active') }

      // Stop the slideshow
      _getActiveSlideShowView().exitSlideShow()
      break

    case 'PAUSE':
      if (state !== PPT_STATE.VIEWING) { throw new Error('Slideshow not currently running') }
      _getActiveSlideShowView().slideState = 'slide show state black screen'
      break
    
    case 'RESUME':
      if (state !== PPT_STATE.VIEWING) { throw new Error('Slideshow not currently running') }
      _getActiveSlideShowView().slideState = 'slide show state running'
      break
    
    case 'FIRST':
      if (state === PPT_STATE.EDITING) {
        _getActiveDocument().view.goToSlide({ number: 1 })
      } else if (state === PPT_STATE.VIEWING)  {
        _getActiveSlideShowView().goToFirstSlide()
      } else {
        throw new Error('No loaded presentation')
      }
      break

    case 'LAST':
      if (state === PPT_STATE.EDITING) {
        _getActiveDocument().view.goToSlide({ number: pptGetMaxSlide() })
      } else if (state === PPT_STATE.VIEWING) {
        _getActiveSlideShowView().goToLastSlide()
      } else {
        throw new Error('No loaded presentation')
      }
      break

    case 'GOTO':
      if (state === PPT_STATE.EDITING) {
        _getActiveDocument().view.goToSlide({ number: arg })
      } else if (state === PPT_STATE.VIEWING)  {
        _jumpToSlide(parseInt(arg))
      } else {
        throw new Error('No loaded presentation')
      }
      break

    case 'PREV':
      if (state === PPT_STATE.EDITING) {
        _getActiveDocument().view.goToSlide({ number: pptGetCurSlide() - 1 })
      } else if (state === PPT_STATE.VIEWING)  {
        _getActiveSlideShowView().goToPreviousSlide()
      } else {
        throw new Error('No loaded presentation')
      }
      break

    case 'NEXT':
      if (state === PPT_STATE.EDITING) {
        _getActiveDocument().view.goToSlide({ number: pptGetCurSlide() + 1 })
      } else if (state === PPT_STATE.VIEWING) {
        _getActiveSlideShowView().goToNextSlide()
      } else {
        throw new Error('No loaded presentation')
      }
      break	

    default:
      throw new Error(`Unknown command: '${command}'`)
  }

  return { response: 'ok' }
}

/******* script entry point **********/
// main procedure
function run(argv) {
  // Pargse command arguments
  if (argv.length < 1) {
    console.log(JSON.stringify({ error: 'No command specified' }))
    return
  }
  let cmd = argv[0]
  let arg = ''
  if (argv.length >= 2) {
    arg = argv[1]
  }

  // Execute the command
  let output = {}
  try {
    switch(cmd) {
      case 'STAT': output = cmdSTATE(); break
      case 'INFO': output = cmdINFO(); break
      case 'THUMBS': output = cmdTHUMBS(arg); break

      case 'BOOT': case 'QUIT': case 'OPEN':
      case 'CLOSE': case 'START': case 'STOP':
      case 'PAUSE': case 'RESUME': case 'FIRST':
      case 'LAST': case 'GOTO': case 'PREV':
      case 'NEXT':
        output = cmdCTRL(cmd, arg)
        break

      default:
        output  = { error: 'invalid command' }
        break
    }
  } catch(e) {
    output = { error: e.message }
  }

  // Output the result as a JSON string
  console.log(JSON.stringify(output))
}
