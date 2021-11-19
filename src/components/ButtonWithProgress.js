import React from 'react';

const ButtonWithProgress = (props) => {
    return(
        <button onClick={props.onClick} className="btn btn-primary w-100" disabled={props.disabled} >
            {props.pendingApiCall && (
                <div className="spinner-border text-light spinner-border-sm mr-sm-1" role="status">
                    <span className="d-none">Loading...</span>
                </div>
            )}
            {props.text}
        </button>
    )
}

export default ButtonWithProgress