require('dotenv').config()

const PORT = process.env.REACT_APP_PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
	? process.env.REACT_APP_MONGODB_URI_TEST
	: process.env.REACT_APP_MONGODB_URI

module.exports = {
	PORT, MONGODB_URI
}


