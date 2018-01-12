import React from 'react';

const Card = ( props ) => {
	const card = props.card || {};

	return (
		<li className={ card.type + '-card card' }>{ card.name }</li>
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
			<div className="cards-bg">
				<span className="bg-outline"></span>
			</div>
			<ul className="card-list">
				{ card_list }
			</ul>
		</div>
	);
};
