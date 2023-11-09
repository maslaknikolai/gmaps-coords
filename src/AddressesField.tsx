import { useRef } from "preact/hooks";

export const AddressesField = ({
    onPaste,
    addresses = ''
}: {
    onPaste: (addresses: string) => void,
    addresses: string
}) => {
    const field = useRef(null)

    const parse = () => {
        onPaste(field.current.value)
    }

	return (
		<div>
            <textarea ref={field} value={addresses} placeholder="Paste addresses" className="w-full border border-solid border-white p-1" style="height: 100px"></textarea>
            <button className="KKSearchUIBtn w-full" onClick={parse}>GO</button>
		</div>
	);
}
