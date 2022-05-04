import Notification from './Notification'
import React from 'react'

const LoginForm = ({
	username,
	password,
	handleSubmit,
	handleUsernameChange,
	handlePasswordChange,
	message,
}) => (
	<div className="loginForm">
		<form onSubmit = {handleSubmit}>
			<h2>log in to application</h2>
			<Notification message = {message} />
			<div>
		username <input
					id = 'username'
					type = 'text'
					value = {username}
					name = 'Username'
					onChange = {handleUsernameChange}
				/>
			</div>

			<div>
		password
				<input
					id = 'password'
					type = 'password'
					value = {password}
					name = 'password'
					onChange = {handlePasswordChange}
				/>
			</div>
			<button type = 'submit'>login</button>
		</form>
	</div>
)

export default LoginForm
