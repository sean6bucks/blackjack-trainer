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

const setCardValue = val => {
	if ( val === 'A' ) return 11;
	else if ( ['J', 'Q', 'K'].indexOf(val) > -1 ) return 10;
	else return parseInt( val );
}

const createDeck = () => {
    // CREATE ARRAY OF SUITS W/ EACH VALUE AND FLATTEN
	let deck = flatten(
		deck_suits.map( suit => {
			return deck_vals.map( val => {
				return {
					name: val + '-of-' + suit,
					value: setCardValue(val),
					type: 'show'
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

const handValue = hand => {
	// REDUCER FUNCTION
	const reducer = ( sum, current_val ) => sum + current_val;

    // GET HAND VALUES ONLY
	let values = hand.map( card => card.value );
	const value = values.reduce(reducer);

    // IF 'A'/11 HANDLE POSSIBLE VALUES
	if ( values.includes(11) && value !== 21 ) {
        // IF LESS THAN 21 RETURN ARRAY OF SOFT/HARD VALS > ELSE JUST HARD VAL
		return value < 21 ? [ value, values.reduce(reducer, -10) ] : values.reduce(reducer, -10);
	}
    // ELSE JUST RETURN SUM
	return value;
}

const checkBlackjack = hand_val => {
	return hand_val === 21;
};

// ===== TABLE COMPONENT

export class Table extends Component {
	constructor (props) {
		super(props);

		this.state = {
			status: 'start',
			shoe: [],
			dealer: {
				cards: [],
				value: 0
			},
			user: {
				cards: [],
				value: 0
			},
			result: {
				winner: '',
				message: ''
			}
		};

		this.resetHand = this.resetHand.bind(this);
		this.dealHand = this.dealHand.bind(this);
		this.endHand = this.endHand.bind(this);
	}

    // CUSTOM FUNCTIONS

	resetHand() {
		// TODO: REMOVE ON HAND STATUS
		let deal_data = this.state.dealer;
		deal_data.cards = [];

		let user_data = this.state.user;
		user_data.cards = [];

		this.setState( (prevState, props) => ({
			dealer: deal_data,
			user: user_data
		}) );

		this.dealHand();
	}

	dealHand() {

        // MAKE SURE THERE ARE CARDS
		if ( !this.state.shoe.length ) return;
        // IF LESS THAN 25 CARDS LEFT RESET SHOE
		if ( this.state.shoe.length < 25 ) this.setState({ shoe: setShoe() });

        // TODO: HANDLE BETTER
		times( 2, () => {
			this.dealCard( 'user', this.state.user.cards );
			this.dealCard( 'dealer', this.state.dealer.cards );
		});

        // AFTER DEAL CHECK FOR BJ
		if ( checkBlackjack( this.state.dealer.value ) ||
			checkBlackjack( this.state.user.value ) ) this.endHand();
	}

	dealCard( player, hand=[] ) {
		let new_shoe = this.state.shoe,
			new_cards = hand;

        // MOVE NEW CARD FROM SHOE TO HAND
		new_cards.push( new_shoe.shift() );
		// SET DEALER HOLE CARD IF FIRST CARD
		// if ( player === 'dealer' && new_cards.length === 1 )
		// 	new_cards[0].type = 'hole';

        // UPDATE STATE
		this.setState({
			shoe: new_shoe,
			[player]: Object.assign( {}, this.state[player], {
				cards: new_cards,
				value: handValue( new_cards )
			} )
		});
	}



	endHand() {
		alert('blackjack');
	}

    // LIFECYCLE

	componentWillMount() {
		this.setState({ shoe: setShoe() });
	}

	render() {
		return (
			<div id="Table">
				<Dealer data={ this.state.dealer } />
				<User data={ this.state.user } dealClick={ this.resetHand } />
			</div>
		);
	}
};
