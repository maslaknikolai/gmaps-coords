export const MainTable = ({
    addresses,
    back,
}: {
    addresses: string;
    back: () => void;
}) => {
    const items = addresses.split('\n').filter(Boolean)

	return (
        <>
            <button onClick={back} className="KKSearchUIBtn">
                ^
            </button>

            <table class="KKSearchUI__table">
                {items.map(address => (
                    <tr>
                        <td>${address}</td>
                        <td>
                            <button
                                class="KKSearchUIBtn js-KKSearchUI-search-one"
                                data-address={address}
                            >
                                Get coords
                            </button>
                        </td>
                    </tr>
                ))}
            </table>
        </>
    )
}
