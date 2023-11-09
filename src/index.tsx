import { render } from 'preact';
import styles from './style.css?inline';
import { AddressesField } from './AddressesField';
import { useEffect, useState } from 'preact/hooks';
import { MainTable } from './MainTable';
import { AddressItem, Page } from './types';

export function App() {
	const [page, setPage] = useState<Page>(localStorage.page || 'Field');
	const [addresses, setAddresses] = useState<AddressItem[]>(() => {
		try {
			return JSON.parse(localStorage.addresses || '[]');
		} catch {
			return [];
		}
	});

	useEffect(() => { localStorage.page = page; }, [page]);
	useEffect(() => { localStorage.addresses = JSON.stringify(addresses); }, [addresses]);

	const onPaste = (newA: AddressItem[]) => {
		setAddresses(newA)
		setPage('Table')
	}

	function updateItem(id: string, upd: (c: AddressItem) => AddressItem) {
		setAddresses((c) => c.map((it) => (it.id === id ? upd(it) : it)))
	}

	return (
		<div className="KKSearchUI">
			{page === 'Field' && <AddressesField addresses={addresses} onPaste={onPaste} />}
			{page === 'Table' && (
				<MainTable
					addresses={addresses}
					back={() => setPage('Field')}
					updateItem={updateItem}
				/>
			)}
		</div>
	);
}

const root = document.createElement('div');
document.body.appendChild(root);

const style = document.createElement('style');
style.textContent = styles;
document.head.appendChild(style);

render(<App />, root);
