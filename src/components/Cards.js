import React from 'react';

const Card = ( props ) => {
	const card = props.card || {};
	const card_img = card.type === 'hole' ? 'hole-card' :  card.name;
	return (
		<li className={ card.type + '-card card' }>
			<img alt={ card_img } src={ 'images/cards/' + card_img + '.png' } />
		</li>
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
			<ul className="card-list">
				{ card_list }
			</ul>
		</div>
	);
};
