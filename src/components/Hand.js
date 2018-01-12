import React from 'react';

import { Cards } from './Cards';

export const Hand = ( props ) => {
	const hand = props.data;
	let layout = [
		<Cards key="cards" cards={ hand.cards } />,
		<h2 key="value">{ Array.isArray( hand.value ) ? `${hand.value[0]} / ${hand.value[1]}` : hand.value }</h2>
	];
	if ( props.hand_id === 'dealer' ) layout.reverse()

	return (
		<div className="hand">
			{ layout }
		</div>
	);
};
