import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    rating,
  } = jobDetails

  return (
    <li className="similar-job-list-item">
      <div className="similar-job-details-container">
        <img
          src={companyLogoUrl}
          className="logo-url"
          alt="similar job company logo"
        />
        <div className="job-details">
          <h1 className="company-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" color="#fbbf24" />
            <p className="rating-count">{rating}</p>
          </div>
        </div>
      </div>
      <hr className="line" />
      <h1 className="description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="job-location-details">
        <div className="location-description">
          <div className="location-details-container">
            <GoLocation className="location-icon" />
            <p className="name">{location}</p>
          </div>
          <div className="location-details-container">
            <BsBriefcaseFill className="location-icon " />
            <p className="name">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
