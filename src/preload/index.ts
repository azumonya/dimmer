import { INIT_CLASS_KEY } from '@/constant'
import './index.css'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { info, data = {} } = request
  if (info === 'initDimmer') {
    initDimmer()
  }
  if (info === 'hideMask') {
    hideMask()
  }
})

let timeoutTimer: NodeJS.Timeout | null = null
let hideTimer: NodeJS.Timeout | null = null
const TIMEOUT_TIME = 3000

const initDimmer = () => {
  const root = document.querySelector('html')
  if (!root) return
  root.classList.add(INIT_CLASS_KEY)
  if (!timeoutTimer) {
    timeoutTimer = setTimeout(() => {
      hideMask()
      timeoutTimer = null
    }, TIMEOUT_TIME)
  }
}

const hideMask = () => {
  const root = document.querySelector('html')
  if (!root) return
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
    root.setAttribute('data-dimmer-mask', 'hide')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove(INIT_CLASS_KEY)
      })
    })
  } else {
    hideTimer = setTimeout(() => {
      root.setAttribute('data-dimmer-mask', 'hide')
      root.classList.remove(INIT_CLASS_KEY)
      hideTimer = null
    }, 100)
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

function main() {
  initDimmer()
}

main()
