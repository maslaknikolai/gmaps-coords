import { render } from 'preact';
import styles from './style.css?inline';
import { AddressesField } from './AddressesField';
import { useEffect, useState } from 'preact/hooks';
import { MainTable } from './MainTable';
import { AddressItem, Page } from './types';
import classNames from 'classnames';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import { ShowAppButton } from './ShowAppButton';

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

	const [isAppShown, setIsAppShown] = useState(false)

	useEffect(() => { // show/hide app
		const appContainer = document.getElementById('app-container')
		appContainer.style.transition = 'height 0.15s'
		if (isAppShown) {
			appContainer.style.height = '60%'
		} else {
			appContainer.style.removeProperty('height')
		}
	}, [isAppShown])

	return (
		<div className={classNames([
			'fixed left-0 right-0 h-[40%] bg-[#333] text-[#3ba52a] resize-y z-[99999] font-mono text-xs border-t-4 border-black transition-all',
			{
				'bottom-0': isAppShown,
				'bottom-[-40%]': !isAppShown,
			}
		])}>
			<ShowAppButton
				isAppShown={isAppShown}
				onClick={() => setIsAppShown(!isAppShown)}
			/>
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
