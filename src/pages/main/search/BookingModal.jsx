// BookingModal.jsx
import React from "react";
import "../../../css/Booking.css";

function BookingModal({ onClose, bookingData }) {
  const { checkIn, checkOut, adults, children, roomType, price } = bookingData;

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-box bg-white p-4 position-relative rounded">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">{roomType}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div>
            ราคา: {price} บาท (1 คืน)
            <br />
            วันที่เช็คอิน: {checkIn}
            <br />
            วันที่เช็คเอาท์: {checkOut}
          </div>
          <div>
            ผู้ใหญ่:&nbsp;
            <span>{adults}</span> &nbsp;
            เด็ก:&nbsp;
            <span>{children}</span>
          </div>
        </div>

        <hr />
        <div className="text-end fw-bold mb-3">ราคารวม: {price} บาท</div>

        <div className="mb-4">
          ราคานี้รวม:
          <ul>
            <li>อาหารเช้า 2 ท่าน</li>
            <li>ฟรี Wi-Fi</li>
            <li>ที่จอดรถ</li>
          </ul>
        </div>

        <div className="position-absolute end-0 bottom-0 p-3">
          <button
            className="px-4"
            style={{
              backgroundColor: "#5B9B2B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: 600,
              height: "41px",
            }}
            onClick={onClose}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
