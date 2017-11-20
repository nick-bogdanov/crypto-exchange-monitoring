const { ipcMain } = require('electron')
const bittrexApp = require('./bittrex')

ipcMain.on('get-currencies', (event) => {
	bittrexApp.getCurrencies(event.sender)
})

ipcMain.on('get-currency-info', (event, data) => {
	bittrexApp.getCurrency(event.sender, data.currency)
})

ipcMain.on('get-market-summaries', (event) => {
	bittrexApp.getMarketSummaries(event.sender)
})



