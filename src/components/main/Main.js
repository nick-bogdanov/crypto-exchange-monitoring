import React from 'react'
import { Nav } from './Nav'
import { Content } from './Content'

export class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currency: '' }
	}

	selectedCurrency(currency) {
		this.setState({ currency })
	}


	render() {

		return (
			<div className='window'>
				<div className='window-content'>
					<div className='pane-group'>
						<Nav selectedCurrency={this.selectedCurrency.bind(this)}></Nav>
						<Content currency={this.state.currency}></Content>
					</div>
				</div>
			</div>
		)
	}

}