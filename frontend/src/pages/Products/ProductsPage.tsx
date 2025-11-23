import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/productsSlice';
import { addToCart } from '../../store/cartSlice';
import ProductCard from '../../components/products/ProductCard';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (status === 'loading') return <p>Loading products...</p>;

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="products-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={() => handleAdd(p.id)} />
        ))}
      </div>
    </div>
  );
}
