import React from 'react';

export const Actions = ( props ) => {

	// DETERMINE ACTIONS DISPLAY
	const actions = () => {
		switch ( props.status ) {
			case 'deal':
				return <span className="button" onClick={ props.dealClick }>DEAL</span>;
			case 'user':
				return (
					<div className="user-actions">
						<span className="button" onClick={ props.hitClick }>HIT</span>
						<span className="button" onClick={ props.standClick }>STAND</span>
					</div>
				);
			case 'end':
                // TODO: TO BE UPDATED WITH BETTING SYSTEM
				return <span className="button" onClick={ props.redealClick }>RE-DEAL</span>
			default:
				// HANDLE SESSION START
				return <span className="button" onClick={ props.startClick }>START</span>;
		}
	}

	return (
		<nav className="actions">
			{ actions() }
		</nav>
	);
};
