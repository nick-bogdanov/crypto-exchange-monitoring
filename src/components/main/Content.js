import React from 'react'
const { ipcRenderer } = require('electron')
const uuidv1 = require('uuid/v1');

export class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencyInfo: { MarketName: 'USDT-BTC' }, content: '' }

		this.getCurrencyInfo()

		ipcRenderer.on('get-currency', (event, data) => {
			const content = Object.keys(data).map(function (key) {
				return <p key={uuidv1()}>{key}: {data[key].toString()}</p>
			})
			this.setState({ currencyInfo: data, content })
		})
	}

	getCurrencyInfo(props) {
		var self = this
		function timer() {
			return setInterval(() => {
				console.log(self.props.currency)
				ipcRenderer.send('get-currency-info', { currency: props || self.props.currency })
			}, 1000)
		}

		this.id = timer()
	}

	componentWillReceiveProps(props) {
		clearInterval(this.id)
		this.getCurrencyInfo(props.currency)
	}

	watch() {
		ipcRenderer.send('watch-for-currency', {currency: self.props.currency})
	}

	render() {
		return (
			<div className='pane content-margin'>
				<h1>{this.state.currencyInfo.MarketName}</h1>
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='green'>bigger</span> than</h4>
					<input type="number" value={this.state.currencyInfo.Last || 0} className="form-control" required ref='email' placeholder="Buy bigger" />
				</div>
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='red'>lower</span> than</h4>
					<input type="number" value={this.state.currencyInfo.Low || 0} className="form-control" required ref='email' placeholder="Sold small" />
				</div>
				<button onClick={this.watch.bind(this)} className="btn btn-positive">Watch</button>
				{this.state.content}
			</div>
		)
	}

}