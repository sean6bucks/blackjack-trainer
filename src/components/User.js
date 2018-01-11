import React from 'react';

import { Cards } from './Cards';

export const User = ( props ) => {

	const hand = props.data;

	return (
		<div id="User">
			<Cards cards={ hand.cards } />
			<div className="actions">
				<span className="button" onClick={ props.dealClick }>Deal</span>
			</div>
		</div>
	);
};
