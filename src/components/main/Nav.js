import React from 'react'

const { ipcRenderer } = require('electron')
const uuidv1 = require('uuid/v1');

export class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencies: { btc: [], usdt: [] }, activeLink: '' }
		this.currencies = []
		this.getMenuItems()

	}

	getMenuItems() {
		// ipcRenderer.send('get-currencies')
		ipcRenderer.send('get-market-summaries')

		ipcRenderer.on('get-summary', (event, data) => {
			const usdt = [];
			const btc = [];

			data.forEach((elem) => {
				if (elem.MarketName.indexOf('USDT') !== -1) {
					usdt.push(elem)
				}
			})

			data.forEach((elem) => {
				if (elem.MarketName.indexOf('BTC') !== -1) {
					btc.push(elem)
				}
			})

			this.currencies = {
				btc,
				usdt
			}

			this.setState({
				currencies: {
					btc,
					usdt
				}
			})

		})

	}

	selectCurrency(currency) {
		this.setState({ activeLink: currency })
		this.props.selectedCurrency(currency)
	}

	filterCurrencies(e) {
		const copy = JSON.parse(JSON.stringify(this.currencies));
		const usdtCopy = copy.usdt;
		const btcCopy = copy.btc;
		const filter = e.target.value;

		let btc = []
		let usdt = []

		usdtCopy.forEach((el) => {
			let element = el.MarketName
			if (element.toUpperCase().indexOf(filter.toUpperCase()) !== -1) {
				usdt.push(el)
			}
		});

		btcCopy.forEach((el) => {
			let element = el.MarketName
			if (element.toUpperCase().indexOf(filter.toUpperCase()) !== -1) {
				btc.push(el)
			}
		});

		this.setState({ currencies: { btc, usdt } })
		console.log(usdt)
	}

	render() {
		return (
			<div className='pane pane-sm sidebar'>
				<nav className="nav-group">
					<div className="nav-group-title nav-group-item form-group">
						<input type="text" onKeyUp={this.filterCurrencies.bind(this)} className='form-control' placeholder='Search' />
					</div>
					<h5 className="nav-group-title">USD</h5>
					{this.state.currencies.usdt.map((value) => {
						return <a key={uuidv1()} onClick={() => { this.selectCurrency(value.MarketName) }}
							className={value.MarketName === this.state.activeLink ? 'nav-group-item active' : 'nav-group-item'}>
							{value.MarketName}
						</a>;
					})}
					<h5 className="nav-group-title">BTC</h5>
					{this.state.currencies.btc.map((value) => {
						return <a key={uuidv1()} onClick={() => { this.selectCurrency(value.MarketName) }}
							className={value.MarketName === this.state.activeLink ? 'nav-group-item active' : 'nav-group-item'}>
							{value.MarketName}
						</a>;
					})}
				</nav>
			</div>
		)
	}

}