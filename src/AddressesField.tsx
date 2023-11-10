import { useMemo, useRef } from "preact/hooks";
import { AddressItem } from "./types";

export const AddressesField = ({
    onPaste,
    addresses,
}: {
    onPaste: (addresses: AddressItem[]) => void,
    addresses: AddressItem[]
}) => {
    const field = useRef(null)

    const parse = () => {
        const v: AddressItem[] = field.current.value
            .split('\n')
            .filter(Boolean)
            .map(it => {
                const [address, coords = ''] = it.split(';')

                return {
                    id: Math.random(),
                    address,
                    coords
                }
            })

        onPaste(v)
    }

    const addressesString = useMemo(() => {
        return addresses
            .map(it => `${it.address};${it.coords}`)
            .join('\n')
    }, [addresses])

	return (
		<div class="flex flex-col h-full">
            <textarea
                ref={field}
                value={addressesString}
                placeholder="Paste
                addresses"
                className="w-full border border-solid border-white p-1 h-full block"
            ></textarea>

            <button className="KKSearchUIBtn w-full" onClick={parse}>GO</button>
		</div>
	);
}
