import React, { useEffect } from "react";

export const Message = ({ message, type, onClose, duration = 3000 }) => {
  // Auto-dismiss after the specified duration
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <>
      <div
        className={`fixed  left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg text-base font-medium z-[1000] 
          ${type === "success" ? "bg-[#4caf50] text-white" : ""}
          ${type === "error" ? "bg-[#f44336] text-white" : ""}
          ${type === "pending" ? "bg-[#EFA600] text-white" : ""}`}
      >
        {message}
      </div>
     
    </>
  );
};