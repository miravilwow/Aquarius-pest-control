import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import './AdminLogin.css'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const BRAND_NAME = 'Aquarius Pest Control Services'
  const LOGO_SRC = '/image/logo.jpg'

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
          <img className="login-logo" src={LOGO_SRC} alt={BRAND_NAME} />
          <h1>{BRAND_NAME}</h1>
          <p className="login-subtitle">Admin Login</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <Field>
            <Input
              id="input-field-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Username"
            />
          </Field>

          <Field className="mt-4">
            <Input
              id="input-field-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </Field>

          <Button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button asChild variant="ghost" className="text-sm">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

