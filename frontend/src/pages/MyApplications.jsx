import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationsApi } from '../api/client'
import './MyApplications.css'

const STATUS_LABELS = {
  pending: 'На рассмотрении',
  reviewed: 'Просмотрено',
  accepted: 'Принято',
  rejected: 'Отклонено',
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await applicationsApi.list()
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (id) => {
    if (!confirm('Отозвать отклик?')) return
    try {
      await applicationsApi.delete(id)
      loadApplications()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>

  if (applications.length === 0) {
    return (
      <div className="my-applications-page">
        <h1>Мои отклики</h1>
        <div className="card empty-state">
          <p>У вас пока нет откликов.</p>
          <Link to="/jobs" className="btn btn-primary">Найти вакансии</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="my-applications-page">
      <h1>Мои отклики</h1>
      <div className="applications-list">
        {applications.map((app) => (
          <div key={app._id} className="application-card card">
            <div className="application-header">
              <Link to={`/jobs/${app.job?._id}`} className="application-title">
                {app.job?.title}
              </Link>
              <span className={`badge badge-${app.status}`}>
                {STATUS_LABELS[app.status] || app.status}
              </span>
            </div>
            <p className="application-company">{app.job?.company}</p>
            <p className="application-location">{app.job?.location}</p>
            {app.coverLetter && (
              <p className="application-cover">{app.coverLetter}</p>
            )}
            <div className="application-actions">
              <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm">
                Вакансия
              </Link>
              {app.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(app._id)}
                  className="btn btn-danger btn-sm"
                >
                  Отозвать
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
