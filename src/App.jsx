import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import CrudPage from './pages/CrudPage'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './slices/authSlice'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const auth = useSelector(s => s.auth)
  const dispatch = useDispatch()

  return (
    <div>
      <header className="header">
        <h1>Interview Task App</h1>
        <nav>
          <Link to="/">Products</Link>
          <Link to="/crud">CRUD</Link>
          {!auth.user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span>Welcome, {auth.user.username || auth.user.firstName || 'User'}</span>
              <button className="btn" onClick={() => dispatch(logout())}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/crud" element={
            <ProtectedRoute>
              <CrudPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
