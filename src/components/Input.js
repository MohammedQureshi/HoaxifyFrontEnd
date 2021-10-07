import React from 'react'

const Input = (props) => {
    return(
        <div>
            {props.label && <label>{props.label}</label>}
            <input type={props.type || 'text'} placeholder={props.placeholder} />
        </div>
    )
}

export default Input