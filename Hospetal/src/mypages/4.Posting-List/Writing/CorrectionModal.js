import style from "../../Modal.module.css";
import { ReactComponent as Close } from "../../../assets/icon/icon-close_w.svg";
import IMG from "../../../assets/gallery/꿀팁_02.png";
import styless from "./CorrectionModal.module.css";
import { useState, useEffect } from "react";
import { collection, db, getDocs, getData } from "../../../api/firebase";


function CorrectionModal({ setModalInOpen, messageNo, }) {
  const [PostingW, setPostingW] = useState();

  // const handleLoad = async () => {
  //   const data = await getData(
  //     "MyPageCustomer-PostingW",
  //     "no",
  //     "==",
  //     messageNo
  //   );
  //   setPostingW(data);
  // };

  // useEffect(() => {
  //   handleLoad();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const PostingWData = await getDocs(
        collection(db, "MyPageCustomer-PostingW")
      );
      const dataList = PostingWData.docs.map((doc) => doc.data());
      setPostingW(dataList);
    };

    fetchData();
  }, []);

  return (
    <div className={style.modalbox} style={{ width: "70rem", height: "45rem" }}>
      <div className={style.header}>
        <h4>내가 쓴 글 수정하기</h4>
        <button
          className={style.closebtn}
          onClick={() => {
            setModalInOpen(false);
          }}
        >
          <Close />
        </button>
      </div>

      <div className={styless.writingbody}>
        <div className={styless.poto}>
          {/* <ImgInput /> */}
          <img src={IMG} alt="사진" />
          <span className={styless.span}>+ 사진 수정하기</span>
        </div>

        <div className={styless.post}>
          <from className={styless.wordBox}>
            <div className={styless.wordTitle}>
              <h4>{PostingW?.title}</h4>
            </div>
            <p className={styless.word_p}>
            {PostingW?.content}
            </p>
          </from>

          <button
            className={style.button2}
            type="submit"
            style={{ width: "13rem" }}
            onClick={() => {
              setModalInOpen(false);
            }}
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CorrectionModal;
