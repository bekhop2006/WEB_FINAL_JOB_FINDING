import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api/client'
import JobCard from '../components/JobCard'
import './Jobs.css'

const JOB_TYPES = {
  full_time: 'Полная занятость',
  part_time: 'Частичная',
  contract: 'Контракт',
  internship: 'Стажировка',
}

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ title: '', location: '', company: '', jobType: '', status: 'active' })

  useEffect(() => {
    loadJobs()
  }, [filters])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await jobsApi.list(filters)
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="jobs-page">
      <h1>Вакансии</h1>
      <div className="filters card">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Название"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Город"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Компания"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          >
            <option value="">Тип занятости</option>
            {Object.entries(JOB_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button onClick={loadJobs} className="btn btn-primary">Найти</button>
        </div>
      </div>
      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : jobs.length === 0 ? (
        <p className="empty">Вакансий не найдено</p>
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
