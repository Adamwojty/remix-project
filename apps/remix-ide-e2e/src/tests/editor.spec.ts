'use strict'

import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {

  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done)
  },

  'Should zoom in editor': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('div[data-id="mainPanelPluginsContainer"]')
      .clickLaunchIcon('filePanel')
      .waitForElementVisible('div[data-id="filePanelFileExplorerTree"]')
      .openFile('contracts')
      .openFile('contracts/1_Storage.sol')
      .waitForElementVisible('*[data-id="editorInput"]')
      .checkElementStyle('*[data-id="editorInput"]', 'font-size', '12px')
      .click('*[data-id="tabProxyZoomIn"]')
      .click('*[data-id="tabProxyZoomIn"]')
      .checkElementStyle('*[data-id="editorInput"]', 'font-size', '14px')
  },

  'Should zoom out editor': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
      .checkElementStyle('*[data-id="editorInput"]', 'font-size', '14px')
      .click('*[data-id="tabProxyZoomOut"]')
      .click('*[data-id="tabProxyZoomOut"]')
      .checkElementStyle('*[data-id="editorInput"]', 'font-size', '12px')
  },

  'Should display compile error in editor': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
      .waitForElementVisible('*[class="ace_content"]')
      .click('*[class="ace_content"]')
      .editorScroll('down', 27) // scroll down to line 27 and add the error word
      .sendKeys('*[class="ace_text-input"]', 'error')
      .waitForElementVisible('.ace_error', 120000)
      .checkAnnotations('error', 28)
      .clickLaunchIcon('udapp')
      .checkAnnotationsNotPresent('error')
      .clickLaunchIcon('solidity')
      .checkAnnotations('error', 28)
  },

  'Should minimize and maximize codeblock in editor': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
      .waitForElementVisible('.ace_open')
      .click('.ace_start:nth-of-type(1)')
      .waitForElementVisible('.ace_closed')
      .click('.ace_start:nth-of-type(1)')
      .waitForElementVisible('.ace_open')
  },

  'Should add breakpoint to editor': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
      .waitForElementNotPresent('.ace_breakpoint')
      .click('.ace_gutter-cell:nth-of-type(1)')
      .waitForElementVisible('.ace_breakpoint')
  },

  'Should load syntax highlighter for ace light theme': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
      .checkElementStyle('.ace_keyword', 'color', aceThemes.light.keyword)
      .checkElementStyle('.ace_comment.ace_doc', 'color', aceThemes.light.comment)
      .checkElementStyle('.ace_function', 'color', aceThemes.light.function)
      .checkElementStyle('.ace_variable', 'color', aceThemes.light.variable)
  },

  'Should load syntax highlighter for ace dark theme': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
      .click('*[data-id="verticalIconsKindsettings"]')
      .waitForElementVisible('*[data-id="settingsTabThemeLabelDark"]')
      .click('*[data-id="settingsTabThemeLabelDark"]')
      .pause(2000)
      .waitForElementVisible('*[data-id="editorInput"]')
    /* @todo(#2863) ch for class and not colors
    .checkElementStyle('.ace_keyword', 'color', aceThemes.dark.keyword)
    .checkElementStyle('.ace_comment.ace_doc', 'color', aceThemes.dark.comment)
    .checkElementStyle('.ace_function', 'color', aceThemes.dark.function)
    .checkElementStyle('.ace_variable', 'color', aceThemes.dark.variable)
    */
  },

  'Should highlight source code': function (browser: NightwatchBrowser) {
    // include all files here because switching between plugins in side-panel removes highlight
    browser
      .addFile('sourcehighlight.js', sourcehighlightScript)
      .addFile('removeSourcehighlightScript.js', removeSourcehighlightScript)
      .addFile('removeAllSourcehighlightScript.js', removeAllSourcehighlightScript)
      .openFile('sourcehighlight.js')
      .executeScript('remix.exeCurrent()')
      .editorScroll('down', 60)
      .pause(1000)
      .waitForElementPresent('.highlightLine32', 60000)
      .pause(1000)
      .checkElementStyle('.highlightLine32', 'background-color', 'rgb(8, 108, 181)')
      .pause(1000)
      .waitForElementPresent('.highlightLine40', 60000)
      .pause(1000)
      .checkElementStyle('.highlightLine40', 'background-color', 'rgb(8, 108, 181)')
      .waitForElementPresent('.highlightLine50', 60000)
      .checkElementStyle('.highlightLine50', 'background-color', 'rgb(8, 108, 181)')
  },

  'Should remove 1 highlight from source code': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('li[data-id="treeViewLitreeViewItemremoveSourcehighlightScript.js"]')
      .click('li[data-id="treeViewLitreeViewItemremoveSourcehighlightScript.js"]')
      .pause(2000)
      .executeScript('remix.exeCurrent()')
      .waitForElementVisible('li[data-id="treeViewLitreeViewItemcontracts"]')
      .click('li[data-id="treeViewLitreeViewItemcontracts"]')
      .waitForElementVisible('li[data-id="treeViewLitreeViewItemcontracts/3_Ballot.sol"]')
      .click('li[data-id="treeViewLitreeViewItemcontracts/3_Ballot.sol"]')
      .waitForElementNotPresent('.highlightLine32', 60000)
      .checkElementStyle('.highlightLine40', 'background-color', 'rgb(8, 108, 181)')
      .checkElementStyle('.highlightLine50', 'background-color', 'rgb(8, 108, 181)')
  },

  'Should remove all highlights from source code': function (browser: NightwatchBrowser) {
    browser.waitForElementVisible('li[data-id="treeViewLitreeViewItemremoveAllSourcehighlightScript.js"]')
      .click('li[data-id="treeViewLitreeViewItemremoveAllSourcehighlightScript.js"]')
      .pause(2000)
      .executeScript('remix.exeCurrent()')
      .waitForElementVisible('li[data-id="treeViewLitreeViewItemcontracts/3_Ballot.sol"]')
      .click('li[data-id="treeViewLitreeViewItemcontracts/3_Ballot.sol"]')
      .pause(2000)
      .waitForElementNotPresent('.highlightLine32', 60000)
      .waitForElementNotPresent('.highlightLine40', 60000)
      .waitForElementNotPresent('.highlightLine50', 60000)
      .end()
  }
}

const aceThemes = {
  light: {
    keyword: 'rgb(147, 15, 128)',
    comment: 'rgb(35, 110, 36)',
    function: 'rgb(0, 0, 162)',
    variable: 'rgb(253, 151, 31)'
  },
  dark: {
    keyword: 'rgb(0, 105, 143)',
    comment: 'rgb(85, 85, 85)',
    function: 'rgb(0, 174, 239)',
    variable: 'rgb(153, 119, 68)'
  }
}

const sourcehighlightScript = {
  content: `
  (async () => {
    try {
        const pos = {
            start: {
                line: 32,
                column: 3
            },
            end: {
                line: 32,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos, 'contracts/3_Ballot.sol')
        
         const pos2 = {
            start: {
                line: 40,
                column: 3
            },
            end: {
                line: 40,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos2, 'contracts/3_Ballot.sol')
        
         const pos3 = {
            start: {
                line: 50,
                column: 3
            },
            end: {
                line: 50,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos3, 'contracts/3_Ballot.sol')
    } catch (e) {
        console.log(e.message)
    }
  })()
  `
}

const removeSourcehighlightScript = {
  content: `
  (async () => {
    try {
        await remix.call('editor', 'discardHighlightAt', 32, 'contracts/3_Ballot.sol')         
    } catch (e) {
        console.log(e.message)
    }
  })()
  `
}

const removeAllSourcehighlightScript = {
  content: `
  (async () => {
    try {
        await remix.call('editor', 'discardHighlight')         
    } catch (e) {
        console.log(e.message)
    }
  })()
  `
}
