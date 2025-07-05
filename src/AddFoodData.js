import React, { useState } from "react";
import "./AddFoodData.css";
import { db } from "../src/Firebase/FirebaseConfig";
import { addDoc, collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddFoodData = () => {
  const [FoodName, setFoodName] = useState("");
  const [FoodPrice, setFoodPrice] = useState("");
  const [FoodImageUrl, setFoodImageUrl] = useState("");
  const [documentName, setDocumentName] = useState("1new");
  const [location, setLocation] = useState("FoodData");
  const [InStock, setInStock] = useState("true"); // ✅ InStock state (string)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FoodName || !FoodPrice || !documentName || !location) {
      alert("Please fill all fields");
      return;
    }

    const foodData = {
      FoodName,
      FoodPrice,
      FoodImageUrl,
      InStock: InStock === "true", // ✅ Convert string to boolean
    };

    try {
      const foodDocRef = doc(db, location, documentName);
      await addDoc(collection(foodDocRef, "food"), foodData);
      alert("Food added successfully!");

      setFoodName("");
      setFoodPrice("");
      setFoodImageUrl("");
      setDocumentName("1new");
      setLocation("FoodData");
      setInStock("true");
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Error adding food data.");
    }
  };

  return (
    <div className="food-outermost">
      <div className="form-outer">
        <h1>Add Food Data</h1>
        <form className="form-inner" onSubmit={handleSubmit}>
          <label>Food Name</label>
          <input
            type="text"
            value={FoodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <br />

          <div className="form-row">
            <div className="form-col">
              <label>Food Price</label>
              <input
                type="number"
                value={FoodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
              />
            </div>
          </div>
          <br />

          <div className="form-row">
            <div className="form-col">
              <label>Image URL</label>
              <input
                type="text"
                value={FoodImageUrl}
                onChange={(e) => setFoodImageUrl(e.target.value)}
              />
            </div>
          </div>
          <br />

          <div className="form-row">
            <div className="form-col">
              <label>Select Document</label>
              <select
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              >
                <option value="1new">1new</option>
                <option value="2new">2new</option>
                <option value="3new">3new</option>
                <option value="4new">4new</option>
              </select>
            </div>
          </div>
          <br />

          <div className="form-row">
            <div className="form-col">
              <label>Select Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="FoodData">FoodData</option>
                <option value="FoodData2">FoodData2</option>
              </select>
            </div>
          </div>
          <br />

          {/* ✅ InStock dropdown */}
          <div className="form-row">
            <div className="form-col">
              <label>In Stock</label>
              <select
                value={InStock}
                onChange={(e) => setInStock(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <br />

          <button type="submit">Add Food</button>
          <button
            type="button"
            onClick={() => navigate("/food-list")}
            className="back-button"
          >
            ⬅ Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodData;
