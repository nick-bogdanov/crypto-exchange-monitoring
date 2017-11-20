const bittrex = require('node.bittrex.api');

const bittrexApp = {};

bittrexApp.init = function (data) {
	// bittrex.options({
	// 	'apikey': data.apiKey,
	// 	'apisecret': data.apiSecret,
	// });
}

bittrexApp.getCurrencies = function(event) {
	bittrex.getcurrencies(function(data) {
		console.log(data.result)
		event.send('get-currencies', data.result)
	})
}

module.exports = bittrexApp