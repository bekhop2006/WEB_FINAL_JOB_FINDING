// VITE_API_URL = backend base, e.g. https://jobfinder-api.onrender.com (without /api)
const BACKEND_BASE = import.meta.env.VITE_API_URL || ''
const API_BASE = BACKEND_BASE ? `${BACKEND_BASE}/api` : '/api'
export const getUploadUrl = (path) =>
  path ? (path.startsWith('http') ? path : (BACKEND_BASE || '') + path) : ''

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  }
  const token = localStorage.getItem('jobfinder_token')
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function api(endpoint, options = {}) {
  const { method = 'GET', body, auth = true, formData: isFormData = false } = options
  const headers = isFormData ? {} : getHeaders(auth)
  if (!isFormData && auth) {
    const token = localStorage.getItem('jobfinder_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: isFormData ? (headers.Authorization ? { Authorization: headers.Authorization } : {}) : headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && auth) {
      localStorage.removeItem('jobfinder_token')
      localStorage.removeItem('jobfinder_user')
      window.dispatchEvent(new Event('auth:logout'))
    }
    const msg = data.message || data.error || data.msg || (typeof data === 'string' ? data : null)
    throw new Error(msg || `Ошибка ${res.status}`)
  }
  return data
}

// Auth
export const authApi = {
  register: (data, resumeFile = null) => {
    if (resumeFile) {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('role', data.role)
      formData.append('fullName', data.fullName)
      formData.append('phone', data.phone)
      if (data.companyName) formData.append('companyName', data.companyName)
      formData.append('resume', resumeFile)
      return api('/auth/register', {
        method: 'POST',
        body: formData,
        auth: false,
        formData: true,
      })
    }
    return api('/auth/register', { method: 'POST', body: data, auth: false })
  },
  login: (data) => api('/auth/login', { method: 'POST', body: data, auth: false }),
}

// Users
export const userApi = {
  getProfile: () => api('/users/profile'),
  updateProfile: (data) => api('/users/profile', { method: 'PUT', body: data }),
}

// Jobs
export const jobsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api(`/jobs${q ? '?' + q : ''}`, { auth: false })
  },
  get: (id) => api(`/jobs/${id}`, { auth: false }),
  create: (data) => api('/jobs', { method: 'POST', body: data }),
  update: (id, data) => api(`/jobs/${id}`, { method: 'PUT', body: data }),
  delete: (id) => api(`/jobs/${id}`, { method: 'DELETE' }),
  my: () => api('/jobs/my'),
}

// Applications
export const applicationsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api(`/applications${q ? '?' + q : ''}`)
  },
  get: (id) => api(`/applications/${id}`),
  create: (data) => api('/applications', { method: 'POST', body: data }),
  updateStatus: (id, status) => api(`/applications/${id}/status`, { method: 'PUT', body: { status } }),
  delete: (id) => api(`/applications/${id}`, { method: 'DELETE' }),
}
