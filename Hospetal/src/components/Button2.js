import "./Button2.css";
function Button2({ buttonText }) {
  return (
    <div className="bottom-button">
      <button className="button">
        <div className="button-wrap">
          {buttonText}
          <img src="/img/발바닥_or.png" alt="주황 발바닥" />
          <img src="/img/발바닥.png" alt="발바닥" className="hover-image" />
        </div>
      </button>
    </div>
  );
}

export default Button2;
