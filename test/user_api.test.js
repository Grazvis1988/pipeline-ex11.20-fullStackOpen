const mongoose = require('mongoose')
const app = require('../app')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/users')
const Blog = require('../models/blogs')
const helper = require('./test_helper')

beforeEach( async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})

	const userInput_1 = new User({
		username: 'Agneta',
		name: 'Agne',
		passwordHash: await bcrypt.hash('1234', 12)
	})
	userInput_1.blogs = helper.blogList.map( b => userInput_1.blogs.concat(b._id) )
	await userInput_1.save()

	const userInDb = await User.findOne({ username: 'Agneta' })

	const userInJson = userInDb.toJSON()
	const blogObjects = helper.blogList.map( b => (b.user = userInJson.id) && new Blog(b) )
	const promiseArray = blogObjects.map( b => b.save() )
	await Promise.all(promiseArray)

})

describe('User validation', () => {
	test('Username is unique', async () => {
		const user = {
			userName: 'Agneta',
			name: 'Agnieska',
			password: 'Ukataika'
		}
		await api.post('/api/users')
			.send(user)
			.expect(400)

		const afterEnd = await helper.usersInDb()
		expect(afterEnd.length).toBe(1)
	})

	test('Password is too short', async () => {
		const user = {
			userName: 'Kartonas',
			name: 'Tomas',
			password: '12'
		}
		await api.post('/api/users').send(user).expect(400)
		const afterEnd = await helper.usersInDb()
		expect(afterEnd.length).toBe(1)
	})

	test('New user is actualy added', async () => {
		const user = {
			username: 'Kartoplia',
			name: 'Anatolijus',
			password: '123'
		}

		await api.post('/api/users')
			.send(user)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const afterEnd = await helper.usersInDb()
		expect(afterEnd.length).toBe(2)
		expect(afterEnd[1].username).toEqual('Kartoplia')
	})

})

afterAll( () => {
	mongoose.connection.close()
})
