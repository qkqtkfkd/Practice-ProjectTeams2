import style from "../../Modal.module.css";
import { ReactComponent as Close } from "../../../assets/icon/icon-close_w.svg";
import { ReactComponent as Like } from "../../../assets/icon/icon-like.svg";
import { ReactComponent as Reply } from "../../../assets/icon/icon-reply.svg";
import defaultProfile from "../../../assets/icon/icon_profile.png";
import styless from "./WritingModal.module.css";
import PotoSlide from "./PotoSlide";
import { useEffect, useState } from "react";
import Overlay from "../../Overlay";
import CorrectionModal from "./CorrectionModal";
import { collection, db, getDocs, query,where  } from "../../../api/firebase";


function WritingModal({
  setModalOpen,
  modalData,  
  postingData, 
  articleData,
  articleId,
}) {
  let [modalInOpen, setModalInOpen] = useState(false);

  const [commentCounts, setCommentCounts] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  // //////파이어베이스///////////

  useEffect(() => {
    if (modalInOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalInOpen]);

  // /////////////////
  

  useEffect(() => {
    async function fetchComments() {
      if (!articleId) {  // articleId가 유효하지 않으면 (즉, undefined이면) 함수를 종료
        return;
      }
      const commentsRef = collection(db, "Comments");
      const q = query(commentsRef, where("articleId", "==", articleId));  // 여기에서 articleData.articleId를 참조
      const commentsSnapshot = await getDocs(q);
      const commentsData = commentsSnapshot.docs.map(doc => doc.data());
      setComments(commentsData);
    }
    fetchComments();
  },  [articleId]);


  // /////////////////

  return (
    <div className={style.modalbox} style={{ width: "70rem", height: "45rem" }}>
      <div className={style.header}>
        <h4>내가 쓴 글</h4>
        <button
          className={style.closebtn}
          onClick={() => {
            setModalOpen(false);
          }}
        >
          <Close />
        </button>
      </div>

      <div className={styless.writingbody}>
        <figure className={styless.potoSlide}>
          <PotoSlide />
        </figure>

        <div className={styless.post}>
          <from className={styless.wordtext}>
            <div className={styless.head}>
              <figure className={styless.figure}>
                {modalData && modalData.userData.profileImageURL ? (
                  <img
                    src={modalData.userData.profileImageURL}
                    alt="Profile"
                    className="profiles"
                  />
                ) : (
                  <img src={defaultProfile} className="profiles" />
                )}
              </figure>
              <p style={{ fontSize: "15px" }}>
                <strong>{postingData?.memberNickName}</strong>
              </p>
              <div className={styless.ico}>
                <Like className={styless.icon} alt="likeIconss" />
                <p>{likeCount}</p>
              </div>
              <div className={styless.ico}>
                <Reply className={styless.icon} alt="replyIcon" />
                <p>{commentCounts}</p>
              </div>
            </div>

            <div className={styless.wordBox}>
              <div className={styless.wordTitle}>
                <p className={styless.title_p}>{postingData.title}</p>
                <span className={styless.date}>{postingData.uploadTime}</span>
              </div>
              <p className={styless.word_p}>{postingData.content}</p>
            </div>

            <div className={styless.commentss}>
            {comments.map((comment, index) => (
              <div  key={index} className={styless.commentssbox}>
                <figure className={styless.figure}>
                  {modalData && modalData.userData.profileImageURL ? (
                    <img
                      src={modalData.userData.profileImageURL}
                      alt="Profile"
                      className="profiles"
                    />
                  ) : (
                    <img src={defaultProfile} className="profiles" />
                  )}
                </figure>
                <div>
                  <p>
                    <strong>강자자</strong>
                  </p>
                  <p> {comment.title}저도 나눔하고 싶어요</p>
                </div>
                <span className={styless.date}></span>
              </div>
               ))}
            </div>
          </from>

          <div className={style.btnbox}>
            <button
              className={style.button2}
              type="submit"
              style={{ width: "13rem" }}
              onClick={() => {
                setModalInOpen(true);
              }}
            >
              수정하기
            </button>
            <button
              className={style.button2}
              type="submit"
              style={{ width: "13rem" }}
              onClick={() => {
                setModalOpen(false);
              }}
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
      {modalInOpen && <Overlay modalOpen={modalInOpen} />}
      {modalInOpen && <CorrectionModal setModalInOpen={setModalInOpen} />}
    </div>
  );
}

export default WritingModal;
