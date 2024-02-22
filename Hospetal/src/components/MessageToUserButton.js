import "./MessageToUserButton.css";

function MessageToUserButton({ children, onClick, onSendMessage }) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="bottom-buttons">
      <button onClick={onSendMessage} className="MessageToUserButton">
        <div className="button-wrapper">{children}</div>
      </button>
    </div>
  );
}

export default MessageToUserButton;
