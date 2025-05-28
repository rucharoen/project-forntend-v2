import { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../css/ActivityCard.css";

const ActivityCard = ({ activity }) => {
  const [showModal, setShowModal] = useState(false);

  const imageUrl = activity.image_name
    ? `${import.meta.env.VITE_BASE_URL}/uploads/activities/${activity.image_name}`
    : "/fallback-image.jpg"; // ใช้รูปสำรองถ้าไม่มีภาพ

  const title = activity.name || "กิจกรรม";
  const description = activity.description || "รายละเอียดกิจกรรม";

  const handleCardClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="activity-card-wrapper h-100">
        <button
          className="activity-card border-0 bg-white w-100 overflow-hidden"
          onClick={handleCardClick}
          aria-label={`ดูรายละเอียดกิจกรรม: ${title}`}
        >
          <img
            src={imageUrl}
            alt={title}
            className="activity-image"
            loading="lazy"
          />

          <div className="activity-overlay d-flex flex-column justify-content-center align-items-center text-dark px-3 text-center">
            <h5 className="fw-bold mb-2">{title}</h5>
          </div>
        </button>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Body className="p-0">
          <div className="position-relative bg-white rounded shadow overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="btn btn-close position-absolute top-0 end-0 m-2 z-3 bg-white rounded-circle p-2"
              aria-label="Close"
              style={{
                opacity: 1,
                boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              }}
            />
            <img
              src={imageUrl}
              alt={title}
              className="w-100 img-fluid"
              style={{
                objectFit: "cover",
                maxHeight: "60vh",
                width: "100%",
              }}
            />
            <div className="p-4">
              <h4 className="mb-3 text-center fw-bold" style={{ color: "#333" }}>
                {title}
              </h4>
              <p className="text-center">{description}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActivityCard;
