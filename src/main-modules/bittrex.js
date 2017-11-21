const bittrex = require('node.bittrex.api');

const bittrexApp = {};

bittrexApp.init = function (data) {
	// bittrex.options({
	// 	'apikey': data.apiKey,
	// 	'apisecret': data.apiSecret,
	// });
}

bittrexApp.getCurrencies = function (event) {
	bittrex.getcurrencies(function (data, err) {
		if (err) throw err
		event.send('get-currencies', data.result)
	})
}

bittrexApp.getCurrency = function (event, market) {
	// bittrex.websockets.subscribe([market], function (data, client) {
	// 	if (data.M === 'updateExchangeState') {
	// 		data.A.forEach(function (data_for) {
	// 			console.log(data_for)
	// 		});
	// 	}
	// });
	bittrex.getmarketsummary({ market: market }, function (data, err) {
		if (err) throw err
		event.send('get-currency', data.result[0])
	})
}

bittrexApp.getMarketSummaries = function (event) {
	bittrex.getmarketsummaries(function (data, err) {
		if (err) throw err
		event.send('get-summary', data.result)
	})
}


module.exports = bittrexApp