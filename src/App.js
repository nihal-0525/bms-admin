import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./Firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import FoodList from "./FoodList";
import AddFoodData from "./AddFoodData";
import PendingOrders from "./PendingOrders";
import ConfirmedOrders from "./ConfirmedOrders";
import CancelledOrders from "./CancelledOrders";
import AdminLogin from "./AdminLogin";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <Router>
      <div className="Container">
        <Routes>
          <Route path="/" element={<Navigate to={isAdmin ? "/food-list" : "/login"} />} />
          <Route path="/login" element={<AdminLogin />} />

          {isAdmin ? (
            <>
              <Route path="/food-list" element={<FoodList />} />
              <Route path="/add-food" element={<AddFoodData />} />
              <Route path="/pending-orders" element={<PendingOrders />} />
              <Route path="/confirmed-orders" element={<ConfirmedOrders />} />
              <Route path="/canceled-orders" element={<CancelledOrders />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
