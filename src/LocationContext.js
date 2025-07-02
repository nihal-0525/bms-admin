import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationId, setLocationId] = useState(() => {
    return localStorage.getItem("selectedLocation") || "";
  });

  useEffect(() => {
    if (locationId) {
      localStorage.setItem("selectedLocation", locationId);
    }
  }, [locationId]);

  return (
    <LocationContext.Provider value={{ locationId, setLocationId }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
