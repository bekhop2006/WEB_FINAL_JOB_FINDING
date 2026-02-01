import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobsApi } from '../api/client'
import './JobForm.css'

const JOB_TYPES = [
  { value: 'full_time', label: 'Полная занятость' },
  { value: 'part_time', label: 'Частичная' },
  { value: 'contract', label: 'Контракт' },
  { value: 'internship', label: 'Стажировка' },
]

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full_time',
    category: '',
    requirements: '',
    status: 'active',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const data = await jobsApi.get(id)
      setForm({
        title: data.title || '',
        description: data.description || '',
        company: data.company || '',
        location: data.location || '',
        salary: data.salary || '',
        jobType: data.jobType || 'full_time',
        category: data.category || '',
        requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : '',
        status: data.status || 'active',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data = {
        ...form,
        requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
      }
      await jobsApi.update(id, data)
      navigate(`/jobs/${id}`)
    } catch (err) {
      setError(err.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>

  return (
    <div className="job-form-page">
      <h1>Редактировать вакансию</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Название *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Описание *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Компания *</label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Город *</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Зарплата</label>
            <input
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Тип занятости</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Статус</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Активна</option>
            <option value="closed">Закрыта</option>
          </select>
        </div>
        <div className="form-group">
          <label>Категория</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Требования (каждое с новой строки)</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={4}
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}
