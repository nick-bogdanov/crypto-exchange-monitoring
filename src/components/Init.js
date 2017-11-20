import React from 'react'
import { FormApi } from './FormApi'
import { Main } from './main/Main'

const { ipcRenderer } = require('electron')

export class Init extends React.Component {
	constructor(props) {
		super(props)
		this.state = { loggedIn: false }

		ipcRenderer.send('check-storage')

		ipcRenderer.on('storage-checked', (event, data) => {
			if (Object.keys(data).length) {
				this.loggedIn()
			}
		})

	}

	loggedIn() {
		this.setState({ loggedIn: true })
	}

	render() {
		if (this.state.loggedIn) {
			return (<Main />)
		} else {
			return (<FormApi apiEntered={() => this.loggedIn()} />)
		}
	}

}