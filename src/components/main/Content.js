import React from 'react'
const { ipcRenderer } = require('electron')
const uuidv1 = require('uuid/v1');

export class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = { currencyInfo: { MarketName: 'USDT-BTC' } }
		this.Low = '';
		this.Last = '';
		this.getCurrencyInfo()
		this.times = 0
		this.watcher = { active: false, currency: '', Low: 0, Last:0  }

		ipcRenderer.on('get-currency', (event, data) => {

			this.setState({ currencyInfo: data })

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
		ipcRenderer.send('destroy-timer')
		this.times = 0
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

		}
	}

	startObserve(current) {
		if (this.watcher.active) {
			if (this.watcher.Last && (this.watcher.Last >= current.Last)) {
				console.log(`Observed price ${this.watcher.Last} are BIGGER than current ${current.Last}?:`, this.watcher.Last && (current.Last >= this.watcher.Last))
				console.log('****EMAIL has been Sent****')
				ipcRenderer.send('watch-for-currency', { currency: this.props.currency, type: 'Big', value: this.watcher.Last })
			}
			if (this.watcher.Low && (this.watcher.Low >= current.Low)) {
				console.log(`Observer price ${this.watcher.Low} are LOWER than current ${current.Low}?:`, this.watcher.Last && (current.Last >= this.watcher.Last))
				console.log('****EMAIL has been Sent****')
				ipcRenderer.send('watch-for-currency', { currency: this.props.currency, type: 'Small', value: this.watcher.Low })
			}
		}
	}

	destroy() {
		this.watcher.active = false;
		ipcRenderer.send('destroy-timer')
	}

	render() {
		return (
			<div className='pane content-margin'>
				<h1>{this.state.currencyInfo.MarketName} Time: {new Date().toTimeString()}</h1>
				{this.watcher.active 
					? <h2 className='green'>Watching</h2>
					: ''
				}
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='green'>bigger</span> than</h4>
					<input type="number" className="form-control" required ref='Last' placeholder="Buy bigger" />
				</div>
				<div className='form-group form-width'>
					<h4>Notify me when {this.state.currencyInfo.MarketName.replace(/.*-/gi, '')} will be <span className='red'>lower</span> than</h4>
					<input type="number" className="form-control" required ref='Low' placeholder="Sold small" />
				</div>
				<button onClick={this.watch.bind(this)} className="btn btn-positive">Watch</button>
				{this.watcher.active 
					? <button onClick={this.destroy.bind(this)} className="btn btn-primary">Destroy</button>
					: ''
				}
				<hr/>

				<h2>Prices</h2>
				<p>Last Price: { this.state.currencyInfo.Last }</p>
				<p>Low Price: { this.state.currencyInfo.Low }</p>
				<p>Bid Price: { this.state.currencyInfo.Bid }</p>
				<p>Ask Price: { this.state.currencyInfo.Ask }</p>
				<hr/>

				<h2>Volumes</h2>
				<p>Volume: { this.state.currencyInfo.BaseVolume }</p>
				<p>Volume 24h: { this.state.currencyInfo.Volume }</p>


			</div>
		)
	}

}