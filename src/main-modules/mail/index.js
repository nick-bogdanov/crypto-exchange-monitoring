const nodemailer = require('nodemailer')
const { ipcMain } = require('electron')
const storage = require('electron-json-storage')
const os = require('os')
const fs = require('fs')
const path = require('path')

storage.setDataPath(os.tmpdir())

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'cryp.notification@gmail.com',
		pass: 'crypto777'
	}
})

let timestamp = 0
const time = 5 * 1000 * 60
const templateString = '###{}###'

ipcMain.on('watch-for-currency', (event, info) => {
	let now = new Date().getTime()
	if ( ( (timestamp + time) <= now) || timestamp === 0) {
		console.log('***EMAIL HAS Been Sent***')

		timestamp = now

		storage.get('apiInfo', (err, storageData) => {
			if (err) throw err

			fs.readFile(path.join(__dirname, "template.html"), "utf8", function(err, fsData) {
				if (err) throw err
				const infoString = `The ${info.currency} is ${info.value}`
				const emailLetter = fsData.toString().replace(templateString, infoString)

				mailOptions = {
					from: 'cryp.notification@gmail.com', // sender address
					to: storageData.email, // list of receivers
					subject: `Notification about ${info.type} ${info.currency}`, // Subject line
					html: emailLetter// plain text body
				}
				
				transporter.sendMail(mailOptions, function (err, emailInfo) {
					if (err)
						console.log(err)
					else
						console.log(emailInfo);
				});
			});


		})
	}

})

ipcMain.on('destroy-timer', function() {
	console.log(timestamp)
	timestamp = 0
})

