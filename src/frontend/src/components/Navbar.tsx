import { useNavigate } from 'react-router-dom'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Workshop App'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      borderBottom: '1px solid #eee',
      backgroundColor: '#fff',
    }}>
      <span
        data-testid="nav-logo"
        style={{ fontWeight: 'bold', fontSize: 20, cursor: 'pointer' }}
        onClick={() => navigate('/home')}
      >
        {APP_NAME}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Feature nav items are added here by Coding Agent during the workshop */}
        <span
          data-testid="nav-redemptions"
          style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 500 }}
          onClick={() => navigate('/redemptions')}
        >
          Redemptions
        </span>
        <button
          data-testid="logout-button"
          onClick={handleLogout}
          style={{ background: 'none', border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
