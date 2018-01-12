// ======= IMPORTS
import React, { Component } from 'react';
// import './App.css';

// HELPER FUNCTIONS
import { flatten, shuffle, isArray, isFunction } from 'lodash';
import { times } from '../scripts/helpers';

// COMPONENTS
import { Hand } from './Hand';
import { Actions } from './Actions';
import { Results } from './Results';

// ====== STATIC VALUES

const deck_vals = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
const deck_suits = [ 'spades', 'hearts', 'clubs', 'diamonds' ];


// ====== FUNCTIONS

const newHand = () => {
	return {
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
};

// CREATE AND SHUFFLE DECKS AND SHOE
const setCardValue = val => {
	if ( val === 'A' ) return 11;
	else if ( ['J', 'Q', 'K'].indexOf(val) > -1 ) return 10;
	else return parseInt( val, 0 );
};

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
	return shuffle( deck );
};

const setShoe = ( num_of_decks = 8 ) => {
	const shoe = [];
    // ADD # OF DECKS IN SHOE PRE-SHUFFLED
	times( num_of_decks, () => {
		shoe.push( createDeck() );
	});

	return flatten( shoe );
};

const handValue = ( hand=[] ) => {
	// REDUCER FUNCTION
	const reducer = ( sum, current_val ) => {
		if ( current_val === 11 && sum >= 11 ) {
			current_val = 1;
		}
		return sum + current_val;
	}

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
};

const checkBlackjack = ( cards=[], value=0 ) => {
	return cards.length === 2 && value === 21;
};

const checkBust = hand_val => {
	return typeof hand_val === 'number' && hand_val > 21;
};

const getResults = ( user_val, dealer_val ) => {
	if ( dealer_val > 21 ) {
		return {
			winner: 'user',
			message: 'Dealer Busts!'
		};
	} else if ( user_val > 21 || dealer_val > user_val ) {
		return {
			winner: 'dealer',
			message: dealer_val === 21 ? 'Dealer has BlackJack.' : user_val > 21 ? 'Player Busts.' : 'Dealer Wins.'
		};
	} else if ( user_val === dealer_val ) {
		return {
			winner: 'push',
			message: 'Push'
		}
	} else {
		return {
			winner: 'user',
			message: user_val === 21 ? 'Player has BlackJack!' : 'Player Wins!'
		};
	}
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
	}

    // CUSTOM FUNCTIONS

	startSession = () => {
		console.log( 'Session Started' );
		this.setState( () => {
			return {
				status: 'deal',
				shoe: setShoe()
			}
		});
	}

	startNewHand = () => {
		console.log('New Hand');
        // IF LESS THAN 12 CARDS LEFT RESET SHOE
		if ( this.state.shoe.length < 12 ) this.setState({ shoe: setShoe() });
        // RESET HANDS AND DEAL NEW CARDS
		this.setState( newHand(), () => {
			// TODO: HANDLE BETTER
			times( 2, () => {
				for ( let player of [ 'user', 'dealer' ] ) {
					this.dealCard( player, this.state[player].cards );
				}
			});

			this.setState({
				status: 'user'
			});
		});
	}

	standHand = () => {
		this.setState({
			status: 'dealer'
		}, () => {
			this.runDealerHand();
		})
	}

	runDealerHand = () => {
		const value = this.state.dealer.value;
        // DEALER HITS ON SOFT 17 OR BELOW HARD 17
		if ( ( isArray(value) && value[0] <= 17 ) || ( !isArray(value) && value < 17 ) ) {
			this.dealCard( 'dealer', () => {
				this.runDealerHand();
			} );
		} else {
			this.endHand();
		}
	}

	dealCard = ( player, callback ) => {
		let new_shoe = this.state.shoe,
			new_cards = this.state[player].cards;

        // MOVE NEW CARD FROM SHOE TO HAND
		new_cards.push( new_shoe.shift() );

        // UPDATE STATE
		const value = handValue( new_cards );
		this.setState( (prevState, props) => {
			return {
				shoe: new_shoe,
				[player]: Object.assign( {}, this.state[player], {
					cards: new_cards,
					value
				})
			};
		}, () => {
            // CHECK LATEST HAND RESULTS
			if ( checkBlackjack( new_cards, value ) || checkBust( value ) ) {
				this.endHand();
			}

			if ( isFunction(callback) ) callback();
		});
	}

	endHand = () => {
		let result = getResults( this.state.user.value, this.state.dealer.value );

		this.setState({
			status: 'end',
			result
		});
	}

    // LIFECYCLE

	render() {
		return (
			<main id="Table">
				<section id="Dealer">
					<Hand hand_id="dealer" data={ this.state.dealer } />
				</section>
				<section id="User">
					<Hand hand_id="user" data={ this.state.user } />
					<Actions
						status={ this.state.status }
						user={ this.state.user }
						startClick={ this.startSession }
						dealClick={ this.startNewHand }
						hitClick={ this.dealCard }
						standClick={ this.standHand } />
				</section>
				<Results status={ this.state.status } result={ this.state.result }/>
			</main>
		);
	}
};
