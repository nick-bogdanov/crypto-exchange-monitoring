import React from 'react'
const {ipcRenderer} = require('electron')

export class FormApi extends React.Component {
	constructor(props) {
		super(props)
	}

	submit(e) {
		e.preventDefault();
		
		const apiData = {
			email: this.refs.email.value,
			// apiKey: this.refs.apiKey.value,
			// apiSecret: this.refs.apiSecret.value
		}

		ipcRenderer.send('store-api', apiData)

		ipcRenderer.on('store-response', (event, data) => {
			this.props.apiEntered()
		})
	}

	render() {
		return (
			<div className='center-page'>
				<form onSubmit={this.submit.bind(this)} className='api-form'>
					<h1>Bittrex</h1>
					<div className="form-group">
						<label>Email</label>
						<input type="email" className="form-control" required ref='email' placeholder="Email" />
					</div>
					{/* <div className="form-group">
						<label>Api Key</label>
						<input type="text" className="form-control" required ref='apiKey' placeholder="Api Key" />
					</div>
					<div className="form-group">
						<label>Api Secret</label>
						<input type="text" className="form-control" required ref='apiSecret' placeholder="Api Secret" />
					</div> */}
					<button className="btn btn-positive">Submit</button>
				</form>
			</div>
		)
	}

}