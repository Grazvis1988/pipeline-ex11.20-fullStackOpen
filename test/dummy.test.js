const helper = require('./test_helper')
const listHelper = require('../utils/list_helper.js')

test('dummy returns one', () => {
	const blogs = []

	const result = listHelper.dummy(blogs)

	expect(result).toBe(1)
})

describe('total likes', () => {
	const listWithOneBlog= [
		{
			_id: '5a422b3a1b54a676234d17f9',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 12,
			__v: 0
		},
	]

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)

		expect(result).toBe(12)
	})
})

describe('Favorite blog', () => {
	test('Blog with with most likes', () => {
		const result = listHelper.favoriteBlog(helper.blogList)

		expect(result).toEqual({
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12
		})
	})
})

describe('Most Blogs', () => {
	test('Author who has the largest amount of blogs', () => {
		const result = listHelper.mostBlogs(helper.blogList)
		expect(result).toEqual({
			author: 'Robert C. Martin',
			blogs: 3
		})
	})
})


describe('Most likes', () => {
	test('Author, whose blog posts have the largest amount of likes', () => {
		const result = listHelper.mostLikes(helper.blogList)
		expect(result).toEqual({
			author: 'Edsger W. Dijkstra',
			likes: 17
		})
	})
})


