import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api/client'
import JobCard from '../components/JobCard'
import './MyJobs.css'

export default function MyJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const data = await jobsApi.my()
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-jobs-page">
      <div className="page-header">
        <h1>Мои вакансии</h1>
        <Link to="/my-jobs/new" className="btn btn-primary">Добавить вакансию</Link>
      </div>
      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : jobs.length === 0 ? (
        <div className="card empty-state">
          <p>У вас пока нет вакансий.</p>
          <Link to="/my-jobs/new" className="btn btn-primary">Создать первую</Link>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
