import React from 'react'

export class UserSignUpPage extends React.Component {

    state = {
        displayName: '',
        username: '',
        password: '',
        confirmPassword: ''
    }

    onChangehDisplayName = (event) => {
        const value = event.target.value;
        this.setState({displayName: value});
    }

    onChangeUsername = (event) => {
        const value = event.target.value;
        this.setState({username: value});
    }

    onChangePassword = (event) => {
        const value = event.target.value;
        this.setState({password: value});
    }

    onChangeConfirmPassword = (event) => {
        const value = event.target.value;
        this.setState({confirmPassword: value});
    }

    onClickSignUp = () => {
        const user = {
            username: this.state.username,
            displayName: this.state.displayName,
            password: this.state.password,
        }
        this.props.actions.postSignUp(user);
    }

    render(){
        return(
            <div className="container">
                <h1 class="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <label>Display Name</label>
                    <input placeholder="Your display name" value={this.state.displayName} onChange={this.onChangehDisplayName} className="form-control" />
                </div>
                <div className="col-12 mb-3">
                    <label>Username</label>
                    <input placeholder="Your username" value={this.state.username} onChange={this.onChangeUsername} className="form-control" />
                </div>
                <div className="col-12 mb-3">
                    <label>Password</label>
                    <input placeholder="Your password" type="password" value={this.state.password} onChange={this.onChangePassword} className="form-control" />
                </div>
                <div className="col-12 mb-3">
                    <label>Confirm Password</label>
                    <input placeholder="Confirm your password" type="password" value={this.state.confirmPassword} onChange={this.onChangeConfirmPassword} className="form-control" />
                </div>
                <div className="text-center"><button onClick={this.onClickSignUp} className="btn btn-primary w-100">Sign Up</button></div>
            </div>
        )
    }
}

UserSignUpPage.defaultProps = {
    actions: {
        postSignUp: () => new Promise((resolve, reject) => {resolve({})})
    }
}

export default UserSignUpPage