import { DEFAULT_CONFIG } from '@/constant'

let state = {
  isGlobal: false,
  isDark: false,
  config: DEFAULT_CONFIG,
  showMask: true,
}

const MASK_STYLES = {
  SHOW: `
    html::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.95);
      pointer-events: none;
      z-index: 2147483647;
      transition: opacity 0.3s ease;
    }
  `,
  HIDE: `
    html::before {
      display: none !important;
    }
  `
}

const LOADING_TIMEOUT = 5000
const loadingTimers = new Map<number, NodeJS.Timeout>()

const handleMaskControl = (tabId: number, show: boolean) => {
  state.showMask = show
  chrome.scripting.insertCSS({
    target: { tabId },
    css: show ? MASK_STYLES.SHOW : MASK_STYLES.HIDE
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setGlobal') {
    state = {
      ...state,
      ...message.state,
    }
  }

  if (message.action === 'getGlobal') {
    if (state.showMask && sender.tab?.id) {
      handleMaskControl(sender.tab.id, false)
    }
    sendResponse({ state })
  }
})

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-mode") {
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
  if (loadingTimers.has(tabId)) {
    clearTimeout(loadingTimers.get(tabId))
    loadingTimers.delete(tabId)
  }

  if (changeInfo.status === 'loading') {
    handleMaskControl(tabId, true)
    const timer = setTimeout(() => {
      handleMaskControl(tabId, false)
      loadingTimers.delete(tabId)
    }, LOADING_TIMEOUT)
    loadingTimers.set(tabId, timer)
  } else if (changeInfo.status === 'complete'
     || changeInfo.status === 'failed') {
    handleMaskControl(tabId, false)
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  if (loadingTimers.has(tabId)) {
    clearTimeout(loadingTimers.get(tabId))
    loadingTimers.delete(tabId)
  }
})

export {}
