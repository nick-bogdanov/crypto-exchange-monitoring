import React from 'react'

const { ipcRenderer } = require('electron')

export class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencies: [] }

		this.getMenuItems()

	}

	getMenuItems() {
		ipcRenderer.send('get-currencies')
		ipcRenderer.on('get-currencies', (event, data) => {

			function compare(a, b) {
				if (a.Currency < b.Currency)
					return -1;
				if (a.Currency > b.Currency)
					return 1;
				return 0;
			}

			const result = data.sort(compare);

			this.setState({ currencies: result })
		})

	}

	render() {

		return (
			<div className='pane-group'>
				<div className='pane pane-sm sidebar'>
					<nav className="nav-group">
						<h5 className="nav-group-title">Currencies</h5>
						{this.state.currencies.map(function (value) {
							return <a key={value.Currency} className="nav-group-item">
								{value.Currency}
							</a>;
						})}

					</nav>
				</div>
			</div>
		)
	}

}