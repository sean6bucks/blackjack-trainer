import React from 'react';

import { Cards } from './Cards';

export const Dealer = ( props ) => {

	const hand = props.data;

	return (
		<div id="Dealer">
			<Cards cards={ hand.cards } />
		</div>
	);
};
