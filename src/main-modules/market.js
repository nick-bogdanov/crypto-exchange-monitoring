const { ipcMain } = require('electron')
const bittrexApp = require('./bittrex')

ipcMain.on('get-currencies', (event) => {
	console.log(event)
	bittrexApp.getCurrencies(event.sender)
})
