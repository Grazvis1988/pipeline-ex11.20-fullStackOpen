import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from '../src/components/Blog.js'
import CreationForm from '../src/components/CreationForm.js'

describe('Blog tests', () => {

    const blog = {
        author: 'Dankanas Maklaudas',
        id: '60f8ad59520cff3b247fdea2',
        title: 'Gliders',
        url: 'www.gliders.com',
        likes: 50,
        user: {
            name: 'John Smith',
        }
    }
    const user = {
        name: 'Dankanas Maklaudas',
        username: 'Dankis',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZ2lzIiwiaWQiOiI2MGY4ODNkZTUyMGNmZjNiMjQ3ZmRlOWMiLCJpYXQiOjE2MzAwNzQwNDl9.22SkqiXZjB3E3k30TrBiTNWXBtP33QXJ3sBg9cS2Y98'
    }


    test('Render blog title and author, but not likes and url', () => {

        const component = render(
            <Blog blog={blog} />
        )


        const div = component.container.querySelector('.BlogDiv')

        expect(div).toHaveTextContent(
            'Dankanas Maklaudas'
        )
        expect(div).toHaveTextContent(
            'Gliders'
        )
        expect(div).not.toHaveTextContent(
            '50'
        )
        expect(div).not.toHaveTextContent(
            'www.gliders.com'
        )


    //expect(component.container).toHaveTextContent('John Smith')
    //expect(component.container).toHaveTextContent('Gliders')
    //expect(component.container).not.toHaveTextContent('50')
    //expect(component.container).not.toHaveTextContent('www.gliders.com')
    })

    test('Is URL and number of likes is shown when button "view" is clicked', () => {

        const mockHandler = jest.fn()


        const component = render(
            <Blog blog={blog} user={user} removal={mockHandler} />
        )
        const viewButton = component.container.querySelector('button')

        fireEvent.click(viewButton)

        const div = component.container.querySelector('.BlogDiv')
        expect(div).toHaveTextContent(blog.url)
        expect(div).toHaveTextContent(blog.likes)
    })

    test('"Like" button is clicked twice', () => {
        const mockHandler = jest.fn()

        const component = render(
            <Blog blog={blog} user={user} like={mockHandler} />
        )
        const viewButton = component.container.querySelector('button')
        fireEvent.click(viewButton)

        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })

    test('Test for new blog form, testing event handler and details passed', () => {
        const mockHandler = jest.fn()

        const component = render(
            <CreationForm createBlog={mockHandler} />
        )

        const inputAuthor = component.container.querySelector('#author')
        const form = component.container.querySelector('form')


        fireEvent.change(inputAuthor, {
            target: { value : 'Vytautas Didysis' }
        })
        fireEvent.submit(form)

        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0]).toEqual({
            title: '',
            author: 'Vytautas Didysis',
            url: ''
        })
    })
})
