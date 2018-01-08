import React, { Component } from 'react';

export const User = ( props ) => {

	const cards = props.cards
	let labels = ['', ''];
	if ( cards.length ) {
		labels = [ cards[0].name, cards[1].name ];
	}

	return (
		<div id="User">
			<div className="cards">
				<span className="card show-card">{ labels[0] }</span>
				<span className="card hole-card">{ labels[1] }</span>
			</div>
			<div className="actions">
				<button onClick={ props.dealClick }>Deal</button>
			</div>
		</div>
	);
};
