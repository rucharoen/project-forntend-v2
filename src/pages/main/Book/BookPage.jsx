// BookPage.jsx (ปรับโค้ดให้ดูดีขึ้นและเข้าใจง่าย)
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Card, Row, Col } from "react-bootstrap";
import FormatToBE from "../../../utils/FormatToBE";
import AccommodationService from "../../../services/api/accommodation/accommodation.service";
import logo from "../../../upimg/3.png";
import promptpay from "../../../upimg/4.png";
import bank from "../../../upimg/2.png";
import "../../../css/BookPage.css";

const BookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const name = state.name || "ไม่ระบุชื่อห้อง";
  const image = state.image || "https://picsum.photos/id/57/400/300";
  const price = parseInt(state.price || "0", 10);
  const checkIn = state.checkIn || "";
  const checkOut = state.checkOut || "";

  const [isCredit, setIsCredit] = useState(false);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [creditError, setCreditError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const createBooking = () => {
    if (!agreed) return;
    setStep(2);
    if (!isCredit) {
      setTimeout(() => navigate("/receipt"), 4000);
    }
  };

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalPrice = price * calculateNights();

  const handleCreditSubmit = () => {
    if (
      !cardNumber.match(/^\d{16}$/) ||
      !cardName.trim() ||
      !expiry.match(/^\d{2}\/\d{2}$/) ||
      !cvv.match(/^\d{3}$/)
    ) {
      setCreditError("กรุณากรอกข้อมูลบัตรให้ครบถ้วนและถูกต้อง");
      return;
    }
    setCreditError("");
    navigate("/receipt");
  };

  const updateCount = (setter) => (delta) => () =>
    setter((prev) => Math.max(0, prev + delta));

  const handleChange = (setter) => (e) => {
    const value = parseInt(e.target.value, 10);
    setter(isNaN(value) ? 0 : Math.max(0, value));
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center align-items-center mt-1">
      <span className="fw-bold me-2">ขั้นตอนที่:</span>
      {[1, 2].map((num) => (
        <div
          key={num}
          onClick={() => num === 1 && setStep(1)}
          className={`step-box ${step === num ? "active" : ""}`}
        >
          {num}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f8f8" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {renderStepIndicator()}
      </div>
      <div className="container pb-5">
        {step === 1 && (
          <div className="row g-4 align-items-stretch">
            {/* ซ้าย: วิธีการชำระเงิน */}
            <div className="col-md-5 d-flex">
              <Card className="flex-fill" style={{ backgroundColor: "white" }}>
                <Card.Body className="d-flex flex-column">
                  <Card.Img variant="top" src={image} />
                  <Card.Title style={{ fontWeight: 600, fontSize: 32 }}>
                    เลือกวิธีการชำระเงิน
                  </Card.Title>

                  {/* พร้อมเพย์ */}
                  <div
                    onClick={() => setIsCredit(false)}
                    style={{
                      border: !isCredit
                        ? "2px solid #0d6efd"
                        : "1px solid rgba(65, 65, 65, 1)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      marginBottom: "12px",
                      cursor: "pointer",
                      backgroundColor: !isCredit ? "#e7f1ff" : "#f8f9fa",
                      minHeight: "50px",
                    }}
                    className="d-flex align-items-center gap-3"
                  >
                    <Form.Check
                      type="radio"
                      name="payment"
                      id="qrpay"
                      checked={!isCredit}
                      onChange={() => setIsCredit(false)}
                      className="m-0"
                    />
                    <img
                      src={promptpay}
                      alt="PromptPay"
                      style={{ width: 58, height: 33 }}
                    />
                    <span className="fw-bold">พร้อมเพย์</span>
                  </div>

                  {/* บัตรเครดิต */}
                  <div
                    onClick={() => setIsCredit(true)}
                    style={{
                      border: isCredit
                        ? "2px solid #0d6efd"
                        : "1px solid rgba(65, 65, 65, 1)",
                      borderRadius: "8px",
                      padding: "4px 12px",
                      cursor: "pointer",
                      backgroundColor: isCredit ? "#e7f1ff" : "#f8f9fa",
                      minHeight: "50px",
                    }}
                    className="d-flex align-items-center gap-3"
                  >
                    <Form.Check
                      type="radio"
                      name="payment"
                      id="credit"
                      checked={isCredit}
                      onChange={() => setIsCredit(true)}
                      className="m-0"
                    />
                    <img
                      src={bank}
                      alt="Credit Card"
                      style={{ width: 45, height: 45 }}
                    />
                    <span className="fw-bold">บัตรเครดิต</span>
                  </div>

                  <Form.Group
                    className="mt-3"
                    style={{
                      border: "1px solid rgba(131, 131, 131, 1)",
                      borderRadius: "6px",
                      padding: "10px",
                    }}
                  >
                    <Form.Label
                      className="mb-1"
                      style={{ fontWeight: 400, fontSize: 22, marginLeft: 15 }}
                    >
                      คำขอพิเศษ
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="เช่น ประเภทเตียง หรือ สถานที่รับส่ง"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        boxShadow: "none",
                        resize: "none",
                        color: "rgba(171, 171, 171, 0.54)",
                      }}
                    />
                  </Form.Group>

                  <small className="text-danger mt-2">
                    * ไม่รับประกันคำขอพิเศษ แต่คำขอของท่านจะได้รับการดูแล
                    อย่างดีที่สุดตามที่เป็นไปได้
                  </small>
                </Card.Body>
              </Card>
            </div>

            {/* ขวา: สรุปรายการจอง */}
            <div className="col-md-7 d-flex">
              <Card className="flex-fill">
                <Card.Body className="d-flex flex-column">
                  <h5>สรุปรายการจอง</h5>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <img src={logo} alt="" height={50} width={75} />
                    <div>
                      <div>บาราลี บีช รีสอร์ท แอนด์ สปา</div>
                      <div>จังหวัดตราด ประเทศไทย</div>
                    </div>
                  </div>
                  ⭐ ⭐ ⭐ ⭐
                  <div className="mb-2">
                    <b>{calculateNights()} คืน:</b> {FormatToBE(checkIn)} -{" "}
                    {FormatToBE(checkOut)}
                  </div>
                  <div>
                    <div>
                      ชื่อผู้เข้าพัก: {user?.name} {user?.lastname}
                    </div>
                    <div>อีเมล: {user?.email}</div>
                    <div>ห้อง: {name}</div>
                    <div>ราคา: {price.toLocaleString()} บาท/คืน</div>
                    <div>ผู้ใหญ่</div>
                    <button
                      type="button" // ✅ ป้องกัน default submit
                      onClick={() => setShowModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f60",
                        textDecoration: "underline",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      ดูรายละเอียด/แก้ไข
                    </button>
                  </div>
                  <hr />
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: "rgba(244, 211, 186, 0.3)",
                      padding: "0.5rem",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <b style={{ fontSize: "24px" }}>ยอดรวมสุทธิ</b>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <b style={{ fontSize: "34px" }}>
                        {totalPrice.toLocaleString()} บาท
                      </b>
                      <small className="text-muted">
                        รวมภาษีและค่าธรรมเนียม
                      </small>
                    </div>
                  </div>
                  <Form.Check
                    type="checkbox"
                    id="agree"
                    label={
                      <>
                        ฉันได้อ่านและยอมรับ{" "}
                        <a href="#!" style={{ color: "#f60" }}>
                          ข้อตกลงและเงื่อนไข
                        </a>
                      </>
                    }
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-2"
                  />
                  {/* ปุ่มด้านล่าง (ไม่ต้องอยู่ล่างสุด) */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      style={{
                        backgroundColor: "rgba(189, 185, 185, 1)",
                        borderColor: "rgba(189, 185, 185, 1)",
                        color: "black",
                        height: "44px",
                      }}
                      onClick={() => navigate(-1)}
                    >
                      ยกเลิก
                    </Button>

                    <Button
                      style={{
                        backgroundColor: "rgba(118, 195, 60, 0.88)",
                        borderColor: "rgba(118, 195, 60, 1)",
                        width: "253px",
                        height: "77px",
                        fontSize: "32px",
                        fontWeight: 600,
                      }}
                      disabled={!agreed}
                      onClick={createBooking}
                    >
                      ทำการจอง →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
        {/* (เนื้อหา Step 1 & 2 ยังคงเหมือนเดิม ยกเว้น GuestSelector ย้ายขึ้นมาทำงานรวมที่นี่) */}

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          dialogClassName="custom-modal-width"
        >
          <Modal.Header closeButton>
            <Modal.Title>{name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                ราคา: <b>{price.toLocaleString()}</b>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-end flex-wrap gap-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0">จำนวนคืน:</Form.Label>
                  <Form.Control
                    type="number"
                    value={calculateNights()}
                    disabled
                    size="sm"
                    style={{ width: "50px", textAlign: "center" }}
                  />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0">ผู้ใหญ่:</Form.Label>
                  {/* <Button onClick={updateCount(setAdults)(-1)}>-</Button> */}
                  <Form.Control
                    size="sm"
                    type="number"
                    value={adults}
                    onChange={handleChange(setAdults)}
                    style={{ width: "50px", textAlign: "center" }}
                  />
                  {/* <Button onClick={updateCount(setAdults)(+1)}>+</Button> */}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0">เด็ก:</Form.Label>
                  {/* <Button onClick={updateCount(setChildren)(-1)}>-</Button> */}
                  <Form.Control
                    size="sm"
                    type="number"
                    value={children}
                    onChange={handleChange(setChildren)}
                    style={{ width: "50px", textAlign: "center" }}
                  />
                  {/* <Button onClick={updateCount(setChildren)(+1)}>+</Button> */}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>รายละเอียด</Col>
              <Col className="text-end">ยอดรวม (THB)</Col>
            </Row>
            <div
              style={{
                borderTop: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
              }}
            >
              <Row>
                <Col>{checkIn}</Col>
                <Col className="text-end">{price.toLocaleString()}</Col>
              </Row>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <b>ราคารวม</b>
              <b>{totalPrice.toLocaleString()} บาท</b>
            </div>

            <div className="mt-3">
              <b>ราคาด้านบนนี้รวม:</b>
              <ul className="mb-0">
                <li>อาหารเช้า 2 ท่าน</li>
                <li>ฟรี Wi-Fi</li>
                <li>ที่จอดรถ</li>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                createBooking();
                setShowModal(false);
              }}
            >
              ยืนยัน
            </Button>
          </Modal.Footer>
        </Modal>

        {step === 2 && (
          <div className="text-center mt-5">
            {isCredit ? (
              <div>
                <h4>กรอกข้อมูลบัตรเครดิต</h4>
                <p>ระบบของคุณรองรับการชำระผ่านบัตรเครดิต</p>
                <Form
                  className="mx-auto"
                  style={{ maxWidth: 400, textAlign: "left" }}
                >
                  {/* ...ฟอร์มบัตรเครดิตเดิม... */}
                  {creditError && <p className="text-danger">{creditError}</p>}
                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    onClick={handleCreditSubmit}
                  >
                    ยืนยันการชำระเงิน
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => setStep(1)}
                  >
                    ← ย้อนกลับ
                  </Button>
                </Form>
              </div>
            ) : (
              <div>
                <h4>ชำระผ่านพร้อมเพย์</h4>
                <p>กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน</p>
                <img
                  src={`https://promptpay.io/0891234567/${totalPrice}.png`}
                  alt="QR พร้อมเพย์"
                  style={{ width: 200, height: 200 }}
                />
                <div className="mt-3">
                  ยอดชำระ: <b>{totalPrice.toLocaleString()} บาท</b>
                </div>
                <p className="text-muted mt-3">
                  ระบบจะนำคุณไปยังหน้าถัดไปภายใน 4 วินาที...
                </p>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => setStep(1)}
                >
                  ← ย้อนกลับ
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
