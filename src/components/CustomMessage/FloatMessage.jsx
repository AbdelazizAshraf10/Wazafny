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
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg text-base font-medium z-[1000] animate-slideIn
          ${type === "success" ? "bg-[#4caf50] text-white" : ""}
          ${type === "error" ? "bg-[#f44336] text-white" : ""}
          ${type === "pending" ? "bg-[#EFA600] text-white" : ""}`}
      >
        {message}
      </div>
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }

          .animate-slideOut:empty {
            animation: slideOut 0.3s ease-out forwards;
          }
        `}
      </style>
    </>
  );
};