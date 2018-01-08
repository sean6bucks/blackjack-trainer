// GLOBAL HELPER FUNCTIONS

export const flatten = list => list.reduce(
	(a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export const randomize = arr => arr.sort( () => Math.random() - 0.5 );

export const times = ( x, func ) => {
	if ( x > 0 ) {
		func()
		times( x - 1, func )
	}
};
