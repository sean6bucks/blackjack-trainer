// ======= IMPORTS
import React, { Component } from 'react';
// import './App.css';

// HELPER FUNCTIONS
import _ from 'lodash';
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
	let deck = _.flatten(
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
	return _.shuffle( deck );
};

const newShoe = ( num_of_decks = 8 ) => {
	const shoe = [];
    // ADD # OF DECKS IN SHOE PRE-SHUFFLED
	times( num_of_decks, () => {
		shoe.push( createDeck() );
	});

	return _.flatten( shoe );
};

export const handValue = ( hand=[] ) => {
    // GET HAND VALUES ONLY
	let values = hand.map( card => card.value );
    // HAND HAS ATLEAST ONE ACE
	const ace = values.includes(11);
	const value = _.reduce( values, (sum, current_val) => {
		if ( current_val === 11 ) current_val = 1;
		return sum + current_val;
	}, 0);
    // IF HAND HAS ACE ALWAYS RETURN HARD 21
	if ( ace && value === 11 ) return value + 10;
	// ELSE IF ACE AND VAL IS LESS THAN 11 RETURN [SOFT, HARD]
	else if ( ace && value < 12 ) return [ value + 10, value ];
	// ELSE JUST RETURN VAL
	else return value;
};

export const checkBlackjack = ( ...hands ) => {
	return _.find( hands, cards => {
		return cards.length === 2 && 21 === handValue( cards );
	}) ? true : false;
};

export const checkBust = hand => {
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
				shoe: newShoe()
			}
		});
	}

	resetHand = ( callback ) => {
		let new_hand = newHand();
		// IF LESS THAN 12 CARDS LEFT RESET SHOE
		if ( this.state.shoe.length < 12 ) {
			_.assign( new_hand, {
				shoe: newShoe()
			});
		}

		this.setState( new_hand, () => {
			if ( _.isFunction( callback ) ) {
				callback();
			}
		});
	}

	dealHands = () => {
		console.log('New Hand');

		times( 2, () => {
			for ( let player of [ 'user', 'dealer' ] ) {
				this.dealCard( player, this.state[player].cards );
			}
		});
        // UPDATE STATUS AND VALUE OF ONLY USER'S HAND
		this.setState({
			status: 'user',
			user: _.assign( {}, this.state.user, {
				value: handValue( this.state.user.cards )
			})
		}, () => {
            // CHECK FOR BLACKJACKS
			if ( checkBlackjack( this.state.user.cards, this.state.dealer.cards ) ) {
				this.endHand();
			}
		});
	}

	hithand = ( player ) => {
		const hand = this.state[player],
			  cards = hand.cards;

		this.dealCard( player, cards );
		this.setState({
			user: _.assign( {}, hand, {
				value: handValue( cards )
			})
		});
	}

	standHand = () => {
		this.setState({
			status: 'dealer'
		}, () => {
			this.runDealerAction();
		})
	}

	runDealerAction = () => {
		const value = this.state.dealer.value;
        // DEALER HITS ON SOFT 17 OR BELOW HARD 17
		if ( ( _.isArray(value) && value[0] <= 17 ) || ( !_.isArray(value) && value < 17 ) ) {
			this.hitHand( 'dealer', () => {
				this.runDealerAction();
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
		this.setState( (prevState, props) => {
			return {
				shoe: new_shoe,
				[player]: _.assign( {}, this.state[player], {
					cards: new_cards
				})
			};
		}, () => {
			if ( _.isFunction(callback) ) callback();
		});
	}

	endHand = () => {
		let result = getResults( this.state.user.value, this.state.dealer.value );

		this.setState({
			status: 'end',
			result
		});
	}

    // SEPERATE FROM RESTART HAND FOR FUTURE BETTING
	redealHand = () => {
		this.resetHand( () => {
			this.dealHand();
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
						dealClick={ this.dealHands }
						hitClick={ () => { this.hitHand('user') } }
						standClick={ this.standHand }
						redealClick={ this.redealHand} />
				</section>
				<Results status={ this.state.status } result={ this.state.result }/>
			</main>
		);
	}
};
