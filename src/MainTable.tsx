import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { AddressItem } from "./types";
import PlayIcon from 'mdi-react/PlayArrowIcon';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import StopIcon from 'mdi-react/StopIcon';
import DownloadIcon from 'mdi-react/DownloadIcon';
import { createRef } from "preact";
import { getCurrentCoordinates } from "./utils/getCurrentCoordinates";
import { searchGoogleMapsAddress } from "./utils/searchGoogleMapsAddress";
import { downloadCSV } from "./utils/downloadCSV";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const MainTable = ({
    addresses,
    back,
    updateItem,
}: {
    addresses: AddressItem[];
    back: () => void;
    updateItem: (id: string, upd: (c: AddressItem) => AddressItem) => void;
}) => {
    function saveCoords(id: string) {
        updateItem(id, c => ({
            ...c,
            coords: getCurrentCoordinates()
        }))
    }

    const rowRefs = useRef(addresses.map(() => createRef()));
    const [hightlightedIndex, setHightlightedIndex] = useState(-1)
    const [autoSearch, setAutoSearch] = useState(false)
    const lastAutoSearchedIndex = useRef(-1)

    const preformAutoSearch = async () => {
        const nextAddressesWithNoCoordsIndex = addresses.findIndex((it, i) => !it.coords && i > lastAutoSearchedIndex.current)

        if (nextAddressesWithNoCoordsIndex === -1) {
            setAutoSearch(false)
            return
        }

        const itemToSearch = addresses[nextAddressesWithNoCoordsIndex]
        lastAutoSearchedIndex.current = nextAddressesWithNoCoordsIndex
        setHightlightedIndex(nextAddressesWithNoCoordsIndex)

        if (rowRefs.current[nextAddressesWithNoCoordsIndex]) {
            rowRefs.current[nextAddressesWithNoCoordsIndex].current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }

        scrollToRow(nextAddressesWithNoCoordsIndex)
        searchGoogleMapsAddress(itemToSearch.address)

        await sleep(2000)

        const coords = getCurrentCoordinates()

        if (!coords) {
            return
        };

        saveCoords(itemToSearch.id)
    }

    function scrollToRow(index: number) {
        rowRefs.current[index]?.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
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
        await sleep(1000)
        const index = addresses.findIndex(it => it.id === addressItem.id)
        setHightlightedIndex(index)
        searchGoogleMapsAddress(addressItem.address)
    }

    function download() {
        const tableHeader = 'Address;Latitude;Longitude'
        const tableContent = addresses
            .map(it => {
                const { address, coords } = it
                const [latitude = '', longitude = ''] = coords.split(',')
                return `${address};${latitude};${longitude}`
            })
            .join('\n')
        const text = `${tableHeader}\n${tableContent}`

        downloadCSV(text, 'addresses.csv')
    }

	return (
		<div class="flex flex-col h-full">
            <div className="overflow-y-auto h-full">
                <table class="w-full">
                    {addresses.map((addressItem, i) => (
                        <tr
                            key={addressItem.id}
                            ref={rowRefs.current[i]}
                            className={hightlightedIndex === i ? 'bg-[#a6ff93]' : ''}
                        >
                            <td className="p-[3px] border border-white border-solid w-full">
                                {addressItem.address}
                            </td>
                            <td className="p-[3px] border border-white border-solid">
                                <div class="flex gap-1">
                                    <button
                                        class="KKSearchUIBtn js-KKSearchUI-searchGoogleMapsAddress-one"
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
                            <td className="p-[3px] border border-white">
                                {addressItem.coords}
                            </td>
                        </tr>
                    ))}
                </table>
            </div>

            <div className="flex items-center gap-1">
                <button onClick={back} className="KKSearchUIBtn inline-flex items-center">
                    <ArrowLeftIcon size="12" className="mr-1" />
                    To field
                </button>

                <button
                    onClick={() => setAutoSearch(!autoSearch)} className="KKSearchUIBtn inline-flex items-center w-full"
                >
                    {!autoSearch ? (
                        <>
                            <PlayIcon size="12" className="mr-1" />
                            Start auto search
                        </>
                    ) : (
                        <>
                            <StopIcon size="12" className="mr-1" />
                            Stop auto search
                        </>
                    )}
                </button>

                <button onClick={download} className="KKSearchUIBtn inline-flex items-center">
                    <DownloadIcon size="12" className="mr-1" />
                    Download CSV
                </button>
            </div>
        </div>
    )
}
