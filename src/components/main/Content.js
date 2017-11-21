import React from 'react'
const { ipcRenderer } = require('electron')
const uuidv1 = require('uuid/v1');

export class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencyInfo: { MarketName: 'USDT-BTC' }, content: '' }
		this.Low = '';
		this.Last = '';
		this.getCurrencyInfo()
		this.times = 0
		this.watcher = { active: false }

		ipcRenderer.on('get-currency', (event, data) => {
			const content = Object.keys(data).map(function (key) {
				return <p key={uuidv1()}>{key}: {data[key].toString()}</p>
			})

			this.setState({ currencyInfo: data, content })

			if (this.times === 0) {
				this.refs.Low.value = data.Low.toFixed(10)
				this.refs.Last.value = data.Last.toFixed(10)
				this.times = 1;
			}

			this.startObserve(data)

		})
	}

	getCurrencyInfo(props) {
		var self = this
		function timer() {
			return setInterval(() => {
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
		const notEmpty = this.refs.Low.value || this.refs.Last.value
		if (notEmpty) {
			this.watcher.active = true;
			this.watcher.currency = this.props.currency;

			if (this.refs.Low.value)
				this.watcher.Low = this.refs.Low.value

			if (this.refs.Last.value)
				this.watcher.Last = this.refs.Last.value

			// ipcRenderer.send('watch-for-currency', {currency: self.props.currency})
		}
	}

	startObserve(current) {
		if (this.watcher.active) {
			if (this.watcher.Last && (current.Last >= this.watcher.Last)) {
				ipcRenderer.send('watch-for-currency', { currency: self.props.currency, type: 'Big' })
			}

			if (this.watcher.Low && (current.Low >= this.watcher.Low)) {
				ipcRenderer.send('watch-for-currency', { currency: self.props.currency, type: 'Small' })
			}
		}
	}

	render() {
		return (
			<div className='pane content-margin'>
				<h1>{this.state.currencyInfo.MarketName}</h1>
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='green'>bigger</span> than</h4>
					<input type="number" className="form-control" required ref='Last' placeholder="Buy bigger" />
				</div>
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='red'>lower</span> than</h4>
					<input type="number" className="form-control" required ref='Low' placeholder="Sold small" />
				</div>
				<button onClick={this.watch.bind(this)} className="btn btn-positive">Watch</button>
				{this.state.content}
			</div>
		)
	}

}