import React from 'react';

export const Actions = ( props ) => {

	// DETERMINE ACTIONS DISPLAY
	const actions = () => {
		switch ( props.status ) {
			case 'deal':
				return <span className="button" onClick={ props.deal }>DEAL</span>;
			case 'user':
				return (
					<div className="user-actions">
						<span className="button" onClick={ () => props.hit( 'user', props.user.cards ) }>HIT</span>
					</div>
				);
			case 'end':

				break;
			default:
				// HANDLE SESSION START
				return <span className="button" onClick={ props.start }>START</span>;
		}
	}

	return (
		<nav className="actions">
			{ actions() }
		</nav>
	);
};
