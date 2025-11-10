import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const dispatch = useDispatch()
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      const res = await dispatch(login(form)).unwrap()
      // on success redirect
      navigate('/')
    } catch (err) {
      // error handled in slice
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handle}>
        <label>Username</label>
        <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="btn" type="submit" disabled={auth.loading}>Login</button>
        {auth.error && <div className="error">{auth.error}</div>}
      </form>
      <p>Tip: Use dummyjson login credentials — username: <code>kminchelle</code> password: <code>0lelplR</code> (example)</p>
    </div>
  )
}
