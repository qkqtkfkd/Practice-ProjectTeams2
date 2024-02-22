import { useEffect } from "react";
import "./MessageToUser.css";
import { useState } from "react";
import iconClose from "../assets/icon/icon-close_ff9b50.png";
import MessageToUserButton from "./MessageToUserButton";

function MessageToUser({ isOpen, onClose, onSendMessage, userData }) {
  const [images, setImages] = useState([]);
  const [showChevron, setShowChevron] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(message, userData);
  };

  useEffect(() => {
    if (isOpen) {
      setImages([]);
      setShowChevron(false);
      setCurrentIndex(0);
      setTitle("");
      setContent("");
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    e.stopPropagation();

    if (!e.target.closest(".modal-content")) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-container">
              <div className="modal-header">
                <span className="modal-span">메세지 보내기</span>
                <img
                  className="close-img"
                  src={iconClose}
                  alt="close-icon"
                  onClick={onClose}
                />
              </div>
              <div className="message-content">
                <textarea
                  placeholder="메세지 내용을 입력하세요"
                  className="message-text"
                  value={message}
                  onChange={handleMessageChange}
                ></textarea>
              </div>
              <MessageToUserButton onClick={handleSendClick}>
                보내기
              </MessageToUserButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageToUser;
