import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import renderer from 'react-test-renderer';
//
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// CARD FUNCTIONS
import {
	Table,
	handValue,
	checkBlackjack,
	checkBust,
	dealerHits,
	getResults
} from './components/Table';

// STATIC DATA
import { hands } from './test_data/hands_data';

it( 'renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});

it ( 'passes Snapshot test', () => {
	const tree = renderer
		.create(<Table />)
		.toJSON();
	expect(tree).toMatchSnapshot();
});

describe( 'Test Basic Hand Value Calculations', () => {
	it( 'K + 5 = 15', () => {
        expect( handValue(hands.basic[0]) ).toEqual(15);
	});
	it( 'K + J = 20', () => {
		expect( handValue(hands.basic[1]) ).toEqual(20);
	});
	it( 'J + 5 + 2 = 17', () => {
		expect( handValue(hands.basic[2]) ).toEqual(17);
	});
	it( 'J + 5 + Q = 25', () => {
        expect( handValue(hands.basic[3]) ).toEqual(25);
	});
});

describe( 'Test Hand Values with Aces', () => {
	it( 'A + 5 gives soft/hard values 16 & 6', () => {
        expect( handValue(hands.aces[0]) ).toEqual([16, 6]);
	});
	it( 'K + A gives only hard 21', () => {
		expect( handValue(hands.aces[1]) ).toEqual(21);
	});
	it( 'A + 5 + 6 gives only hard 12', () => {
		expect( handValue(hands.aces[2]) ).toEqual(12);
	});
    // MULTIPLE ACE
	it( 'A + 5 + A gives soft/hard values 17 & 7', () => {
		expect( handValue(hands.aces[3]) ).toEqual([17,7]);
	});
	it( 'A + 4 + A + 8 gives only hard 14', () => {
		expect( handValue(hands.aces[4]) ).toEqual(14);
	});
	it( '5 + A + 5 gives only hard 21', () => {
		expect( handValue(hands.aces[5]) ).toEqual(21);
	});
});

describe( 'Test for Blackjacks', () => {
	it( 'K + A equals BJ', () => {
		expect( checkBlackjack(hands.blackjacks[0]) ).toEqual(true);
    });
	it( 'A + 9 does not equal BJ', () => {
		expect( checkBlackjack(hands.blackjacks[1]) ).toEqual(false);
	});
    it( 'Multiple card 21 does not equal BJ', () => {
		expect( checkBlackjack(hands.blackjacks[2]) ).toEqual(false);
	});
	it( 'Check multiple hands for a BJ', () => {
		expect( checkBlackjack(hands.blackjacks[0], hands.blackjacks[1]) ).toEqual(true);
	});
});

describe( 'Test for Busts', () => {
	it( 'J + 5 + Q = 25 Busts', () => {
		const value = handValue(hands.busts[0]);
		expect( checkBust(value) ).toEqual(true);
	});
	it( '3 + 5 + Q = 18 No Bust', () => {
		const value = handValue(hands.busts[1]);
		expect( checkBust(value) ).toEqual(false);
	});
	it( 'A + 5 + 10 = 16 ( No soft val ) No Bust', () => {
		const value = handValue(hands.busts[2]);
		expect( checkBust(value) ).toEqual(false);
	});
});

describe( 'Test Dealer Actions', () => {
	it( 'K + 5 should HIT', () => {
		const value = handValue(hands.dealer[0]);
		expect( dealerHits(value) ).toEqual(true);
	});
	it( 'K + J should STAND', () => {
		const value = handValue(hands.dealer[1]);
		expect( dealerHits(value) ).toEqual(false);
	});
	it( 'A + 6 should HIT soft 17', () => {
		const value = handValue(hands.dealer[2]);
		expect( dealerHits(value) ).toEqual(true);
	});
	it( 'A + 5 + 4 should STAND soft 20', () => {
		const value = handValue(hands.dealer[3]);
		expect( dealerHits(value) ).toEqual(false);
	});
	it( 'A + 5 + K shoud HIT no soft val', () => {
		const value = handValue(hands.dealer[4]);
		expect( dealerHits(value) ).toEqual(true);
	});
});

// TODO: WRITE TEST FOR RESULT CALCULATIONS
