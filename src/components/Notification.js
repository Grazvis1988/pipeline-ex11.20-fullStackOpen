import React from 'react'

const Notification = ({ message }) => {
    if ( message.text === null ){
        return null
    }
    return (
        <div className="error" style={{
            color: `${message.color}`,
            background: 'lightgrey',
            fontSize: '20px',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px',
            width: '20%'
        }}>
            {message.text}
        </div>
    )
}

export default Notification
