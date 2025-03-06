import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react"; // Optional: for close icon

const Modal = ({ isOpen, onClose, title, children, showFooter = true }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <div className="flex">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          {/* Modal Title */}
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}

        </div>
        

        {/* Modal Content */}
        <div className="mt-4">{children}</div>

        {/* Footer Buttons */}
        {showFooter && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
            
          </div>
        )}
      </div>
    </div>,
    document.body // Using portal to render modal outside normal DOM flow
  );
};

export default Modal;
