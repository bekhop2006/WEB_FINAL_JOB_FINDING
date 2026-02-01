import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../api/client'
import './Profile.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    resume: '',
    companyName: '',
    password: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile()
      setForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        resume: data.resume || '',
        companyName: data.companyName || '',
        password: '',
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
    setMessage('')
    setSaving(true)
    try {
      const updates = { ...form }
      if (!updates.password) delete updates.password
      const data = await userApi.updateProfile(updates)
      updateUser({ ...user, ...data, id: data._id || user.id })
      setMessage('Профиль обновлён')
      setForm({ ...form, password: '' })
    } catch (err) {
      setError(err.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      <div className="profile-info card" style={{ marginBottom: '1rem' }}>
        <p><strong>Логин:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Роль:</strong> {user?.role === 'job_seeker' ? 'Соискатель' : user?.role === 'employer' ? 'Работодатель' : 'Админ'}</p>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <h2>Редактировать профиль</h2>
        <div className="form-group">
          <label>ФИО</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Телефон</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Резюме (ссылка)</label>
          <input
            type="text"
            value={form.resume}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            placeholder="https://..."
          />
        </div>
        {user?.role === 'employer' && (
          <div className="form-group">
            <label>Компания</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
        )}
        <div className="form-group">
          <label>Новый пароль (оставьте пустым, чтобы не менять)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  )
}
