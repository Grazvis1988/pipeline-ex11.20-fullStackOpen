const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const path = require('path')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controlers/blogs')
const usersRouter = require('./controlers/users')
const loginRouter = require('./controlers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then( () => {
		logger.info('Connected to MongoDB')
	})
	.catch( err => {
		logger.error('Error while connecting to MongoDB', err.message)
	})

app.use(express.static(path.join(__dirname, 'build')))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
	const testRouter = require('./controlers/test')
	app.use('/api/testing', testRouter)
}

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app
