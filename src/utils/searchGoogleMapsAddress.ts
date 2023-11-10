export function searchGoogleMapsAddress(address: string) {
    const f = document.querySelector<HTMLInputElement>('#searchboxinput')
    const b = document.querySelector<HTMLButtonElement>('#searchbox-searchbutton')

    f.value = address;
    b.click();
}