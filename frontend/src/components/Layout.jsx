import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">JobFinder</Link>
          <nav className="nav">
            <Link to="/jobs">Вакансии</Link>
            {user ? (
              <>
                {['employer', 'admin'].includes(user.role) && (
                  <Link to="/my-jobs">Мои вакансии</Link>
                )}
                {['job_seeker', 'admin'].includes(user.role) && (
                  <Link to="/my-applications">Мои отклики</Link>
                )}
                <Link to="/profile">Профиль</Link>
                <span className="user-name">{user.username}</span>
                <button onClick={logout} className="btn btn-secondary btn-sm">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login">Вход</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">© 2025 JobFinder</div>
      </footer>
    </div>
  )
}
