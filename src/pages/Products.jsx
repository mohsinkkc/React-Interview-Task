import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../slices/productsSlice'

export default function Products() {
  const dispatch = useDispatch()
  const { items, loading, error, total } = useSelector(s => s.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div>
      <h2>Products</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div>Total records: {total}</div>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th></tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
