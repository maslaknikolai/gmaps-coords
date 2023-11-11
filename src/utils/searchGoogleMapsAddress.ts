import { createSearchStateProvider } from "../searchStateProvider";
import { sleep } from "./sleep";

export async function searchGoogleMapsAddress(address: string) {
    const searchStateProvider = createSearchStateProvider()

    const f = document.querySelector<HTMLInputElement>('#searchboxinput')
    const b = document.querySelector<HTMLButtonElement>('#searchbox-searchbutton')

    f.value = address;
    b.click();

    await searchStateProvider.onSearchStart()
    await searchStateProvider.onSearchEnd()

    await sleep(300)

    searchStateProvider.destroy()
}
