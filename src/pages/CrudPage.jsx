import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slices/productsSlice';

export default function CrudPage() {
  const dispatch = useDispatch();
  const { items, loading, total } = useSelector((s) => s.products);

  const [form, setForm] = useState({ title: '', price: '', description: '', category: '' });
  const [editId, setEditId] = useState(null);

  const savedPage = Number(localStorage.getItem('crudPage') || 1);
  const [page, setPage] = useState(savedPage);
  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('crudPage', page);
  }, [page]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    await dispatch(addProduct(payload)).unwrap().catch(() => {});
    setForm({ title: '', price: '', description: '', category: '' });
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      title: p.title || '',
      price: p.price || '',
      description: p.description || '',
      category: p.category || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await dispatch(updateProduct({ id: editId, data: form })).unwrap().catch(() => {});
    setEditId(null);
    setForm({ title: '', price: '', description: '', category: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const startIndex = (page - 1) * perPage;
  const paginatedItems = items.slice(startIndex, startIndex + perPage);

  return (
    <div>
      <h2>CRUD Page</h2>
      <div>Total records: {total}</div>

      <div className="crud">
        <form onSubmit={editId ? handleUpdate : handleAdd} className="card" style={{ flex: '0 0 300px' }}>
          <h3>{editId ? 'Edit' : 'Add'} Product</h3>

          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label>Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <label>Description</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button className="btn" type="submit">
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditId(null);
                setForm({ title: '', price: '', description: '', category: '' });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.description}</td>
                  <td>
                    <button className="btn small" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {loading && <div>Loading...</div>}
    </div>
  );
}
