// components/Modal.tsx

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Create a div that will serve as the modal's root
  const modalRoot = document.getElementById("modal-root") || createModalRoot();

  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Function to create a modal root if it doesn't exist
  function createModalRoot() {
    const root = document.createElement("div");
    root.setAttribute("id", "modal-root");
    document.body.appendChild(root);
    return root;
  }

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose} style={styles.overlay}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        style={styles.content}
      >
        <button
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;

// Inline styles for simplicity. You can replace these with CSS modules or styled-components.
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    position: "relative",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90%",
    overflowY: "auto",
    boxShadow: "0 5px 15px rgba(0,0,0,.3)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#aaa",
  },
};
