const { ipcMain } = require('electron')
const os = require('os');

const bittrexApp = require('./bittrex')
const storage = require('electron-json-storage');

storage.setDataPath(os.tmpdir());

ipcMain.on('store-api', (event, data) => {

	storage.set('apiInfo', data, function (err) {
		if (err) throw err
		bittrexApp.init(data)
		event.sender.send('store-response',  { status: 200 })
	})
})

ipcMain.on('check-storage', (event, data) => {
	storage.get('apiInfo', (err, data) => {
		if (err) throw err
		bittrexApp.init(data)
		event.sender.send('storage-checked', data)
	})
})