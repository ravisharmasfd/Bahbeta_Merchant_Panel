import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./ModalMessage.css"; // Add styles for the modal

const ModalMessage = ({ messageType, message, redirectRoute }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (messageType === "success" && redirectRoute) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            closeModal();
            navigate(redirectRoute);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [messageType, redirectRoute, navigate]);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{messageType === "success" ? "Success" : "Error"}</h2>
          {messageType !== "success" && (
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
          )}
        </div>
        <div className="modal-body">
          <p>{message}</p>
          {messageType === "success" && (
            <div className="timer">Redirecting in {timer} seconds...</div>
          )}
        </div>
      </div>
    </div>
  );
};

ModalMessage.propTypes = {
  messageType: PropTypes.oneOf(["success", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  redirectRoute: PropTypes.string,
};

ModalMessage.defaultProps = {
  redirectRoute: null,
};

export default ModalMessage;
