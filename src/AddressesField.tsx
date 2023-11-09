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
            .map(it => ({
                id: Math.random(),
                address: it,
                coords: ''
            }))

        onPaste(v)
    }

    const addressesString = useMemo(() => addresses.map(a => a.address).join('\n'), [addresses])

	return (
		<div>
            <textarea ref={field} value={addressesString} placeholder="Paste addresses" className="w-full border border-solid border-white p-1" style="height: 100px"></textarea>
            <button className="KKSearchUIBtn w-full" onClick={parse}>GO</button>
		</div>
	);
}
