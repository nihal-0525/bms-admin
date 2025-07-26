import React, { useState } from "react";
import "./AddFoodData.css";
import { db } from "../src/Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddFoodData = () => {
  const [FoodName, setFoodName] = useState("");
  const [FoodPrice, setFoodPrice] = useState("");
  const [FoodImageUrl, setFoodImageUrl] = useState("");
  const [location, setLocation] = useState("FoodData");
  const [InStock, setInStock] = useState("true");
  const [Category, setCategory] = useState("Breakfast");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FoodName || !FoodPrice || !location || !Category) {
      alert("Please fill all fields");
      return;
    }

    const foodData = {
      FoodName,
      FoodPrice,
      FoodImageUrl,
      InStock: InStock === "true",
      Category,
    };

    try {
      const foodCollectionRef = collection(db, location); // e.g., FoodData
      await addDoc(foodCollectionRef, foodData);
      alert("Food added successfully!");

      // Reset fields
      setFoodName("");
      setFoodPrice("");
      setFoodImageUrl("");
      setLocation("FoodData");
      setInStock("true");
      setCategory("Breakfast");
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

          {/* ✅ Category Dropdown */}
          <div className="form-row">
            <div className="form-col">
              <label>Select Category</label>
              <select
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Chinese">Chinese</option>
                <option value="Snacks">Snacks</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
          </div>
          <br />

          {/* ✅ InStock Dropdown */}
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
