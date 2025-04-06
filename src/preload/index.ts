import { INIT_CLASS_KEY } from '@/constant';
import './index.css'

let timer: number | null = null;

function main() {

    timer = window.setTimeout(() => {
        hideMask()
    }, 5000);

    const hideMask = () => {
        if (timer) {
            window.clearTimeout(timer)
            timer = null
        }
        setTimeout(() => {
            const [root] = document.getElementsByTagName('html')
            if (root) {
                root.setAttribute('data-dimmer-mask', 'hide')
                root.classList.remove(INIT_CLASS_KEY)
            }
        }, 500)
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { info, data = {} } = request
        if (info === 'hideMask') {
            hideMask()
        }
    })
}

main()
