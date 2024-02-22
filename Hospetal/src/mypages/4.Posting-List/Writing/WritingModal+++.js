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

import { getMatchingCollections,db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
} from "../../../api/firebase";
import MessageToUser from "../../../components/MessageToUser";
import CommentButton from "../../../components/CommentButton";
import ModifiedButton from "../../../components/ModifiedButton";
import DeleteButton from "../../../components/DeleteButton";
import ModifyModal from "../../../components/ModifyModal";
import CommentsComponent from "../../../components/Comments";
import messageToUser from "../../../assets/icon/paper plane ff9b50.png";
import chevronRightIcon from "../../../assets/icon/chevron_right_ff9b50.png";
import chevronLeftIcon from "../../../assets/icon/chevron_left_ff9b50.png";
import { useFetchUserInfo } from "../../../contexts/MemberContext";


function WritingModal({ setModalOpen, messageNo, userData,modalData, 
  isOpen,
  uploadImages,
  onSendData,
  onClose,  
  uploadTime, 
  comments,
  articleId,
  commentCount,
  onSendMessage,
  refreshArticle,
  refreshFlag,}) {

  const [PostingW, setPostingW] = useState([]);
  let [modalInOpen, setModalInOpen] = useState(false);


  const [images, setImages] = useState([]);
  const [showChevron, setShowChevron] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [commentCounts, setCommentCounts] = useState(0);
  const [showMessageToUser, setShowMessageToUser] = useState(false);
  const [content, setContent] = useState("");
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [userDatas, setUserDatas] = useState(null);
  const [modalDatas, setModalDatas] = useState(null);

  // //////파이어베이스///////////
  async function fetchMessagesByMemberId() {
    const collections = await getMatchingCollections();
    const messages = collections.map((col) => col.data());
    return messages;
  }

  useEffect(() => {
    fetchMessagesByMemberId().then((data) => {
      setPostingW(data);
      console.log(data);
    });
  }, []);


  useEffect(() => {
    if (modalInOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalInOpen]);


  // //////////////////////

  const fetchUserInfo = useFetchUserInfo();

  useEffect(() => {
    if (modalData && modalData.content) {
      setContent(modalData.content);
    }
  }, [modalData]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const commentQuerySnapshot = await getDocs(
          query(collection(db, "Comments"), where("articleId", "==", articleId))
        );
        const count = commentQuerySnapshot.size;
        setCommentCounts(count);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, [articleId, refreshFlag]);

  const fetchUserData = async () => {
    try {
      await fetchUserInfo();
      setUserDataLoaded(true);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (modalData && modalData.docId) {
      fetchUserData();
    }
  }, [modalData]);

  useEffect(() => {
    if (isOpen) {
      setImages([]);
      setCurrentIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const newShowChevron =
      images.length > 1 || (modalData.images && modalData.images.length > 1);
    setShowChevron(newShowChevron);
  }, [images.length, modalData.images]);

  useEffect(() => {
    if (modalData && modalData.docId) {
      const unsubscribe = onSnapshot(
        doc(db, "likeCounts", modalData.docId),
        (snapshot) => {
          const updatedLikeCount = snapshot.data()?.likeCount || 0;
          setLikeCount(updatedLikeCount);
        }
      );

      return () => unsubscribe();
    }
  }, [modalData && modalData.docId]);

  const handleLikeClick = async () => {
    if (modalData && modalData.docId) {
      try {
        const articleDocRef = doc(db, "likeCounts", modalData.docId);
        const docSnapshot = await getDoc(articleDocRef);

        const newLikeCount = (docSnapshot.data()?.likeCount || 0) + 1;
        await setDoc(articleDocRef, { likeCount: newLikeCount });

        localStorage.setItem(`like_${modalData.docId}`, "liked");

        setLikeCount(newLikeCount);
      } catch (error) {
        console.error("Error updating like count:", error);
      }
    }
  };

  const handleButtonClick = (e) => {
    const clickedElement = e.target || e.currentTarget;

    if (
      clickedElement.closest(".close-img2") ||
      clickedElement.classList.contains("close-img2")
    ) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.closest(".modal-content")) {
      return;
    }

    onClose();
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? modalData.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === modalData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMessageToUserClick = () => {
    setShowMessageToUser(true);
  };

  const sendMessage = (message) => {
    console.log("보내는 메세지:", message);
  };

  const getCurrentUserData = () => {
    const userDataJSON = localStorage.getItem("member");
    if (userDataJSON) {
      return JSON.parse(userDataJSON);
    } else {
      return null;
    }
  };

  const handleModifiedButtonClick = async () => {
    if (!userDataLoaded || !userData) {
      return;
    }

    try {
      const currentUserData = getCurrentUserData();

      if (
        modalData.userData.memberNickName === currentUserData?.memberNickName
      ) {
        setShowModifyModal(true);
      } else {
        alert("다른 사용자의 글은 수정할 수 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleModifyModalClose = () => {
    setShowModifyModal(false);
  };

  const handleModifySave = (modifiedContent) => {
    setContent(modifiedContent);
    saveModifiedContent(modifiedContent);
  };

  const saveModifiedContent = async (modifiedContent) => {
    try {
      const articleRef = doc(db, "articles", articleId);
      await updateDoc(articleRef, { content: modifiedContent });
      localStorage.setItem(`content_${articleId}`, modifiedContent);
      setContent(modifiedContent);
    } catch (error) {
      console.error("Error saving modified content:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "articles", articleId));
      onClose();
      setModalDatas(null);

      refreshArticle();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  useEffect(() => {
    if (modalData === null) {
      onClose();
    }
  }, [modalData]);


  // //////////////////////

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

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {showMessageToUser && (
              <MessageToUser
                isOpen
                onClose={() => setShowMessageToUser(false)}
              />
            )}
            <div className="modal-imgBox">
              {/* <figure className="figurebox" id="imageFigure" images={images}>
                {modalData.images && modalData.images.length > 0 && (
                  <>
                    <div className="image-indicators">
                      {modalData.images.map((_, index) => (
                        <div
                          key={index}
                          className={`image-indicator ${
                            currentIndex === index ? "active" : ""
                          }`}
                        ></div>
                      ))}
                    </div>
                    {modalData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`선택된 이미지 ${index + 1}`}
                        style={{
                          display: currentIndex === index ? "block" : "none",
                        }}
                      />
                    ))}
                  </>
                )}
                {showChevron && (
                  <>
                    <div
                      className="modal-chevron modal-chevron-left"
                      onClick={handlePrevClick}
                    >
                      <img src={chevronLeftIcon} alt="left-chevron" />
                    </div>
                    <div
                      className="modal-chevron modal-chevron-right"
                      onClick={handleNextClick}
                    >
                      <img src={chevronRightIcon} alt="right-chevron" />
                    </div>
                  </>
                )}
              </figure> */}
            </div>
            <div className="modal-contentBox">
              <div className="modal-content-titles">
                <div className="modaldata-titles">
                  <span className="modaldata-profile">
                    {modalData && modalData.userData.profileImageURL ? (
                      <img
                        src={modalData.userData.profileImageURL}
                        alt="Profile"
                        className="profiles"
                      />
                    ) : (
                      <img src={defaultProfile} className="profiles" />
                    )}
                  </span>
                  {userData && (
                    <div className="modaldata-titles-user">
                      {userData?.memberNickName}
                    </div>
                  )}
                </div>
                <div className="modaldata-title-icons">
                  <div className="icon-wrapper">
                    <img
                      className="modaldata-title-icons"
                      src={Like}
                      alt="likeIconss"
                      onClick={handleLikeClick}
                    />
                    <span className="likeCountss">{likeCount}</span>
                  </div>
                  <div className="icon-wrappers">
                    <img
                      className="modaldata-title-icons"
                      src={Reply}
                      alt="replyIcon"
                    />
                    <span className="commentCountss">{commentCounts}</span>
                  </div>
                </div>
              </div>
              <div className="modal-content-desc">
                <div className="modal-content-desc-title">
                  {modalData.title}
                  <span className="title-uploadtime">{uploadTime}</span>
                </div>
                <div className="modal-content-desc-content">{content}</div>
              </div>
              <div>
                <CommentsComponent
                  articleId={articleId}
                  commentsProp={modalData.comments}
                  modalData={modalData}
                  userData={userData}
                />
              </div>
              <CommentButton
                onSendData={onSendData}
                uploadImages={uploadImages}
                articleId={modalData.docId}
              />
              <div className="several-function-wrapper">
                <img
                  className="message-to-user"
                  src={messageToUser}
                  onClick={handleMessageToUserClick}
                />
                <div className="mdbtn-wrapper">
                  <ModifiedButton onClick={handleModifiedButtonClick} />
                  <DeleteButton onDelete={handleDelete} articleId={articleId} />
                </div>
              </div>
              {showMessageToUser && (
                <MessageToUser
                  isOpen={showMessageToUser}
                  onClose={() => setShowMessageToUser(false)}
                  onSendMessage={sendMessage}
                  userData={userData}
                />
              )}
              {showModifyModal && (
                <ModifyModal
                  isOpen={showModifyModal}
                  onClose={handleModifyModalClose}
                  onSave={handleModifySave}
                  initialContent={content}
                />
              )}
            </div>
          </div>

      {/* <div className={styless.writingbody}>
        <figure className={styless.potoSlide}>
          <PotoSlide />
        </figure>

        <div className={styless.post}>
          {PostingW.map((Posting, index) => (
            <from key={index} className={styless.wordtext}>
              <div className={styless.head}>
                <figure className={styless.figure}>
                  <img src={defaultProfile} className="profiles" />
                </figure>
                {userData && (
                  <p style={{ fontSize: "15px" }}>
                    <strong>{Posting?.memberNickName}</strong>
                  </p>
                )}
                <div className={styless.ico}>
                  <Like className={styless.icon} />
                  <p>7</p>
                </div>
                <div className={styless.ico}>
                  <Reply className={styless.icon} />
                  <p>3</p>
                </div>
              </div>

              <div className={styless.wordBox}>
                <div className={styless.wordTitle}>
                  <p className={styless.title_p}>{Posting?.title}</p>
                  <span className={styless.date}>{Posting?.uploadTime}</span>
                </div>
                <p className={styless.word_p}>{Posting?.content}</p>
              </div>

              <div className={styless.next}>
                <figure className={styless.figure}>
                  <img src={defaultProfile} className="profiles" />
                </figure>
                <div>
                  <p>
                    <strong>강자자</strong>
                  </p>
                  <p>{Posting?.title}</p>
                </div>
                <span className={styless.date}>2024-01-12</span>
              </div>
            </from>
          ))}

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
      </div> */}
      {modalInOpen && <Overlay modalOpen={modalInOpen} />}
      {modalInOpen && <CorrectionModal setModalInOpen={setModalInOpen} />}
    </div>
  );
}

export default WritingModal;
