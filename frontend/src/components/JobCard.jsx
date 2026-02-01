import { Link } from 'react-router-dom'
import './JobCard.css'

const JOB_TYPES = {
  full_time: 'Полная занятость',
  part_time: 'Частичная',
  contract: 'Контракт',
  internship: 'Стажировка',
}

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className={`badge badge-${job.status}`}>
          {job.status === 'active' ? 'Активна' : 'Закрыта'}
        </span>
      </div>
      <p className="job-company">{job.company}</p>
      <p className="job-location">{job.location}</p>
      {job.salary && <p className="job-salary">{job.salary}</p>}
      {job.jobType && (
        <span className="job-type">{JOB_TYPES[job.jobType] || job.jobType}</span>
      )}
    </Link>
  )
}
