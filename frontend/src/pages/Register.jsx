import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/client'
import './Auth.css'

const ROLES = [
  { value: 'job_seeker', label: 'Соискатель' },
  { value: 'employer', label: 'Работодатель' },
]

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'job_seeker',
    fullName: '',
    phone: '',
    companyName: '',
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.register(form, resumeFile)
      const data = await authApi.login({ username: form.username, password: form.password })
      const userData = {
        id: data.id || data._id,
        username: data.username,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
      }
      if (!data.accessToken) throw new Error('Сервер не вернул токен')
      login(userData, data.accessToken)
      navigate('/')
    } catch (err) {
      const msg = err.message || 'Ошибка регистрации'
      const translated = {
        'Username is already in use!': 'Логин уже занят',
        'Email is already in use!': 'Email уже используется',
        'Invalid role. Must be one of: job_seeker, employer, admin': 'Недопустимая роль',
        'Only PDF files are allowed.': 'Допускаются только файлы PDF.',
      }
      setError(translated[msg] || msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Роль *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 777 123 45 67"
              required
            />
          </div>
          <div className="form-group">
            <label>Резюме (PDF)</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            {resumeFile && <span className="file-name">{resumeFile.name}</span>}
          </div>
          {form.role === 'employer' && (
            <div className="form-group">
              <label>Компания *</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
              />
            </div>
          )}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}
