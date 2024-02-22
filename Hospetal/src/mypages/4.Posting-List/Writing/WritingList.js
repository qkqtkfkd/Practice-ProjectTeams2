import React, { useEffect, useState } from "react";
import CommonTable from "../../table/CommonTable";
import CommonTableRow from "../../table/CommonTableRow";
import { getMatchingCollections } from "../../../api/firebase";
import { renderArticleContent } from "../../../api/firebase";
import WritingModal from "./WritingModal";
import Overlay from "../../Overlay";

const WritingList = (props) => {
  const [PostingW, setPostingW] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState(null);
  

  // //////파이어베이스///////////

  async function fetchMessagesByMemberId() {
    const collections = await getMatchingCollections();
    if (!Array.isArray(collections)) {
      console.error('getMatchingCollections did not return an array:', collections);
      return [];
    }
    const messages = collections.map((col) => col.data());
    return messages;
  }

  useEffect(() => {
    fetchMessagesByMemberId().then((data) => {
      setPostingW(data);
      console.log(data);
    });
  }, []);

  // const handleArticleClick = async (articleId) => {
  //   const articleData = await renderArticleContent(articleId);
  //   setSelectedPosting(articleData);
  // };

  // ////////모달///////////

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  return (
    <>
      <CommonTable headersName={["", "번호", "제목", "작성글", "작성일"]}>
        {PostingW.map((item, index) => (
          <CommonTableRow key={index}>
            <td>
              <input type="checkbox" />
            </td>
            <td>{index + 1}</td>
            <td
              onClick={() => {        
                // handleArticleClick(item.id);
                setSelectedPosting(item);
                console.log(item)        
                setModalOpen(true);
              }}
            >
              {item.title}
            </td>
            <td>{item.category}</td>
            <td>{item.uploadTime}</td>
          </CommonTableRow>
        ))}
      </CommonTable>

      {modalOpen && <Overlay modalOpen={modalOpen} />}
      {modalOpen && (
        <WritingModal
          setModalOpen={setModalOpen}
          postingData={selectedPosting}
          // articleId={selectedPosting.id}

        />
      )}
    </>
  );
};
export default WritingList;
