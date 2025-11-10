import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slices/productsSlice'

export default function CrudPage() {
  const dispatch = useDispatch()
  const { items, loading, total } = useSelector(s => s.products)
  const [form, setForm] = useState({ title: '', price: '', description: '' })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAdd = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price) }
    await dispatch(addProduct(payload)).unwrap().catch(()=>{})
    setForm({ title: '', price: '', description: '' })
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setForm({ title: p.title || '', price: p.price || '', description: p.description || '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await dispatch(updateProduct({ id: editId, data: form })).unwrap().catch(()=>{})
    setEditId(null)
    setForm({ title: '', price: '', description: '' })
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <div>
      <h2>CRUD Page</h2>
      <div>Total records: {total}</div>

      <div className="crud">
        <form onSubmit={editId ? handleUpdate : handleAdd} className="card">
          <h3>{editId ? 'Edit' : 'Add'} Product</h3>
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <label>Price</label>
          <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <label>Description</label>
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button className="btn" type="submit">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn" onClick={() => { setEditId(null); setForm({ title:'', price:'', description:'' }) }}>Cancel</button>}
        </form>

        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.price}</td>
                  <td>
                    <button className="btn small" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && <div>Loading...</div>}
    </div>
  )
}
