describe('Blog app', function() {
	beforeEach(function() {
		cy.request('POST', 'http://localhost:3000/api/testing/reset')
		cy.request('POST', 'http://localhost:3000/api/users', {
			username: 'ziogas',
			name: 'Antanas',
			password: '1234'
		})

		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function() {
		cy.get('.loginForm')
	})

	describe('Login', function() {
		it('succeeds with correct credentials', function() {
			cy.contains('log in').click()
			cy.get('#username').type('ziogas')
			cy.get('#password').type('1234')
			cy.contains('login').click()
			cy.contains('Antanas loged in')
		})

		it('fails with wrong credentials', function() {
			cy.contains('log in').click()
			cy.get('#username').type('Van Damme')
			cy.get('#password').type('91458')
			cy.contains('login').click()
			cy.contains('Wrong username or password')
			cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
		})
	})

	describe('When loged in', function() {
		beforeEach(function() {
			cy.request('POST', 'http://localhost:3000/api/login', {
				username: 'ziogas',
				password: '1234'
			}).then( response => {
				localStorage.setItem('LoggedBlogUser', JSON.stringify(response.body))
				cy.visit('http://localhost:3000')
			})
		})

		it('A blog can be created', function() {
			cy.contains('create new blog').click()
			cy.get('#title').type('Quatar')
			cy.get('#author').type('Habib Murgamedov')
			cy.get('#url').type('www.BurjKalifa.qa')
			cy.get('button[type="submit"]').click()
			cy.contains('Quatar by Habib Murgamedov')
		})
		describe('The blog exists', function() {
			beforeEach(function() {
				cy.request({
					method: 'POST',
					url: 'http://localhost:3000/api/blogs',
					body: {
						title: 'Gliders dream',
						author: 'Jurgis Kairys',
						url: 'www.DariusIrGirenas.lt',
						likes: 69
					},
					auth: {
						bearer: JSON.parse(localStorage.LoggedBlogUser).token
					}
				})
				cy.visit('http://localhost:3000')
			})

			it('User can like the blog', function() {
				cy.contains('Gliders dream by Jurgis Kairys').contains('view').click()
				cy.get('.BlogDiv').contains('Gliders dream by Jurgis Kairys').contains('like').click()
				cy.contains('70')
			})

			it('User who created blog can delete it', function() {
				cy.contains('Gliders dream by Jurgis Kairys').contains('view').click()
				cy.get('.BlogDiv').contains('Gliders dream by Jurgis Kairys').contains('remove').click()
				cy.on('window:confirm', () => true)
				cy.contains('Gliders dream by Jurgis Kairys').should('not.exist')
			})


			it('Other Users can not delete the blog', function() {
				cy.get('button[name=logout]').click()
				cy.request('POST', 'http://localhost:3000/api/users', {
					username: 'dagilis',
					name: 'Algis',
					password: '2345'
				})
				cy.contains('log in').click()
				cy.get('#username').type('dagilis')
				cy.get('#password').type('2345')
				cy.contains('login').click()
				cy.contains('Algis loged in')
				cy.contains('Gliders dream by Jurgis Kairys').contains('view').click()
				cy.get('.BlogDiv').contains('Gliders dream by Jurgis Kairys').contains('remove').should('not.exist')
			})
		})

		describe('List of blogs', function () {
			beforeEach(function() {
				cy.request({
					method: 'POST',
					url: 'http://localhost:3000/api/blogs',
					body: {
						title: 'title1',
						author: 'user1',
						url: 'www.url1.lt',
						likes: 2
					},
					auth: {
						bearer: JSON.parse(localStorage.LoggedBlogUser).token
					}
				})
				cy.request({
					method: 'POST',
					url: 'http://localhost:3000/api/blogs',
					body: {
						title: 'title2',
						author: 'user2',
						url: 'www.url2.lt',
						likes: 3
					},
					auth: {
						bearer: JSON.parse(localStorage.LoggedBlogUser).token
					}
				})
				cy.request({
					method: 'POST',
					url: 'http://localhost:3000/api/blogs',
					body: {
						title: 'title3',
						author: 'user3',
						url: 'www.url3.lt',
						likes: 1
					},
					auth: {
						bearer: JSON.parse(localStorage.LoggedBlogUser).token
					}
				})
				cy.visit('http://localhost:3000')
			})

			it('Check if the order of blogs by likes is descending', function() {
				cy.get('[name="view"]').each(($c) => cy.wrap($c).click())
				cy.get('.likes')
					.then(($els) => {
						// we get a list of jQuery elements
						// let's convert the jQuery object into a plain array
						return (
							Cypress.$.makeArray($els)
							// and extract inner text from each
								.map((el) => {
									const matches = /\d+/g.exec(el.innerText)
									return parseInt(matches[0])
								})
						)
					})
					.should('deep.equal', [3, 2, 1])
			})
		})


	})

})
