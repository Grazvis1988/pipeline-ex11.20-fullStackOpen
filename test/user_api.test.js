const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/users')
const helper = require('./test_helper')

beforeEach( async () => {
	await User.deleteMany({})
	const userInput_1 = new User({
		userName: 'Agneta',
		name: 'Agne',
		passwordHash: '$2b$10$IXe3HZ5ovnhZRbalG4WN0eWUBXpp6JrteB1ZI8yBjm5XW/VGeTghu'
	})
	await userInput_1.save()

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
			userName: 'Kartoplia',
			name: 'Anatolijus',
			password: '123'
		}

		await api.post('/api/users')
			.send(user)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const afterEnd = await helper.usersInDb()
		expect(afterEnd.length).toBe(2)
		expect(afterEnd[1].userName).toEqual('Kartoplia')
	})

})

afterAll( () => {
	mongoose.connection.close()
})
