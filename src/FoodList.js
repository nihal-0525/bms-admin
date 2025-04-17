import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../src/Firebase/FirebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./FoodList.css";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const documentNames = ["1new", "2new", "3new", "4new"];

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        let allFoodItems = [];

        for (const docName of documentNames) {
          const foodCollectionRef = collection(db, "FoodData", docName, "food");
          const querySnapshot = await getDocs(foodCollectionRef);

          querySnapshot.forEach((docSnap) => {
            allFoodItems.push({
              id: docSnap.id,
              docName,
              ...docSnap.data(),
            });
          });
        }

        setFoodItems(allFoodItems);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleInputChange = (e, field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const { id, docName, FoodName, FoodPrice, FoodImageUrl, InStock } = editData;

    if (!id || !docName) {
      alert("Invalid document reference.");
      return;
    }

    try {
      const foodDocRef = doc(db, "FoodData", docName, "food", id);
      await updateDoc(foodDocRef, {
        FoodName,
        FoodPrice,
        FoodImageUrl,
        InStock: InStock === "true" || InStock === true,
      });

      setFoodItems((prev) =>
        prev.map((item) => (item.id === id ? { ...editData } : item))
      );

      alert("Food item updated successfully!");
      setEditingId(null);
    } catch (error) {
      console.error("Error updating food:", error);
      alert("Error updating food data. Check console.");
    }
  };

  const filteredItems = foodItems.filter((item) =>
    item.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="food-list-container">
      {/* Top Navigation Bar */}
      <div className="top-bar">
        <nav className="navbar">
          <button className="nav-button active">Add/Edit Food Data</button>
          <button className="nav-button" onClick={() => navigate("/pending-orders")}>
            Pending Orders
          </button>
          <button className="nav-button" onClick={() => navigate("/confirmed-orders")}>
            Confirmed Orders
          </button>
          <button className="nav-button" onClick={() => navigate("/canceled-orders")}>
            Canceled Orders
          </button>
        </nav>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* Header */}
      <div className="header">
        <h1>All Food Items</h1>
        <input
          type="text"
          placeholder="🔍 Search food..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="add-button" onClick={() => navigate("/add-food")}>➕ Add</button>
      </div>

      {/* Food Table */}
      {loading ? (
        <p>Loading food items...</p>
      ) : (
        <table className="food-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.FoodImageUrl || "placeholder.jpg"}
                      alt={item.FoodName}
                      className="food-image"
                    />
                  </td>

                  {editingId === item.id ? (
                    <>
                      <td>
                        <input
                          value={editData.FoodName}
                          onChange={(e) => handleInputChange(e, "FoodName")}
                        />
                      </td>
                      <td>
                        <input
                          value={editData.FoodPrice}
                          onChange={(e) => handleInputChange(e, "FoodPrice")}
                        />
                      </td>
                      <td>
                        <select
                          value={(editData.InStock ?? "").toString()}
                          onChange={(e) => handleInputChange(e, "InStock")}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                      <td>
                        <button className="save-button" onClick={handleSave}>💾 Save</button>
                        <button className="cancel-button" onClick={() => setEditingId(null)}>❌ Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.FoodName}</td>
                      <td>₹{item.FoodPrice}</td>
                      <td>{item.InStock ? "✅ Yes" : "❌ No"}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEditClick(item)}>✏ Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No food items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FoodList;
