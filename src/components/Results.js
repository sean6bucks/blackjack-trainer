import React from 'react';

export const Results = ( props ) => {
	const result = props.result;

	return (
		<dialog id="Results" open={ props.status === 'end' }>
			<p>{ result.message }</p>
		</dialog>
	);
};
