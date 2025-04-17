import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./Firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./PendingOrders.css";

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const ordersCollectionRef = collection(db, "confirmedOrders");
        const querySnapshot = await getDocs(ordersCollectionRef);

        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConfirmedOrders(ordersList);
      } catch (error) {
        console.error("Error fetching confirmed orders:", error);
      }
    };

    fetchConfirmedOrders();
  }, []);

  return (
    <div className="orders-container">
      <nav className="navbar">
        <button className="nav-button" onClick={() => navigate("/")}>
          Add/Edit Food Data
        </button>
        <button className="nav-button" onClick={() => navigate("/pending-orders")}>
          Pending Orders
        </button>
        <button className="nav-button active">Confirmed Orders</button>
        <button className="nav-button" onClick={() => navigate("/canceled-orders")}>
    Canceled Orders
  </button>
      </nav>

      <h1>Confirmed Orders</h1>

      <div className="orders-list">
        {confirmedOrders.length > 0 ? (
          confirmedOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-info">
                <p><strong>Food Items:</strong> {order.cart.map(item => item.FoodName).join(", ")}</p>
                <p><strong>Total Paid:</strong> ₹{order.total}</p>
                <p><strong>Date & Time:</strong> {new Date(order.timestamp.toDate()).toLocaleString()}</p>
                <p><strong>Transaction ID:</strong> {order.id}</p>
              </div>
              <p className="completed">✅ Completed</p>
            </div>
          ))
        ) : (
          <p>No confirmed orders.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmedOrders;
