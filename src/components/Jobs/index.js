import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import ProfileDetails from '../ProfileDetails'
import JobCard from '../JobCard'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsApiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsData: [],
    employmentType: [],
    jobsApiStatus: jobsApiConstants.initial,
    searchInput: '',
    salaryRange: 0,
  }

  componentDidMount = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      jobsApiStatus: jobsApiConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {salaryRange, employmentType, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsData: updatedData,
        jobsApiStatus: jobsApiConstants.success,
      })
    } else {
      this.setState({
        jobsApiStatus: jobsApiConstants.failure,
      })
    }
  }

  renderJobDetails = () => {
    const {jobsData} = this.state
    const jobsListLength = jobsData.length > 0
    return jobsListLength ? (
      <div className="job-details-container">
        <ul className="job-details-item-list">
          {jobsData.map(eachData => (
            <JobCard key={eachData.id} jobDetails={eachData} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
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
        onClick={() => this.getJobDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsView = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case jobsApiConstants.success:
        return this.renderJobDetails()
      case jobsApiConstants.failure:
        return this.renderFailureView()
      case jobsApiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeEmployType = event => {
    const {employmentType} = this.state
    const findId = employmentType.filter(type => type === event.target.id)
    if (findId.length === 0) {
      this.setState(
        {
          employmentType: [...employmentType, event.target.id],
        },
        this.getJobDetails,
      )
    } else {
      const index = employmentType.findIndex(type => type === event.target.id)
      employmentType.splice(index, 1)
      this.setState(
        {
          employmentType,
        },
        this.getJobDetails,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        salaryRange: event.target.id,
      },
      this.getJobDetails,
    )
  }

  changeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    const {searchInput, salaryRange} = this.state
    return (
      <>
        <Header />
        <div className="job-profile-section">
          <div className="search-profile-filter-details">
            <div className="search-input-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.changeSearchInput}
                value={searchInput}
                onKeyDown={this.onEnterKey}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={() => this.getJobDetails()}
              >
                <BsSearch size="15" />
              </button>
            </div>
            <ProfileDetails />
            <hr />
            <h1 className="heading-text">Type of Employment</h1>
            <ul className="employment-types-list">
              {employmentTypesList.map(employ => (
                <li
                  className="employment-type-item"
                  key={employ.employmentTypeId}
                  onChange={this.onChangeEmployType}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={employ.employmentTypeId}
                    value={employ.employmentTypeId}
                  />
                  <label
                    htmlFor={employ.employmentTypeId}
                    className="check-label"
                  >
                    {employ.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="heading-text">Salary Range</h1>
            <ul className="salary-range-list-items">
              {salaryRangesList.map(salary => (
                <li
                  className="salary-range-item"
                  key={salary.salaryRangeId}
                  value={salaryRange}
                  onChange={this.onChangeSalaryRange}
                >
                  <input
                    type="radio"
                    className="radio-input"
                    id={salary.salaryRangeId}
                    name="salary"
                  />
                  <label htmlFor={salary.salaryRangeId} className="check-label">
                    {salary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-section">
            <div className="lg-search-input-container">
              <input
                type="search"
                placeholder="Search"
                className="lg-search-input"
                onChange={this.changeSearchInput}
                value={searchInput}
                onKeyDown={this.onEnterKey}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="lg-search-button"
                onClick={() => this.getJobDetails()}
              >
                <BsSearch size="15" />
              </button>
            </div>
            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
