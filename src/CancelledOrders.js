import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./Firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useLocation } from "./LocationContext"; // ✅ Import context
import "./PendingOrders.css";
import "./CancelledOrders.css";

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { locationId } = useLocation(); // ✅ Get selected location

  useEffect(() => {
    const fetchOrders = async () => {
      if (!locationId) return;

      try {
        const canceledOrdersRef = collection(db, "canceledOrders");
        const querySnapshot = await getDocs(canceledOrdersRef);

        const orderList = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.() || new Date(0); // fallback
            return {
              id: doc.id,
              ...data,
              timestamp,
            };
          })
          .filter((order) => order.location === locationId)
          .sort((a, b) => b.timestamp - a.timestamp); // ✅ Sort by latest

        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching canceled orders:", error);
      }
    };

    fetchOrders();
  }, [locationId]);

  return (
    <div className="orders-container">
      <nav className="navbar">
        <button className="nav-button" onClick={() => navigate("/food-list")}>Add/Edit Food Data</button>
        <button className="nav-button" onClick={() => navigate("/pending-orders")}>Pending Orders</button>
        <button className="nav-button" onClick={() => navigate("/confirmed-orders")}>Confirmed Orders</button>
        <button className="nav-button active">Canceled Orders</button>
      </nav>

      <h1>{locationId ? `Canceled Orders for ${locationId === "FoodData"
        ? "Law Canteen"
        : locationId === "FoodData2"
        ? "Sports Canteen"
        : "Select Location"}` : "Select a Location"}</h1>

      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-info">
                <p><strong>Food Items:</strong> {order.cart.map(item => item.FoodName).join(", ")}</p>
                <p><strong>Total Paid:</strong> ₹{order.total}</p>
                <p><strong>Date & Time:</strong> 
                  {order.timestamp ? order.timestamp.toLocaleString() : "N/A"}
                </p>
                <p><strong>Transaction ID:</strong> {order.id}</p>
              </div>
              <div className="order-actions">
                <p className="canceled">❌ Canceled</p>
              </div>
            </div>
          ))
        ) : (
          <p>No canceled orders found.</p>
        )}
      </div>
    </div>
  );
};

export default CancelledOrders;
