import React from 'react';

const Card = ( props ) => {
	const card = props.card || {};
	return (
		<span className={ card.type + '-card card' }>{ card.name }</span>
	);
}

export const Cards = ( props ) => {
	const card_list = props.cards.map( card => {
		return (
			<Card key={ card.name } card={ card } />
		);
	});

	return (
		<div className="cards">
			{ card_list }
		</div>
	);
};
