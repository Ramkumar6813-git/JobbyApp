import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      <ul className="sm-screen-nav-links">
        <Link to="/">
          <li>
            <AiFillHome size="30" color="#ffffff" />
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <BsFillBriefcaseFill size="30" color="#ffffff" />
          </li>
        </Link>
        <li>
          <button
            type="button"
            className="sm-screen-logout-button"
            onClick={onClickLogout}
          >
            <FiLogOut size="30" color="#ffffff" />
          </button>
        </li>
      </ul>
      <ul className="lg-screen-nav-links">
        <Link to="/" className="nav-link">
          <li>Home</li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li>Jobs</li>
        </Link>
      </ul>
      <button
        type="button"
        className="lg-screen-logout-button"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
