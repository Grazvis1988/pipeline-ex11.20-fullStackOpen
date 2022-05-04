import React, { useState } from 'react'
//import blogService from '../services/blogs'


const Blog = ({ blog, user, removal, like }) => {
	const [viewState, setViewState] = useState(true)
	const [likes, setLikes] = useState(blog.likes)
	//const [likes, setLikes] = useState(blog.likes)
	//    const handleLikes = async (blog) => {
	//       const newblog =	await blogService.update(blog.id, {
	//          user: blog.user.id,
	//         likes: likes + 1,
	//        author: blog.author,
	//       title: blog.title,
	//      url: blog.url
	// }).catch(err => { console.error(err) })
	//  setLikes(newblog.likes)
	//   }
	const handleDeletion = (id) => {
		if (user.name === blog.user.name) {
			return (
				<div>
					<button onClick={() => window.confirm('Are you sure you want to delete this blog post?') && removal(id)}>remove</button>
				</div>
			)
		}

	}


	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	return (
		<div className='BlogDiv' style={blogStyle}>
			{
				viewState ?
					<div className='InfoDiv'>
						{blog.title} by {blog.author} <button name='view' onClick={() => setViewState(!viewState)}>view</button>
					</div>
					:
					<div className='BlogComponent'>
						{blog.title} by {blog.author} <button onClick={() => setViewState(!viewState)}>hide</button>
						<div>{blog.url}</div>
						<div className='likes'>likes: {likes}<button onClick={() => {
							like(blog, likes)
							setLikes(likes + 1)
						}}>like</button></div>
						<div>{blog.user.name}</div>
						{handleDeletion(blog.id)}
					</div>
			}
		</div>
	)}

export default Blog
