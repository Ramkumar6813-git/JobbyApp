import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import SkillsCard from '../SkillsCard'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemList: {},
    similarJobItemList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFormattedSkillData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    rating: data.rating,
    location: data.location,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSkillData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSkillData(eachSimilarJob),
      )
      this.setState({
        jobItemList: updatedData,
        similarJobItemList: updatedSkillData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobItemDetails = () => {
    const {jobItemList, similarJobItemList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
      packagePerAnnum,
      lifeAtCompany,
      skills,
    } = jobItemList
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-items-details-div">
        <div className="job-items-container">
          <div className="details-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-container">
              <h1 className="company-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" size="25" color=" #fbbf24" />
                <p className="rating-count">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-salary-container">
            <div className="jobs-main-details-container">
              <div className="location-details">
                <GoLocation className="location-logo" color="#ffffff" />
                <p className="name-text">{location}</p>
              </div>
              <div className="type-details">
                <BsBriefcaseFill
                  className="location-logo-brief"
                  color="#ffffff"
                />
                <p className="name-text">{employmentType}</p>
              </div>
            </div>
            <p className="name-text">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-container">
            <h1 className="description-heading">Description</h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              Visit
              <BiLinkExternal className="bi-link" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="skill-container">
            {skills.map(eachSkill => (
              <SkillsCard key={eachSkill.id} skillDetails={eachSkill} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at company</h1>
          <div className="life-at-company-container">
            <p className="life-company-description">{description}</p>
            <img src={imageUrl} alt="life at company" className="company-img" />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-cards">
          {similarJobItemList.map(eachItem => (
            <SimilarJobItem key={eachItem.id} jobDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        we cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={this.getJobItemDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="get-products-details-container">
          {this.renderJobViews()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
