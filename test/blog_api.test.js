const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.js')
const Blog  = require('../models/blogs')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFsZ2lzIiwiaWQiOiI2MGMzN2M4M2E2OTRkNmEyODU1NjMwNmQiLCJpYXQiOjE2MjM0MjQxOTF9.iNFXuZHtxfIARJt5qyjGextYXJkkF9p0sRTFDKSCVsI'

let token

beforeEach( async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	/*	const blogObjects = helper.blogList.map( blog => new Blog(blog))
	const promiseArray = blogObjects.map( b => b.save() )
	await Promise.all(promiseArray)
*/

	const user = new User({
		username: 'Mika',
		name: 'Mika Hakinen',
		passwordHash: await bcrypt.hash('1234', 12)
	})

	user.blogs = helper.blogList.map( b => user.blogs.concat(b._id) )
	await user.save()
	const userInDb = await User.findOne({ username: 'Mika' })
	//console.log(userId.toJSON())
	const userInJson = userInDb.toJSON()
	token = jwt.sign({ username: userInJson.username, id: userInJson.id }, process.env.SECRET)
	const blogObjects = helper.blogList.map( b => (b.user = userInJson.id) && new Blog(b) )
	const promiseArray = blogObjects.map( b => b.save() )
	await Promise.all(promiseArray)
})

test('Is amount of blogs is correct', async () => {
	const response = await api.get('/api/blogs')
		.set('Authorization', `Bearer ${token}`)

	expect(response.body).toHaveLength(helper.blogList.length)
})

test('verification of id in database', async () => {
	const blogsAtStart = await helper.blogsInDb()
	blogsAtStart.map(blog => expect(blog.id).toBeDefined())
})

test('A valid blog can be added', async () => {
	const beforeStart = await helper.blogsInDb()
	const newBlog = {
		title: 'Hubabuba',
		author: 'Grafas drakula',
		url: 'http://www.pasilenk.lt',
		likes: 100,
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)
	const afterEnd = await helper.blogsInDb()
	expect(afterEnd).toHaveLength(beforeStart.length + 1)

	const urlMatching  = afterEnd.map(b => b.url)
	expect(urlMatching).toContain(newBlog.url)
})

test('likes defaults to zero', async () => {
	const newBlog = {
		title: 'Karandash',
		author: 'Arnoldas Shwartznegeris',
		url: 'http://www.linkomanija.net',
	}

	await api.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)
		.expect(200).expect('Content-Type', /application\/json/)

	const afterEnd = await helper.blogsInDb()
	const blogFromDb = afterEnd.find(b => b.url === newBlog.url)
	expect(blogFromDb.likes).toBe(0)
})

test('test for title and url properties missing', async () => {
	const dummyBlog = {
		//title: 'Rumba',
		//url: 'http://www.kontrabanda.com',
		author: 'Invisible man',
		likes: 19834570193
	}
	await api.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(dummyBlog).expect(400)
	const afterEnd = await helper.blogsInDb()
	const doesExist = afterEnd.find(b => b.author === dummyBlog.author && b.likes === dummyBlog.likes)
	console.log(doesExist)
	expect(doesExist).toBeUndefined()
})

test('test for deleting blog post', async () => {
	const beforeAll = await helper.blogsInDb()
	const BlogPostId = beforeAll[0].id
	console.log(beforeAll[1])
	console.log(BlogPostId)

	await api.delete(`/api/blogs/${BlogPostId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(204)
	const afterAll = await helper.blogsInDb()
	const listOfIds = afterAll.map(b => b.id)
	expect(listOfIds).not.toContain(BlogPostId)

})

test('Unauthorized token requets', async () => {
	/*
	const dummyBlog = {
		title: 'Bed',
		author: 'Pillow Jackson',
		url: 'http://www.blanket.eu',
		likes: 10293458
	}
  */

	await api.post('/api/blogs/')
		.set('Authorization', 'Bearer wakamakafo')
		.expect(401)
})

afterAll( async () => {
	mongoose.connection.close()
})
