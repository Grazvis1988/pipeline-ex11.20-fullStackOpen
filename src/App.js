import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreationForm from './components/CreationForm'
import Togglable from './components/togglable'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState({ text: null, color: 'blank' })

	const blogFormRef = useRef()


	useEffect(() => {
		user !== null && blogService.getAll().then(b =>
			setBlogs( b )
		)
	}, [user])

	useEffect(() => {
		const loggedInUserJSON = window.localStorage.getItem('LoggedBlogUser')
		if (loggedInUserJSON) {
			const user = JSON.parse(loggedInUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	},[])

	const addBlog = async (blogObject) => {
		blogFormRef.current.toggleVisibility()
		const newBlog = await blogService.create(blogObject)
		const refactoredBlog = {
			title: newBlog.title,
			author: newBlog.author,
			url: newBlog.url,
			likes: newBlog.likes,
			id: newBlog.id,
			user: {
				username: user.username,
				name: user.name,
				id: newBlog.id,
			}
		}
		setBlogs(blogs.concat(refactoredBlog))

		setMessage({ text: `${blogObject.title}, by ${blogObject.author} added`, color: 'green' })
		setTimeout(() => {
			setMessage({ text: null, color: 'blank' })
		}, 5000)
	}



	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username,
				password,
			})

			window.localStorage.setItem(
				'LoggedBlogUser', JSON.stringify(user)
			)

			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (err) {
			console.log(err)
			console.log('Wrong credentials')
			setMessage({ text: 'Wrong username or password', color: 'red' })
			setTimeout(() => {
				setMessage( { text: null, color: 'blank' } )
			}, 5000)
			setUsername('')
			setPassword('')
		}

	}
	const loginForm = () => (
		<Togglable buttonLabel='log in'>
			<LoginForm
				username={username}
				password={password}
				handleSubmit={handleLogin}
				handleUsernameChange={({ target }) => setUsername(target.value)}
				handlePasswordChange={({ target }) => setPassword(target.value)}
				message={message}
			/>
		</Togglable>
	)

	const creationForm = () => (
		<Togglable buttonLabel='create new blog' ref={blogFormRef}>
			<CreationForm createBlog={addBlog} />
		</Togglable>
	)

	const handleDeletion = async (id) => {
		await blogService.remove(id)
		setBlogs(blogs.filter(blog => blog.id !== id))
	}
	const handleLikes = async (blog, likes) => {
		await blogService.update(blog.id, {
			user: blog.user.id,
			likes: likes + 1,
			author: blog.author,
			title: blog.title,
			url: blog.url
		}).catch(err => { console.error(err) })
	}

	return (
		<div>
			{
				user === null ?
					loginForm()
					:

					<div>
						<h2>blogs</h2>
						<Notification message = {message} />
						<p>{user.name} loged in <button name='logout' onClick={() => {
							setUser(null)
							window.localStorage.clear()

							// for some reason after change in number of likes upon logging out and logging back in the number of likes is back in its previous state but after reloading the window only then app shows that it is changed, even if it was changed in MongoDb database. so that's way I'm reloading here. \/
							window.location.reload()
						}}>logout</button></p>

						{ creationForm() }
						{blogs.sort((a,b) => b.likes - a.likes)
							.map(blog =>
								<Blog key={blog.id} blog={blog} user={user} removal={handleDeletion} like={handleLikes}/>
							)}
					</div>
			}
		</div>
	)
}

export default App
