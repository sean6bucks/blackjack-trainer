// ======= IMPORTS
import React, { Component } from 'react';
// import './App.css';

// HELPER FUNCTIONS
import { flatten, randomize, times } from '../scripts/helpers';

// COMPONENTS
import { Dealer } from './Dealer';
import { User } from './User';


// ====== FUNCTIONS

// CREATE AND SHUFFLE DECKS AND SHOE
const deck_vals = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
const deck_suits = [ 'spades', 'hearts', 'clubs', 'diamonds' ];

const createDeck = () => {
    // CREATE ARRAY OF SUITS W/ EACH VALUE AND FLATTEN
	let deck = flatten(
		deck_suits.map( suit => {
			return deck_vals.map( val => {
				return {
					name: val + '-of-' + suit,
					val,
					suit
				};
			});
		})
	);

    // RETURN SHUFFLED DECK
	return shuffleDeck( deck );
};

const shuffleDeck = deck => {
	return randomize( deck );
};

const setShoe = ( num_of_decks = 8 ) => {
	const shoe = [];
    // ADD # OF DECKS IN SHOE PRE-SHUFFLED
	times( num_of_decks, () => {
		shoe.push( createDeck() );
	});
	return flatten( shoe );
};

// ===== TABLE COMPONENT

export class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			shoe: [],
			dealer: {
				cards: []
			},
			user: {
				cards: [],
				bankroll: 0,
				current_bet: 0
			}
		};

		this.dealCards = this.dealCards.bind(this);
	}

    // CUSTOM FUNCTIONS

	dealCards() {
        // MAKE SURE THERE ARE CARDS
		if ( !this.state.shoe.length ) return;
        // IF LESS THAN 25 CARDS LEFT RESET SHOE
		if ( this.state.shoe.length < 25 ) this.setState({ shoe: setShoe() });

		let new_shoe = this.state.shoe,
			user_cards = [],
			dealer_cards = [];

        // TODO: HANDLE BETTER
		times( 2, () => {
			user_cards.push( new_shoe.shift() );
			dealer_cards.push( new_shoe.shift() );
		});

		this.setState({
			shoe: new_shoe,
			user: Object.assign( {}, this.state.user, { cards: user_cards } ),
			dealer: Object.assign( {}, this.state.dealer, { cards: dealer_cards } )
		});
	}

    // LIFECYCLE

	componentWillMount() {
		this.setState({ shoe: setShoe() });
	}

	render() {
		return (
			<div id="Table">
				<Dealer cards={ this.state.dealer.cards } />
				<User cards={ this.state.user.cards } dealClick={ this.dealCards } />
			</div>
		);
	}
};
