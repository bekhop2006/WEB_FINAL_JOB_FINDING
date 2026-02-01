import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '../api/client'
import './JobForm.css'

const JOB_TYPES = [
  { value: 'full_time', label: 'Полная занятость' },
  { value: 'part_time', label: 'Частичная' },
  { value: 'contract', label: 'Контракт' },
  { value: 'internship', label: 'Стажировка' },
]

export default function CreateJob() {
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = {
        ...form,
        requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
      }
      const job = await jobsApi.create(data)
      navigate(`/jobs/${job._id}`)
    } catch (err) {
      setError(err.message || 'Ошибка создания')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="job-form-page">
      <h1>Новая вакансия</h1>
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
              placeholder="от 50 000 ₽"
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
          <label>Категория</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="IT, Маркетинг..."
          />
        </div>
        <div className="form-group">
          <label>Требования (каждое с новой строки)</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={4}
            placeholder="Опыт от 1 года&#10;Знание JavaScript&#10;..."
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  )
}
