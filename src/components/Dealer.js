import React, { Component } from 'react';

export const Dealer = ( props ) => {

	const cards = props.cards
	let labels = ['', ''];
	if ( cards.length ) {
		labels = [ cards[0].name, cards[1].name ];
	}

	return (
		<div id="Dealer">
			<div className="cards">
				<span className="card show-card">{ labels[0] }</span>
				<span className="card hole-card">{ labels[1] }</span>
			</div>
		</div>
	);
};
