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
import { createSearchStateProvider } from "./searchStateProvider";

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

    const [isSearchInProgress, setIsSearchInProgress] = useState(false)
    const rowRefs = useRef(addresses.map(() => createRef()));
    const [hightlightedIndex, setHightlightedIndex] = useState(-1)
    const [autoSearch, setAutoSearch] = useState(false)
    const queue = useRef<AddressItem[]>([])
    const processing = useRef(false)

    useEffect(() => { // sync search state
        const searchStateProvider = createSearchStateProvider()
        searchStateProvider.onChange(setIsSearchInProgress)
        return searchStateProvider.destroy
    }, [setIsSearchInProgress])

    useEffect(() => { // process queue
        function createInterval() {
            const interval = setInterval(() => {
                if (isSearchInProgress || queue.current.length === 0 || processing.current) {
                    return
                }
                processing.current = true;

                const first = queue.current.shift();
                const index = addresses.findIndex(it => it.id === first.id)

                scrollToRow(index)
                setHightlightedIndex(index)

                searchGoogleMapsAddress(first.address)
                    .then(() => {
                        const coords = getCurrentCoordinates()
                        if (!coords) return;
                        saveCoords(first.id)
                    })
                    .finally(() => {
                        processing.current = false
                    })

                function scrollToRow(index: number) {
                    rowRefs.current[index]?.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 10)

            return interval
        }

        const interval = createInterval()
        return () => clearInterval(interval)
    }, [isSearchInProgress, queue, processing, addresses, setHightlightedIndex])

    function startAutoSearch() {
        setAutoSearch(true)

        const afterHighlighted = addresses.slice(hightlightedIndex + 1).filter(it => !it.coords)
        const beforeHighlighted = addresses.slice(0, hightlightedIndex + 1).filter(it => !it.coords)
        const newQueue = [...afterHighlighted, ...beforeHighlighted]

        queue.current = newQueue
    }

    function stopAutosearch() {
        setAutoSearch(false)
        queue.current = []
    }

    function toggleAutosearch() {
        if (autoSearch) {
            stopAutosearch()
        } else {
            startAutoSearch()
        }
    }

    async function searchOne(addressItem: AddressItem) {
        stopAutosearch()
        queue.current = [addressItem]
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
                    onClick={toggleAutosearch} className="KKSearchUIBtn inline-flex items-center w-full"
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
