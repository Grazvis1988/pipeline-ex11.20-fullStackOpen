import React, { useState } from 'react'

const CreationForm = ({ createBlog }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreation = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div className='FormDiv'>
            <form onSubmit={handleCreation}>
                <h2>Create new</h2>
                <div>
		title:
                    <input
                        id = 'title'
                        type = 'text'
                        value = {title}
                        name = 'title'
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>

                <div>
		author:
                    <input
                        id = 'author'
                        type = 'text'
                        value = {author}
                        name = 'author'
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>

                <div>
		url:
                    <input
                        id = 'url'
                        type = 'text'
                        value = {url}
                        name = 'url'
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )

}

export default CreationForm
