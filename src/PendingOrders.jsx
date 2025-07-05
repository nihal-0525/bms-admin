import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../src/Firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useLocation } from "./LocationContext";
import "./PendingOrders.css";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { locationId } = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!locationId) return;

      try {
        const ordersCollectionRef = collection(db, "payments");
        const querySnapshot = await getDocs(ordersCollectionRef);

        const ordersList = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.() || new Date(0);
            return {
              id: doc.id,
              ...data,
              timestamp,
            };
          })
          .filter((order) => order.location === locationId)
          .sort((a, b) => b.timestamp - a.timestamp); // ✅ Sort latest first

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [locationId]);

  const handleConfirm = async (order) => {
    try {
      await addDoc(collection(db, "confirmedOrders"), order);

      if (order.userId) {
        const userPastOrderRef = doc(
          db,
          "userOrders",
          order.userId,
          "pastOrders",
          order.id
        );
        await setDoc(userPastOrderRef, {
          ...order,
          status: "confirmed",
          timestamp: order.timestamp || new Date(),
        });
      }

      await deleteDoc(doc(db, "payments", order.id));
      await deleteDoc(
        doc(db, "userOrders", order.userId, "currentOrders", order.id)
      );

      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancel = async (order) => {
    try {
      await addDoc(collection(db, "canceledOrders"), order);

      if (order.userId) {
        const userPastOrderRef = doc(
          db,
          "userOrders",
          order.userId,
          "pastOrders",
          order.id
        );
        await setDoc(userPastOrderRef, {
          ...order,
          status: "canceled",
          timestamp: order.timestamp || new Date(),
        });
      }

      await deleteDoc(doc(db, "payments", order.id));
      await deleteDoc(
        doc(db, "userOrders", order.userId, "currentOrders", order.id)
      );

      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="orders-container">
      <nav className="navbar">
        <button className="nav-button" onClick={() => navigate("/food-list")}>
          Add/Edit Food Data
        </button>
        <button className="nav-button active">Pending Orders</button>
        <button
          className="nav-button"
          onClick={() => navigate("/confirmed-orders")}
        >
          Confirmed Orders
        </button>
        <button
          className="nav-button"
          onClick={() => navigate("/canceled-orders")}
        >
          Canceled Orders
        </button>
      </nav>

      <h1>
        {locationId ? `Pending Orders for ${locationId}` : "Select a Location"}
      </h1>

      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-info">
                <p>
                  <strong>Food Items:</strong>{" "}
                  {order.cart.map((item) => item.FoodName).join(", ")}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{order.total}
                </p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {order.timestamp
                    ? new Date(order.timestamp).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {order.id}
                </p>
              </div>
              <div className="order-actions">
                <button
                  className="confirm-button"
                  onClick={() => handleConfirm(order)}
                >
                  ✔ Confirm
                </button>
                <button
                  className="cancel-button"
                  onClick={() => handleCancel(order)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders.</p>
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
