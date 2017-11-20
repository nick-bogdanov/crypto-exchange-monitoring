const nodemailer = require('nodemailer')
const { ipcMain } = require('electron')
const storage = require('electron-json-storage')

storage.setDataPath(os.tmpdir())

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'cryp.notification@gmail.com',
		pass: 'crypto777'
	}
})

var mailOptions = {}

ipcMain.on('watch-for-currency', (event, data) => {

	storage.get('apiInfo', (err, data) => {
		if (err) throw err

		mailOptions = {
			from: 'cryp.notification@gmail.com', // sender address
			to: data.email, // list of receivers
			subject: `Notification about ${data.currency}`, // Subject line
			html: '<p>Your html here</p>'// plain text body
		}

		transporter.sendMail(mailOptions, function (err, info) {
			if (err)
				console.log(err)
			else
				console.log(info);
		});

	})

})

