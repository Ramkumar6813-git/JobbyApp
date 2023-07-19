import {AiFillStar} from 'react-icons/ai'
import {Link} from 'react-router-dom'
import {HiLocationMarker, HiMail} from 'react-icons/hi'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    title,
    companyLogoUrl,
    rating,
    employmentType,
    location,
    id,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-list-item">
        <div className="company-details-container">
          <img src={companyLogoUrl} alt="company logo" className="logo-url" />
          <div className="job-details">
            <h1 className="company-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" color="#fbbf24" />
              <p className="rating-count">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-location-details">
          <div className="location-description">
            <div className="location-details-container">
              <HiLocationMarker className="location-icon" />
              <p className="name">{location}</p>
            </div>
            <div className="location-details-container">
              <HiMail className="location-icon " />
              <p className="name">{employmentType}</p>
            </div>
          </div>
          <p className="salary-package">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
