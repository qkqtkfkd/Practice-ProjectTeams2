import React from "react";
import CommonTable from "../../table/CommonTable";
import CommonTableColumn from "../../table/CommonTableColumn";
import CommonTableRow from "../../table/CommonTableRow";

const InquiryList = (props) => {
  return (
    <>
      <CommonTable
        headersName={[
          "",
          "번호",
          "문의유형",
          "문의제목",
          "날짜"
        ]}
      >
        <CommonTableRow>
          <td>
            <input type="checkbox" />
          </td>
          <td>1</td>
          <td>제휴 및 제안문의</td>
          <td>안녕하세요. 저희는 댕댕업체입니다...</td>
          <td>2014-01-16</td>
        </CommonTableRow>
 
        <CommonTableRow>
          <td>
            <input type="checkbox" />
          </td>
          <td>2</td>
          <td>기타</td>
          <td>병원진료 예약을 했는데 업체에서...</td>
          <td>2014-01-16</td>
        </CommonTableRow>

      </CommonTable>
    </>
  );
};
export default InquiryList;
