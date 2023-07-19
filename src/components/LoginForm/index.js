import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showErrorMassage: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSuccessSubmit = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailureSubmit = errorMessage => {
    this.setState({showErrorMassage: true, errorMsg: errorMessage})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessSubmit(data.jwt_token)
    } else {
      this.onFailureSubmit(data.error_msg)
    }
  }

  render() {
    const {showErrorMassage, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginForm-main-container">
        <div className="loginForm-card-container">
          <div className="loginForm-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="loginForm-logo-image"
            />
          </div>
          <form
            onSubmit={this.onSubmitForm}
            className="loginForm-userInput-Container"
          >
            <div className="loginForm-userName-container">
              <label htmlFor="username" className="loginForm-userName-label">
                USERNAME
              </label>
              <input
                id="username"
                className="loginForm-userInput"
                type="text"
                placeholder="Username"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="loginForm-userName-container">
              <label htmlFor="password" className="loginForm-userName-label">
                PASSWORD
              </label>
              <input
                id="password"
                className="loginForm-userInput"
                type="password"
                placeholder="Password"
                onChange={this.onChangePassword}
              />
            </div>
            <div>
              <button className="loginForm-login-button" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="error-text">
            {showErrorMassage && (
              <p className="loginForm-error-message">
                <span>* </span>
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
