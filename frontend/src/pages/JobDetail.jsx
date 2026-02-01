import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { jobsApi, applicationsApi } from '../api/client'
import './JobDetail.css'

const STATUS_LABELS = { pending: 'На рассмотрении', reviewed: 'Просмотрено', accepted: 'Принято', rejected: 'Отклонено' }

const JOB_TYPES = {
  full_time: 'Полная занятость',
  part_time: 'Частичная',
  contract: 'Контракт',
  internship: 'Стажировка',
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadJob()
  }, [id])

  useEffect(() => {
    if (job && user && ['employer', 'admin'].includes(user.role)) {
      loadApplications()
    }
  }, [job?._id, user?.id])

  const loadApplications = async () => {
    try {
      const data = await applicationsApi.list()
      setApplications(Array.isArray(data) ? data.filter((a) => a.job?._id === id || a.job === id) : [])
    } catch {
      setApplications([])
    }
  }

  const handleStatusChange = async (appId, status) => {
    try {
      await applicationsApi.updateStatus(appId, status)
      loadApplications()
    } catch (err) {
      setError(err.message)
    }
  }

  const loadJob = async () => {
    try {
      const data = await jobsApi.get(id)
      setJob(data)
    } catch (err) {
      setJob(null)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setError('')
    setApplying(true)
    try {
      await applicationsApi.create({ jobId: id, coverLetter })
      setApplied(true)
    } catch (err) {
      setError(err.message || 'Ошибка отклика')
    } finally {
      setApplying(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Удалить вакансию?')) return
    try {
      await jobsApi.delete(id)
      navigate('/my-jobs')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>
  if (!job) return <p className="error-msg">Вакансия не найдена</p>

  const isOwner = user && (job.employer?._id === user.id || job.employer === user.id)
  const canApply = user && user.role === 'job_seeker' && job.status === 'active'
  const employerId = job.employer?._id || job.employer
  const isEmployer = user && (employerId === user.id || user.role === 'admin')

  return (
    <div className="job-detail">
      <div className="job-detail-header card">
        <div className="job-detail-title">
          <h1>{job.title}</h1>
          <span className={`badge badge-${job.status}`}>
            {job.status === 'active' ? 'Активна' : 'Закрыта'}
          </span>
        </div>
        <p className="job-company">{job.company}</p>
        <p className="job-meta">
          {job.location}
          {job.salary && ` • ${job.salary}`}
          {job.jobType && ` • ${JOB_TYPES[job.jobType]}`}
        </p>
        {isOwner && (
          <div className="job-actions">
            <button onClick={() => navigate(`/my-jobs/${id}/edit`)} className="btn btn-secondary">
              Редактировать
            </button>
            <button onClick={handleDelete} className="btn btn-danger">Удалить</button>
          </div>
        )}
      </div>
      <div className="job-detail-body card">
        <h3>Описание</h3>
        <p className="job-description">{job.description}</p>
        {job.requirements?.length > 0 && (
          <>
            <h3>Требования</h3>
            <ul>
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      {canApply && !applied && (
        <div className="apply-form card">
          <h3>Откликнуться</h3>
          <form onSubmit={handleApply}>
            <div className="form-group">
              <label>Сопроводительное письмо</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Расскажите о себе..."
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={applying}>
              {applying ? 'Отправка...' : 'Откликнуться'}
            </button>
          </form>
        </div>
      )}
      {applied && (
        <div className="card success-msg">Вы откликнулись на эту вакансию.</div>
      )}
      {isEmployer && applications.length > 0 && (
        <div className="applications-section card">
          <h3>Отклики ({applications.length})</h3>
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app._id} className="application-item">
                <div className="application-item-header">
                  <strong>{app.applicant?.fullName || app.applicant?.username}</strong>
                  <span className={`badge badge-${app.status}`}>{STATUS_LABELS[app.status]}</span>
                </div>
                <p className="application-email">{app.applicant?.email}</p>
                {app.coverLetter && <p className="application-cover">{app.coverLetter}</p>}
                {app.status === 'pending' && (
                  <div className="application-actions">
                    <button onClick={() => handleStatusChange(app._id, 'accepted')} className="btn btn-primary btn-sm">Принять</button>
                    <button onClick={() => handleStatusChange(app._id, 'rejected')} className="btn btn-danger btn-sm">Отклонить</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
