import React from 'react'

export class Content extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		console.log(this.props.currency)
		return (
			<div className='pane content-margin'>
				<h1>{this.props.currency}</h1>
			</div>
		)
	}

}