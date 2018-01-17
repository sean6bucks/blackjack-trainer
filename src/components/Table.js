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

export const checkBust = value => {
	return !_.isArray(value) && value > 21;
};

export const dealerHits = value => {
    // IF SOFT VAL > CHECK FOR SOFT 17 OR BELOW
	if ( _.isArray(value) ) return value[0] <= 17;
    // IF HARD VAL > CHECK BELOW 17
	else return value < 17;
};

export const getResults = ( user_hand, dealer_hand ) => {
	const user_val = user_hand.value,
		  user_cards_len = user_hand.cards.length,
		  dealer_val = dealer_hand.value,
		  dealer_cards_len = dealer_hand.cards.length;

	if ( dealer_val === user_val ) {
		return {
			winner: 'push',
			message: 'Push'
		}
	} else if ( user_val > 21 || (dealer_val < 22 && dealer_val > user_val) ) {
		return {
			winner: 'dealer',
			message: dealer_cards_len === 2 && dealer_val === 21 ? 'Dealer has BlackJack.' : user_val > 21 ? 'Player Busts.' : 'Dealer Wins.'
		};
	} else {
		return {
			winner: 'user',
			message: user_cards_len === 2 && user_val === 21 ? 'Player has BlackJack!' : dealer_val > 21 ? 'Dealer Busts!' : 'Player Wins!'
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
			},
			discarded: 0
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
		if ( this.state.shoe.length < 12 ) new_hand.shoe = newShoe();

		this.setState( new_hand, () => {
			if ( _.isFunction( callback ) ) callback();
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
		const user_hand = this.state.user,
			  user_cards = user_hand.cards,
			  dealer_cards = this.state.dealer.cards;

		this.setState({
			status: 'user',
			user: _.assign( {}, user_hand, {
				value: handValue( user_cards )
			})
		}, () => {
            // CHECK FOR BLACKJACKS
			if ( checkBlackjack( user_cards, dealer_cards ) ) {
				this.endHand();
			}
		});
	}

	dealCard = ( player, callback ) => {
		let new_shoe = this.state.shoe,
			new_cards = this.state[player].cards;

        // MOVE NEW CARD FROM SHOE TO HAND
		new_cards.push( new_shoe.shift() );

        // SET DEALER'S FIRST CARD AS HOLE CARD
		if ( player === 'dealer' && new_cards.length === 1 ) {
			new_cards[0].type = 'hole';
		}

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

	hitHand = ( player, callback ) => {
        // ADD NEW CARD TO HAND
		this.dealCard( player, () => {
            // SET UPDATED HAND VALUE
			const hand = this.state[player],
				  new_val = handValue( hand.cards );
			this.setState( (prevState, props) => {
				return {
					[player]: _.assign( {}, hand, {
						value: new_val
					})
				};
			}, () => {
                // CHECK FOR HAND BUST
				if ( checkBust(new_val) ) {
					this.endHand();
                // ELSE CHECK IF USER HAS 21 > AUTO STAND
				} else if ( player === 'user' && new_val === 21 ) {
					this.standHand();
				}

				if ( _.isFunction(callback) ) callback();
			});
		});
	}

	standHand = () => {
		const user_val = this.state.user.value;
        // IF STAND WITH SOFT/HARD SET SOFT VALUE
		let stand_val = _.isArray(user_val) ? user_val[0] : user_val;

        // SET FINAL VALUE AND START DEALERS TURN
		this.setState({
			status: 'dealer',
			user: _.assign( {}, this.state.user, { value: stand_val } )
		}, () => {
			this.runDealersHand();
		});
	}

	runDealersHand = () => {
		let dealers_hand = this.state.dealer,
			dealers_cards = dealers_hand.cards;
		// SHOW HOLE CARD AND UPDATE VALUE
		dealers_cards[0].type = 'show';
		this.setState({
			dealer: _.assign( {}, dealers_hand, {
				value: handValue( dealers_cards )
			})
		}, () => {
			// AFTER VALUE UPDATE CHECK DEALER HAND FOR ACTIONS
			this.dealersAction();
		})
	}

	dealersAction = () => {
		const dealer_val = this.state.dealer.value;
		// CHECK IF DEALER SHOULD HIT > ELSE END HAND (STAND)
		if ( dealerHits(dealer_val) ) {
			this.hitHand( 'dealer', () => {
				this.dealersAction();
			});
		} else {
			// SET FINAL VALUE AND END HAND
			let stand_val = _.isArray(dealer_val) ? dealer_val[0] : dealer_val;
			this.setState({
				dealer: _.assign( {}, this.state.dealer, { value: stand_val } )
			}, () => {
				this.endHand();
			});
		}
	}

	endHand = () => {
		const user_hand = this.state.user,
			  dealer_hand = this.state.dealer;

		const result = getResults( user_hand, dealer_hand );
		const discarded = this.state.discarded + user_hand.cards.length + dealer_hand.cards.length;

		this.setState({
			status: 'end',
			result,
			discarded
		});
	}

    // SEPERATE FROM RESTART HAND FOR FUTURE BETTING
	redealHand = () => {
		this.resetHand( () => {
			this.dealHands();
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
