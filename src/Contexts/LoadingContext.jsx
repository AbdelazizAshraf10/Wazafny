import { createContext, useState, useContext } from "react";

// Create the Loading Context
const LoadingContext = createContext();

// Create a Provider Component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    console.log("startLoading called");
    setIsLoading(true);
  };
  const stopLoading = () => {
    console.log("stopLoading called");
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the Loading Context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default LoadingContext;