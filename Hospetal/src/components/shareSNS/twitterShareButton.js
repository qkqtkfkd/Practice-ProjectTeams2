import React from "react";
import styles from "./shareIcon.module.css";
import { FaXTwitter } from "react-icons/fa6";

const TwitterShareButton = () => {
  return (
    <div>
      <a
        className="twitter-share-button"
        href="https://www.instagram.com/"
        data-size="large"
      >
        <img
          src="/img/insta_logo_r__FFC26F.svg"
          alt="kakao-share-icon"
          className={styles.kakao__icon}
        />
        {/* <FaXTwitter className={styles.twitter__icon} /> */}
      </a>
    </div>
  );
};

export default TwitterShareButton;
