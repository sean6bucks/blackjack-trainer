import React from 'react';

import { isArray } from 'lodash';

import { Cards } from './Cards';

export const Hand = ( props ) => {
	const hand = props.data;

    // DISPLAY SOFT/HARD OR JUST HARD VALUES
	const hand_val = isArray( hand.value ) ? `${hand.value[0]} / ${hand.value[1]}` : hand.value;
    // SHOW VALUE ONLY IF GREATER THAN 0
	const show_val = () => {
		return hand_val ? <h2 key="value">{ hand_val }</h2> : null;
	};

	let layout = [
		show_val(),
		<Cards key="cards" cards={ hand.cards } />
	];
	if ( props.hand_id === 'dealer' ) layout.reverse()

	return (
		<div className="hand">
			{ layout }
		</div>
	);
};
