import PointList from "./PointList";
import styles from "../MyPage.module.css";
import styleA from "./Point.module.css";
import Shop from "./Shop";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";

function Point() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  
  const displayedData = posts.slice(offset, offset + limit);

  return (
    <div className={styles.containerBox}>
      <h1 className={styles.h1} style={{ borderBottom: "2px solid #ff8b50" }}>
        포인트 샵
      </h1>

      {/* ////////////////////////////////////// */}
      <div className={styleA.pointbody}>
        <div>
          <p className={styleA.pointsHeld}>
            보유포인트
            <span className={styleA.score}>
              <span style={{ fontSize: "25px" }}> 3000</span> 냥
            </span>
          </p>
        </div>

        <div>
          <Shop posts={displayedData} />
        </div>
      </div>
      <PointList />
      <p className={styleA.annotation}>
        *기프트콘은 이벤트와 재고량에 따라 수시로 변경될 수 있습니다.
      </p>

      <footer>
        <Pagination
          total={Shop.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </footer>
    </div>
  );
}

export default Point;
