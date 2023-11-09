import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { AddressItem } from "./types";

export const MainTable = ({
    addresses,
    back,
    updateItem,
}: {
    addresses: AddressItem[];
    back: () => void;
    updateItem: (id: string, upd: (c: AddressItem) => AddressItem) => void;
}) => {
    function search(addressItem: AddressItem) {
        const f = document.querySelector<HTMLInputElement>('#searchboxinput')
        const b = document.querySelector<HTMLButtonElement>('#searchbox-searchbutton')

        f.value = addressItem.address;
        b.click();
    }

    function getCurrentCoordinates() {
        const match = document.location.href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        return match ? [match[1], match[2]].join(',') : '';
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function saveCoords(id: string) {
        updateItem(id, c => ({
            ...c,
            coords: getCurrentCoordinates()
        }))
    }

    const [autoSearch, setAutoSearch] = useState(false)
    const lastAutoSearchedIndex = useRef(-1)

    const preformAutoSearch = async () => {
        const nextAddressesWithNoCoordsIndex = addresses.findIndex(it => !it.coords)

        if (nextAddressesWithNoCoordsIndex === -1) {
            return
        }

        const indexToSearch = Math.max(nextAddressesWithNoCoordsIndex, lastAutoSearchedIndex.current + 1)
        const addressToSearch = addresses[indexToSearch]

        lastAutoSearchedIndex.current = indexToSearch

        search(addressToSearch)

        await sleep(2000)

        const coords = getCurrentCoordinates()

        if (!coords) {
            return
        };

        saveCoords(addressToSearch.id)
    }

    useEffect(() => {
        if (!autoSearch) return;

        preformAutoSearch()
        const interval = setInterval(preformAutoSearch, 4000)

        return () => {
            clearInterval(interval)
        }
    }, [autoSearch])

    async function searchOne(addressItem: AddressItem) {
        if (autoSearch) {
            setAutoSearch(false)
            await sleep(2000)
        }
        search(addressItem)
    }

	return (
        <>
            <button onClick={back} className="KKSearchUIBtn">
                ^
            </button>

            <button onClick={() => setAutoSearch(!autoSearch)} className="KKSearchUIBtn">
                {!autoSearch ? 'Start auto search' : 'Stop auto search'}
            </button>

            <table class="KKSearchUI__table">
                {addresses.map(addressItem => (
                    <tr key={addressItem.id}>
                        <td>
                            {addressItem.address}
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <button
                                    class="KKSearchUIBtn js-KKSearchUI-search-one"
                                    onClick={() => searchOne(addressItem)}
                                >
                                    Search
                                </button>

                                <button
                                    class="KKSearchUIBtn js-KKSearchUI-search-one"
                                    onClick={() => saveCoords(addressItem.id)}
                                >
                                    Use current coords
                                </button>
                            </div>
                        </td>
                        <td>
                            {addressItem.coords}
                        </td>
                    </tr>
                ))}
            </table>
        </>
    )
}
