import React, { createContext, useContext, useState } from "react";

// Buat Context
const LoadingContext = createContext();

// Provider untuk membungkus aplikasi
export const LoadingProvider = ({ children }) => {
  const [isLoad, setIsLoad] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoad, setIsLoad }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook untuk menggunakan LoadingContext
export const useLoading = () => {
  return useContext(LoadingContext);
};
