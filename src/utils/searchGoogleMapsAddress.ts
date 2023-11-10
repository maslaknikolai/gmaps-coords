import { sleep } from "./sleep";

export async function searchGoogleMapsAddress(address: string) {
    const f = document.querySelector<HTMLInputElement>('#searchboxinput')
    const b = document.querySelector<HTMLButtonElement>('#searchbox-searchbutton')

    f.value = address;
    b.click();

    await waitTillSearchEnd()
}

async function waitTillSearchEnd() {
    const trigger = document.getElementById('omnibox-singlebox');

    await waitClassChange(true)
    await waitClassChange(false)

    await sleep(300) // wait for render content

    function waitClassChange(shouldHasClass: boolean) {
        return new Promise<void>(resolve => {
            const interval = setInterval(() => {
                const passed = shouldHasClass ? trigger.className : !trigger.className
                if (!passed) return;
                clearInterval(interval)
                resolve()
            }, 100)
        })
    }
}