import { render } from 'preact';
import styles from './style.css?inline';

export function App() {
	return (
		<div className="KKSearchUI">
			hehe
		</div>
	);
}

const root = document.createElement('div');
document.body.appendChild(root);

const style = document.createElement('style');
style.textContent = styles;
document.head.appendChild(style);

render(<App />, root);
