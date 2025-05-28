import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import upimg2 from "../../../upimg/2.png";
import upimg3 from "../../../upimg/3.png";
import upimg4 from "../../../upimg/4.png";
import "../../../css/Booking.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import FormatToBE from "../../../utils/FormatToBE";

function BookingModal({ onClose, bookingData }) {
  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-box bg-white p-4 position-relative rounded">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">{bookingData.roomType}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div>ราคา: {bookingData.price} บาท (1 คืน)</div>
          <div>
            ผู้ใหญ่:&nbsp;
            <select
              defaultValue={bookingData.adults}
              className="form-select d-inline-block w-auto me-2"
            >
              {[1, 2, 3].map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            เด็ก:&nbsp;
            <select
              defaultValue={bookingData.children}
              className="form-select d-inline-block w-auto"
            >
              {[0, 1, 2].map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <hr />

        <table className="table table-sm mb-3">
          <tbody>
            <tr className="fw-semibold">
              <td>รายละเอียด</td>
              <td className="text-end">ยอดรวม (THB)</td>
            </tr>
            <tr>
              <td>{bookingData.checkIn}</td>
              <td className="text-end">{bookingData.price}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-end fw-bold mb-3">
          ราคารวม: {bookingData.price} บาท
        </div>

        <div className="mb-4">
          ราคาด้านบนนี้รวม:
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

function BookPage({ isUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("promptpay");
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);

  const checkInDate =
    searchParams.get("checkIn") || dayjs().add(1, "day").format("YYYY-MM-DD");
  const checkOutDate =
    searchParams.get("checkOut") || dayjs().add(2, "day").format("YYYY-MM-DD");
  const guests = searchParams.get("guests") || 1;
  const destination = searchParams.get("destination") || "";

  const handleBookingClick = (e) => {
    e.preventDefault();
    if (!agree) {
      alert("โปรดยอมรับข้อตกลงและเงื่อนไขก่อนทำการจอง");
      return;
    }
    const route = selectedPayment === "promptpay" ? "/qr-code" : "/credit-card";
    navigate(route, { state: { payment: selectedPayment } });
  };

  return (
    <Container className="my-4 bg-light">
      <div className="text-center mb-3">
        ขั้นตอน: <strong>1</strong> 2
      </div>
      <div className="row g-4">
        {/* Left Section */}
        <div className="col-md-6">
          <div className="card p-3">
            <img
              src=""
              className="img-fluid mb-3"
              alt="รูปห้อง"
            />
            <h5 className="fw-bold">เลือกวิธีการชำระเงิน</h5>

            <div className="d-flex flex-column gap-2">
              {[
                {
                  value: "promptpay",
                  label: "พร้อมเพย์",
                  icon: upimg4,
                  size: [58, 33],
                },
                {
                  value: "credit",
                  label: "บัตรเครดิต",
                  icon: upimg2,
                  size: [45, 45],
                },
              ].map(({ value, label, icon, size }) => (
                <label
                  key={value}
                  className={`payment-option ${
                    selectedPayment === value ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === value}
                    onChange={() => setSelectedPayment(value)}
                  />
                  <img
                    src={icon}
                    alt={label}
                    width={size[0]}
                    height={size[1]}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3">
              <label className="form-label fw-bold">คำขอพิเศษ</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="เช่น ประเภทเตียง หรือ สถานที่รับส่ง"
              />
              <div className="form-text text-danger">
                * ไม่รับประกันคำขอพิเศษ
                แต่คำขอของท่านจะได้รับการดูแลอย่างดีที่สุดตามที่เป็นไปได้
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="fw-bold">สรุปรายการจอง</h5>
            <div className="d-flex align-items-center mb-2">
              <img src={upimg3} height="30" className="me-2" alt="รีสอร์ท" />
              <div>
                <strong>บาราลี บีช รีสอร์ท แอนด์ สปา</strong>
                <br />
                จังหวัดตราด ประเทศไทย
                <br />
                <span className="text-warning">★★★★★</span>
              </div>
            </div>

            

            <div className="small mt-3">
              <div>
                เช็คอิน: <strong>{FormatToBE(checkInDate)}</strong>
              </div>
              <div>
                เช็คเอาท์: <strong>{FormatToBE(checkOutDate)}</strong>
              </div>
              {/* <div>
                จำนวนผู้เข้าพัก: <strong>{guests}</strong>
              </div> */}

              {isUser?.name && (
                <div className="mt-2 text-dark">
                  ผู้ใช้: <strong>{isUser.name}</strong>
                </div>
              )}             
              <br />
              อีเมล: Thanongthoeyu@gmail.com
              <br />
              
              ราคา: ซัมเมอร์ดีล ลด 58%
              <br />
              ผู้ใหญ่: <strong>2</strong>
              <br />
              <a
                href="#"
                className="text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                ดูรายละเอียด / แก้ไข
              </a>
            </div>

            {showModal && (
              <BookingModal
                onClose={() => setShowModal(false)}
                bookingData={{
                  checkIn: "13 มิ.ย. 2025",
                  checkOut: "14 มิ.ย. 2025",
                  adults: 2,
                  children: 0,
                  roomType: "บีชฟรอนต์ วิลล่า",
                  price: "7,140",
                }}
              />
            )}

            <div className="form-check mt-3 mb-3">
              <input
                type="checkbox"
                id="agree"
                className="form-check-input"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="agree">
                ฉันได้อ่านและยอมรับ <a href="#">ข้อตกลงและเงื่อนไข</a>
              </label>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-light">ยกเลิก</button>
              <button
                className="btn"
                disabled={!agree}
                onClick={handleBookingClick}
                style={{
                  backgroundColor: "#5B9B2B",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: 600,
                  height: "41px",
                  padding: "0 24px",
                  cursor: agree ? "pointer" : "not-allowed",
                  opacity: agree ? 1 : 0.6,
                }}
              >
                ทำการจอง →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default BookPage;
