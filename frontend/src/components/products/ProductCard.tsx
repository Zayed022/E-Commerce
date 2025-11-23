import type { Product } from '../../types';
import './ProductCard.css';

interface Props {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.title} className="product-card__img" />
      <div className="product-card__body">
        <h3>{product.title}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price}</span>
          <button onClick={onAddToCart}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}
