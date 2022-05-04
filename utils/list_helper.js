const dummy = (blogs) => {
	return blogs.length === 0
		? 1
		: 'test for SpaceX mars lander application failed. People may get lost in space :('
}

const totalLikes = (listOfObjects) => {
	return listOfObjects.reduce((sum,i) => {
		return sum = sum + i.likes
	}, 0)
}

const favoriteBlog = (listOfObjects) => {
	const favoriteBlog = listOfObjects.reduce((max, i) => {
		if (i.likes > max.likes) {
			max = {
				title: i.title,
				author: i.author,
				likes: i.likes
			}
		}
		return max
	}, { likes: 0 })

	return favoriteBlog
}

const mostBlogs = (blogList) => {
	const listOfAuhors = blogList.reduce((authors, i) => {
		(i.author in authors)
			? authors[i.author]++
			: authors[i.author] = 1
		return authors
	}, {})
	console.log(listOfAuhors)

	const mostBlogsAuthor = Object.entries(listOfAuhors).reduce((accumulator, i) => {
		if (accumulator.blogs > i[1]) {
			return {
				author: accumulator.author,
				blogs: accumulator.blogs
			}
		} else {
			return {
				author: i[0],
				blogs: i[1]
			}
		}
	}, {})

	console.log(mostBlogsAuthor)

	return mostBlogsAuthor
}

const mostLikes = (blogList) => {
	const listOfAuhorsAndLikes = blogList.reduce((accumulator, i) => {
		const index = accumulator.findIndex(obj => obj.author === i.author)

		if(index !== -1) {
			accumulator[index].likes += i.likes
			return accumulator
		}
		else {
			return accumulator.concat({ author: i.author, likes: i.likes })
		}
	}, [])
	console.log(listOfAuhorsAndLikes)
	return listOfAuhorsAndLikes.reduce((accumulator, i) => {
		if (accumulator.likes > i.likes){
			return { author: accumulator.author, likes: accumulator.likes }
		} else {
			return { author: i.author, likes: i.likes }
		}
	}, {})
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}


