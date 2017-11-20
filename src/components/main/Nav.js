import React from 'react'

const { ipcRenderer } = require('electron')

export class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencies: [], activeLink: '' }
		this.currencies = []
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

			this.currencies = data.sort(compare);

			this.setState({ currencies: this.currencies })
		})

	}

	selectCurrency(currency) {
		this.setState({ activeLink: currency })
		this.props.selectedCurrency(currency)
	}

	filterCurrencies(e) {
		const copy = JSON.parse(JSON.stringify(this.currencies));
		const filter = e.target.value;
		let filtered = []

		copy.forEach((el) => {
			let element = el.Currency
			if (element.toUpperCase().indexOf(filter.toUpperCase()) !== -1) {
				filtered.push(el)
			}
		});

		this.setState({ currencies: filtered })
	}

	render() {

		return (
			<div className='pane pane-sm sidebar'>
				<nav className="nav-group">
					<h5 className="nav-group-title">Currencies</h5>
					<div className="nav-group-item form-group">
						<input type="text" onKeyUp={this.filterCurrencies.bind(this)} className='form-control' placeholder='Search' />
					</div>
					{this.state.currencies.map((value) => {
						return <a key={value.Currency} onClick={() => { this.selectCurrency(value.Currency) }}
							className={value.Currency === this.state.activeLink ? 'nav-group-item active' : 'nav-group-item'}>
							{value.Currency}
						</a>;
					})}

				</nav>
			</div>
		)
	}

}