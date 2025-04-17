import React, { useState } from "react";
import "./AddFoodData.css";
import { db } from "../src/Firebase/FirebaseConfig";
import { addDoc, collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // ✅ Import this

const AddFoodData = ({ onBack }) => {
  const [FoodName, setFoodName] = useState("");
  const [FoodPrice, setFoodPrice] = useState("");
  const [FoodImageUrl, setFoodImageUrl] = useState("");
  const [documentName, setDocumentName] = useState("1new");

  const navigate = useNavigate(); // ✅ Hook call

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FoodName || !FoodPrice || !documentName) {
      alert("Please fill all fields");
      return;
    }

    const foodData = {
      FoodName,
      FoodPrice,
      FoodImageUrl,
    };

    try {
      const foodDocRef = doc(db, "FoodData", documentName);
      await addDoc(collection(foodDocRef, "food"), foodData);
      alert("Food added successfully!");

      // ✅ Clear form fields
      setFoodName("");
      setFoodPrice("");
      setFoodImageUrl("");
      setDocumentName("1new");

      // Optional: Navigate somewhere
      // navigate("/your-desired-route");
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

          <button type="submit">Add Food</button>
          <button
            type="button"
            onClick={() => navigate("/")}
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
