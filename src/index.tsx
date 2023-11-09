import { render } from 'preact';
import styles from './style.css?inline';
import { AddressesField } from './AddressesField';
import { useState } from 'preact/hooks';
import { MainTable } from './MainTable';
import { Page } from './types';

export function App() {
	const [page, setPage] = useState<Page>('Field');
	const [addresses, setAddresses] = useState<string>('');

	const onPaste = (newA: string) => {
		setAddresses(newA)
		setPage('Table')
	}

	return (
		<div className="KKSearchUI">
			{page === 'Field' && <AddressesField addresses={addresses} onPaste={onPaste} />}
			{page === 'Table' && <MainTable addresses={addresses} back={() => setPage('Field')} />}
		</div>
	);
}

const root = document.createElement('div');
document.body.appendChild(root);

const style = document.createElement('style');
style.textContent = styles;
document.head.appendChild(style);

render(<App />, root);
