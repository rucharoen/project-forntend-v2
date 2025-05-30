import React, { useState } from "react";
import "../../../css/Booking.css"; // แยก style ออกไว้ต่างหาก

const BookingPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [specialRequest, setSpecialRequest] = useState("");

  const handleBooking = () => {
    if (!agreeTerms) return;
    // ทำ logic ต่อ เช่น: ส่งข้อมูลไป backend
    console.log("จองสำเร็จ!");
  };

  return (
    <div className="booking-step">
      <div className="step-header-bar">
      <div>ขั้นตอน:</div>
        <div className="step-item active">
          <div className="step-number">1</div>          
        </div>
        <div className="step-item">
          <div className="step-number">2</div>
        </div>
      </div>

      <div className="booking-container">
        {/* ซ้าย */}
        <div className="booking-left">
          <div className="room-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lLjtKxLKjJ3YNRphNTpVRQUcsOB-hNwwCg&s"
              alt="Room"
            />
            
          </div>

          <h3>เลือกวิธีการชำระเงิน</h3>
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="payment"
                value="promptpay"
                checked={paymentMethod === "promptpay"}
                onChange={() => setPaymentMethod("promptpay")}
              />
              <span className="method-option">พร้อมเพย์</span>
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="creditcard"
                checked={paymentMethod === "creditcard"}
                onChange={() => setPaymentMethod("creditcard")}
              />
              <span className="method-option">บัตรเครดิต</span>
            </label>
          </div>

          <div className="special-request">
            <label>คำขอพิเศษ</label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="เช่น ประเภทเตียง หรือ สถานที่รับส่ง"
            />
            <p className="note">
              * ไม่รับประกันคำขอพิเศษ
              แต่ทีมของท่านจะได้รับการดูแลอย่างดีที่สุดตามที่เป็นไปได้
            </p>
          </div>
        </div>

        {/* ขวา */}
        <div className="booking-right">
          <h3>สรุปรายการจอง</h3>
          <div className="hotel-name">บาราลี บีช รีสอร์ท แอนด์ สปา</div>
          <div className="hotel-location">จังหวัดตราด ประเทศไทย</div>
          <div className="review-stars">★★★★★</div>

          <ul className="booking-details">
            <li>1 คืน: 13 มิ.ย. 2025 - 14 มิ.ย. 2025</li>
            <li>ชื่อผู้เข้าพัก: นายหงษ์หาย</li>
            <li>อีเมล: thanongthoeyu@gmail.com</li>
            <li>ห้อง: บีชฟรอนต์ วิลล่า</li>
            <li>ราคา: ซัมเมอร์ดีล ลด 58%</li>
            <li>
              ผู้ใหญ่: 2 <a href="#">ดูรายละเอียด / แก้ไข</a>
            </li>
          </ul>

          <div className="total-summary">
            <span>ยอดรวมสุทธิ</span>
            <span className="price">7,140 บาท</span>
            <div className="note">รวมภาษีและค่าธรรมเนียม</div>
          </div>

          <div className="terms-agree">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              ฉันได้อ่านและยอมรับ <a href="#">ข้อตกลงและเงื่อนไข</a>
            </label>
          </div>

          <div className="action-buttons">
            <button className="cancel">ยกเลิก</button>
            <button
              className="confirm"
              onClick={handleBooking}
              disabled={!agreeTerms}
            >
              ทำการจอง →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
