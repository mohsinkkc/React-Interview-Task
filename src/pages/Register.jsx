import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '' })
  const dispatch = useDispatch()
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await dispatch(register(form)).unwrap()
      navigate('/')
    } catch (err) {}
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handle}>
        <label>Username</label>
        <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        <label>First name</label>
        <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
        <label>Last name</label>
        <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="btn" type="submit" disabled={auth.loading}>Register</button>
        {auth.error && <div className="error">{auth.error}</div>}
      </form>
    </div>
  )
}
