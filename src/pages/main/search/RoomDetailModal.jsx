import React, { useState } from "react";
import { Modal, Image, Row, Col } from "react-bootstrap";

const RoomDetailModal = ({ show, onHide, room }) => {
  const [mainImage, setMainImage] = useState(room?.images?.[0]);

  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{room.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* รูปภาพหลัก */}
        <div className="text-center">
          <Image
            src={mainImage}
            alt="main"
            fluid
            style={{ maxHeight: "400px", objectFit: "cover" }}
            className="rounded"
          />
        </div>

        {/* แกลเลอรีรูปเล็ก */}
        <div className="d-flex justify-content-center mt-3 gap-2 flex-wrap">
          {room.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              thumbnail
              onClick={() => setMainImage(img)}
              style={{
                width: "80px",
                height: "60px",
                cursor: "pointer",
                border: img === mainImage ? "2px solid #5b873a" : "1px solid #ccc",
              }}
            />
          ))}
        </div>

        {/* สิ่งอำนวยความสะดวก */}
        <h5 className="mt-4">สิ่งอำนวยความสะดวก</h5>
        <Row>
          <Col md={6}>
            <ul>
              {room.facilities.slice(0, Math.ceil(room.facilities.length / 2)).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Col>
          <Col md={6}>
            <ul>
              {room.facilities.slice(Math.ceil(room.facilities.length / 2)).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default RoomDetailModal;
