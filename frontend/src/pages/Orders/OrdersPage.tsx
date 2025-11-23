import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchMyOrders } from "../../store/ordersSlice";
import "./OrdersPage.css";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (status === "loading")
    return <p className="orders-loading">Loading your orders...</p>;

  if (!items.length)
    return (
      <h2 className="orders-empty">
        No Orders Found
      </h2>
    );

  return (
    <section className="orders-container">
      <h1 className="orders-title">My Orders</h1>

      <div className="orders-list">
        {items.map((order) => (
          <div key={order.id} className="order-card">
            <header className="order-header">
              <span className="order-id">Order ID: {order.id.slice(0, 8)}...</span>
              <span className={`order-status ${order.status}`}>
                {order.status.toUpperCase()}
              </span>
            </header>

            <p className="order-address">
              <strong>Delivery:</strong> {order.address}
            </p>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="order-item-img"
                  />
                  <div className="order-item-details">
                    <span className="order-item-title">{item.product.title}</span>
                    <span className="order-item-qty">Qty: {item.quantity}</span>
                    <span className="order-item-price">₹{item.product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <footer className="order-footer">
              <strong>Total Paid: ₹{order.total}</strong>
            </footer>
          </div>
        ))}
      </div>
    </section>
  );
}
