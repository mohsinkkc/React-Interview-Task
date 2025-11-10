import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productsSlice';

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error, total } = useSelector((s) => s.products);

  const savedPage = Number(localStorage.getItem('productsPage') || 1);
  const [page, setPage] = useState(savedPage);
  const perPage = 20; // how many products per page

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('productsPage', page);
  }, [page]);

  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return (
    <div>
      <h2>Product List</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div>Total records: {total}</div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
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
  );
}
