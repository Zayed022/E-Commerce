import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCart, removeCartItem, updateCartQuantity } from "../../store/cartSlice";
import { Link } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <section className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <Link to="/products" className="cart-link-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="cart-img"
                  />
                  <div>
                    <h3 className="cart-item-name">{item.product.title}</h3>
                    <p className="cart-item-price">₹{item.product.price}</p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateCartQuantity({
                          id: item.id,
                          quantity: Number(e.target.value),
                        })
                      )
                    }
                    className="cart-input"
                  />
                  <button
                    className="cart-remove-btn"
                    onClick={() => dispatch(removeCartItem(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <h2 className="cart-total">Total: ₹{total.toFixed(2)}</h2>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
