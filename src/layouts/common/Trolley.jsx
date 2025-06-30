import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Trolley = ({ showCart, setShowCart, selectedAccommodation, setSelectedAccommodation }) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemoveItem = (indexToRemove) => {
    const updatedAccommodation = selectedAccommodation.filter((_, idx) => idx !== indexToRemove);
    setSelectedAccommodation(updatedAccommodation);

    setSelectedItems((prev) =>
      prev
        .filter((idx) => idx !== indexToRemove)
        .map((idx) => (idx > indexToRemove ? idx - 1 : idx)) // อัปเดต index หลังลบ
    );
  };

  const totalSelectedPrice = selectedItems.reduce(
    (sum, idx) => sum + (selectedAccommodation[idx]?.discountedPrice || 0),
    0
  );

  return (
    <Modal show={showCart} onHide={() => setShowCart(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>รถเข็น ({selectedAccommodation.length})</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
        {selectedAccommodation.map((state, index) => (
          <div key={index} className="card mb-3 p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-4 position-relative">
                <input
                  type="checkbox"
                  className="form-check-input position-absolute"
                  style={{ top: "10px", left: "10px", transform: "scale(1.5)" }}
                  checked={selectedItems.includes(index)}
                  onChange={() => toggleSelect(index)}
                />
                <img
                  src={state.image || "https://picsum.photos/id/57/800/600"}
                  alt="ห้องพัก"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "12px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-start flex-column flex-md-row">
                  <div>
                    <h5 className="fw-bold">{state.name || `ห้องพัก ${index + 1}`}</h5>
                    <ul className="list-unstyled mb-2 text-muted small">
                      <li>🛏️ รวมอาหารเช้าระดับยอดเยี่ยม</li>
                      <li>📶 ฟรีอินเทอร์เน็ตไร้สาย (Wi-Fi)</li>
                      <li>➕ ส่วนลด 10% เฉพาะค่าอาหารที่ห้องอาหารโรงแรม</li>
                    </ul>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      🗑 ลบ
                    </button>
                  </div>
                  <div className="text-end mt-3 mt-md-0">
                    <div className="text-danger fw-bold mb-1">
                      ประหยัด {state.discountPercentage || 50}%
                    </div>
                    <div className="text-warning mb-1">
                      ⭐⭐⭐⭐⭐ ({state.reviews || 95})
                    </div>
                    <div className="text-decoration-line-through text-muted small">
                      {state.originalPrice?.toLocaleString() || "34,000"} บาท
                    </div>
                    <div className="fs-4 fw-bold text-success">
                      ฿ {state.discountedPrice?.toLocaleString() || "14,280"}
                    </div>
                    <div className="text-muted small">รวมภาษีและค่าธรรมเนียม</div>
                    <div className="input-group input-group-sm mt-2 w-auto mx-auto">
                      <button className="btn btn-outline-secondary">-</button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={state.quantity || 1}
                        readOnly
                        style={{ width: "40px" }}
                      />
                      <button className="btn btn-outline-secondary">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold fs-5">ทั้งหมด (เลือก {selectedItems.length} รายการ)</div>
            <div className="d-flex align-items-center gap-3">
              <div className="fs-5 fw-bold text-success">
                ฿ {totalSelectedPrice.toLocaleString()}
              </div>
              <button
                className="btn btn-success btn-sm"
                disabled={selectedItems.length === 0}
                onClick={() => {
                  setShowCart(false);
                  const selectedRoom = selectedAccommodation[selectedItems[0]];
                  navigate("/booking", {
                    state: {
                      name: selectedRoom.name,
                      image: selectedRoom.image,
                      price: selectedRoom.discountedPrice,
                      checkIn: selectedRoom.checkIn,
                      checkOut: selectedRoom.checkOut,
                    },
                  });
                }}
              >
                ชำระเงิน ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Trolley;
