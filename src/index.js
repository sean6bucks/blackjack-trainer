import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import store from './store';
import Table from './components/Table';

const StoreInstance = store();

ReactDOM.render(
	<Provider store={ StoreInstance }>
		<Table />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
