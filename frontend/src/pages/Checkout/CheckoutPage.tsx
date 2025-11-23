import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { checkoutOrder } from "../../store/ordersSlice";
import { fetchCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((s) => s.cart.items);

  useEffect(() => {
    if (!cart.length) dispatch(fetchCart());
  }, [cart.length, dispatch]);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(checkoutOrder({ address })).unwrap();
    navigate("/orders/my");
  };

  return (
    <section className="checkout-container">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Checkout (Cash on Delivery)</h1>

        <div className="checkout-grid">
          {/* Address Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <label className="checkout-label">Delivery Address</label>
            <textarea
              className="checkout-textarea"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={5}
            />
            <button type="submit" className="checkout-button">
              Place COD Order
            </button>
          </form>

          {/* Order Summary */}
          <aside className="order-summary">
            <h2 className="order-summary-title">Order Summary</h2>
            <div className="order-summary-list">
              {cart.map((item) => (
                <div key={item.id} className="order-summary-item">
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
