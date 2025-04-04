import { DEFAULT_CONFIG } from '@/constant'

let state = {
  isGlobal: false,
  isDark: false,
  excludeUrls: '',
  config: DEFAULT_CONFIG,
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setGlobal') {
    state = {
      ...state,
      ...message.state,
    }
  }

  if (message.action === 'getGlobal') {
    sendResponse({ state })
  }
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle_dark_mode') {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const [{ id }] = tabs
        if (id) {
          let message = {
            info: 'toggleMode',
          }
          chrome.tabs.sendMessage(id, message, (res) => {})
        }
      },
    )
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.status === 'failed') {
    chrome.tabs.sendMessage(tabId, { info: 'hideMask' })
  }
})

export {}
