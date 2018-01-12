// GLOBAL HELPER FUNCTIONS
import { isFunction } from 'lodash';

export const times = ( x, func, callback ) => {
	if ( x > 0 ) {
		func()
		times( x - 1, func, callback )
	} else if ( isFunction( callback ) ) {
		callback();
	}
};
