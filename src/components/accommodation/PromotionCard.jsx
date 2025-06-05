import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../css/PromotionCard.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PromotionCard = ({ accommodation }) => {
  const [showModal, setShowModal] = useState(false);

  const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;

  // ✅ fallback กรณีไม่มี amenities
  const amenities = accommodation.amenities || [
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
        {/* รูปภาพที่พัก */}
        <img
          src={fullImageUrl}
          alt={accommodation.name}
          onError={(e) => (e.target.src = "/placeholder.jpg")} // fallback
          style={{
            width: "100%",
            height: "328px",
            objectFit: "cover",
            borderRadius: "6px 6px 0 0",
            marginBottom: "12px",
          }}
        />

        {/* ชื่อ, ขนาดห้อง และปุ่มอ่านเพิ่มเติม */}
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
              style={{
                fontSize: "16px",
                paddingLeft: "12px",
              }}
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

      {/* Modal แสดงรายละเอียด */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        dialogClassName="modal-room"
      >
        <Modal.Body className="room-modal">
          {/* ปุ่มปิด */}
          <button
            type="button"
            className="room-modal__close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            × {/* หรือใช้ไอคอนแทน */}
          </button>

          <div className="room-modal__container">
            {/* รูปภาพ */}
            <img
              src={fullImageUrl}
              alt={accommodation.name}
              onError={(e) => (e.target.src = "/placeholder.jpg")}
              className="room-modal__image"
            />

            {/* เนื้อหา */}
            <div className="room-modal__content">
              <h4 className="room-modal__title">{accommodation.name}</h4>

              <div className="room-modal__details">
                <div className="room-modal__info">
                  📏 ขนาด: {accommodation.capacity} ตร.ม
                </div>
                <div className="room-modal__info">
                  👤 ผู้ใหญ่ 2 ท่าน เด็กไม่เกิน 12 ปี 1 ท่าน
                </div>
                <div className="room-modal__info">
                  🛏 เตียงเสริม: ได้ 1 เตียง
                </div>
              </div>

              <p className="room-modal__description text-muted">
                {accommodation.description}
              </p>

              <h5 className="room-modal__section-title">
                สิ่งอำนวยความสะดวกภายในวิลล่า
              </h5>
              <div className="row room-modal__amenities">
                {/* amenities.map... */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PromotionCard;
