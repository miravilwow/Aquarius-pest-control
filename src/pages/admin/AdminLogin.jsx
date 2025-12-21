import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLogin.css'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <img 
            src="https://scontent.fcrk1-2.fna.fbcdn.net/v/t39.30808-6/247517119_1040926690025783_3271896171650896471_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHqLT6Uvu1Sb4miuoT5evBDMK8cwDXLlT0wrxzANcuVPZQdasrVqaYWuL7pYsR2kK7oFpkhNnDfJjrKCVub_6QC&_nc_ohc=A7lOd25oVqgQ7kNvwGb-UVN&_nc_oc=AdlRYWfhADgPw8Fua-ezqUd4VugSjCCZoh7utbWex4t2jFcWekIGmywj9N89zexggJ0&_nc_zt=23&_nc_ht=scontent.fcrk1-2.fna&_nc_gid=thNKrsOKoV7VM-ptWgDBrg&oh=00_AfluMfHgJGV_F_py790i8kvV0hZGohjjy-gzO-WkXJoRxg&oe=694D5642" 
            alt="Aquarius Pest Control Services Logo" 
            className="login-logo"
          />
          <h1>Aquarius Pest Control</h1>
          <p className="login-subtitle">Admin Login</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

