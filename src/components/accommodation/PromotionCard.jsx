import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../css/PromotionCard.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PromotionCard = ({ accommodation }) => {
  const [showModal, setShowModal] = useState(false);

  const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;

  // ✅ fallback กรณีไม่มี amenities หรือ เป็น string แปลงเป็น array
  const amenities =
    Array.isArray(accommodation.amenities) && accommodation.amenities.length > 0
      ? accommodation.amenities
      : typeof accommodation.amenities === "string"
      ? accommodation.amenities.split(",").map((a) => a.trim())
      : [
          "เตียงคิงไซส์",
          "ทีวี LED",
          "เครื่องปรับอากาศ",
          "ฝักบัว",
          "น้ำดื่มฟรี",
          "รองเท้าแตะ",
          "ผ้าเช็ดตัว",
          "ไดร์เป่าผม",
          "ตู้เย็น",
          "เสื้อคลุมอาบน้ำ",
          "ร่ม",
          "สบู่ แชมพู",
        ];

  return (
    <div className="px-2 py-3" style={{ paddingRight: "5px" }}>
      <div
        className="rounded shadow-sm d-flex flex-column"
        style={{
          width: "411px",
          height: "431px",
          border: "1px solid rgba(145, 145, 145, 1)",
        }}
      >
        <img
          src={fullImageUrl}
          alt={accommodation.name}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          style={{
            width: "100%",
            height: "328px",
            objectFit: "cover",
            borderRadius: "6px 6px 0 0",
            marginBottom: "12px",
          }}
        />

        <div className="d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h5
              className="mb-1"
              style={{
                fontSize: "30px",
                fontWeight: "400",
                paddingLeft: "12px",
              }}
            >
              {accommodation.name}
            </h5>
            <p
              className="mb-0"
              style={{ fontSize: "16px", paddingLeft: "12px" }}
            >
              ขนาดห้อง {accommodation.capacity} ตารางเมตร
            </p>
          </div>

          <Button
            variant="light"
            className="mt-1 align-self-center"
            style={{
              border: "1px solid rgba(145, 145, 145, 1)",
              color: "#000",
              background: "rgba(226, 226, 226, 1)",
              fontSize: "20px",
              padding: "4px 12px",
              height: "fit-content",
              whiteSpace: "nowrap",
              marginRight: "20px",
            }}
            onClick={() => setShowModal(true)}
          >
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="modal-room"
      >
        <Modal.Body
          className="room-modal p-5 position-relative rounded-3"
          style={{ borderRadius: "6px" }}
        >
          <button
            type="button"
            className="position-absolute top-0 end-0 m-4"
            aria-label="Close"
            onClick={() => setShowModal(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              width: "32px",
              height: "32px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="black"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="container-fluid mt-4">
            <div className="container-fluid position-relative">
              {/* ปุ่มเลื่อนรูปภาพ - ยังไม่ได้ทำฟังก์ชัน */}
              <button
                className="btn position-absolute start-0 top-50 translate-middle-y"
                style={{
                  zIndex: 999,
                  left: "-30px",
                  backgroundColor: "rgba(70, 212, 255, 1)",
                  borderRadius: "50%",
                  padding: "8px 14px",
                  fontSize: "24px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.4)",
                }}
              >
                ‹
              </button>

              <button
                className="btn position-absolute end-0 top-50 translate-middle-y"
                style={{
                  zIndex: 999,
                  right: "-30px",
                  backgroundColor: "rgba(70, 212, 255, 1)",
                  borderRadius: "50%",
                  padding: "8px 14px",
                  fontSize: "24px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.4)",
                }}
              >
                ›
              </button>

              <div
                className="mb-4 position-relative"
                style={{ borderRadius: "6px", overflow: "hidden" }}
              >
                <img
                  src={fullImageUrl}
                  alt={accommodation.name}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                  className="img-fluid w-100"
                  style={{
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "32px", fontWeight: "bold" }}>
                {accommodation.name}
              </h4>

              <div
                className="mb-3  d-flex gap-4"
                style={{ fontSize: "18px", color: "black" }}
              >
                <div>📏 ขนาด: {accommodation.capacity} ตร.ม</div>
                <div>👤 ผู้ใหญ่ 2 ท่าน เด็กไม่เกิน 12 ปี 1 ท่าน</div>
                <div>🛏 เตียงเสริม: ได้ 1 เตียง</div>
              </div>

              <p className="" style={{ fontSize: "18px" }}>
                {accommodation.description}
              </p>

              <h5
                className="fw-semibold mt-4 mb-3"
                style={{ fontSize: "22px" }}
              >
                สิ่งอำนวยความสะดวกภายในวิลล่า
              </h5>

              <div
                className="room-amenities"
                style={{
                  backgroundColor: "rgba(217, 217, 217, 0.23)",
                  padding: "20px",
                  borderRadius: "10px",
                  margin: "0",
                }}
              >
                <ul
                  className="amenities-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 คอลัมน์เท่ากัน
                    gap: "12px 20px", // ช่องว่างระหว่างรายการ
                  }}
                >
                  {amenities.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                      }}
                    >
                      <span
                        style={{ marginRight: "8px", color: "green" }}
                      ></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PromotionCard;
