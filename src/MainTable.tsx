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

    const [hightlightedIndex, setHightlightedIndex] = useState(-1)

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
        setHightlightedIndex(indexToSearch)

        search(addressToSearch)

        await sleep(2000)

        const coords = getCurrentCoordinates()

        if (!coords) {
            return
        };

        saveCoords(addressToSearch.id)
    }

    useEffect(() => {
        if (!autoSearch) {
            setHightlightedIndex(-1);
            lastAutoSearchedIndex.current = -1
            return
        };

        preformAutoSearch()
        const interval = setInterval(preformAutoSearch, 4000)

        return () => {
            clearInterval(interval)
        }
    }, [autoSearch])

    async function searchOne(addressItem: AddressItem) {
        setAutoSearch(false)
        const index = addresses.findIndex(it => it.id === addressItem.id)
        setHightlightedIndex(index)
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
                {addresses.map((addressItem, i) => (
                    <tr
                        key={addressItem.id}
                        className={hightlightedIndex === i ? 'bg-[#a6ff93]' : ''}
                    >
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
