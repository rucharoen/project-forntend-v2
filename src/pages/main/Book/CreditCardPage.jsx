import React, { useState } from 'react';
import '../../../css/CreditCardPage.css'; // ถ้ามี CSS เพิ่มเติม

const CreditCardPage = () => {
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ตรวจสอบความถูกต้อง และส่งข้อมูล
    console.log('ส่งข้อมูลบัตร: ', cardInfo);
  };

  return (
    <div className="container py-5">
      <h5 className="text-center mb-4">ขั้นตอน: <span className="badge bg-secondary">1</span> <span className="badge bg-dark">2</span></h5>
      <h4 className="text-center mb-4">กรุณากรอกข้อมูลให้ถูกต้องเพื่อจองห้องพัก</h4>

      <div className="border rounded p-4" style={{ backgroundColor: '#c9f0ff' }}>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <img src="/icons/visa.png" alt="VISA" height="40" />
          <img src="/icons/mastercard.png" alt="MasterCard" height="40" />
          <img src="/icons/jcb.png" alt="JCB" height="40" />
          <img src="/icons/unionpay.png" alt="UnionPay" height="40" />
        </div>
      </div>

      <form className="border rounded mt-3 p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ชื่อบนบัตร</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={cardInfo.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">หมายเลขบัตรเครดิต/บัตรเดบิต</label>
          <input
            type="text"
            className="form-control"
            name="number"
            value={cardInfo.number}
            onChange={handleChange}
            required
            maxLength="16"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">วันหมดอายุ (ดด/ปป)</label>
          <input
            type="text"
            className="form-control"
            name="expiry"
            value={cardInfo.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">รหัส CVV/CVC</label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-2"
              name="cvc"
              value={cardInfo.cvc}
              onChange={handleChange}
              maxLength="4"
              required
            />
            <img src="/icons/cvc.png" alt="CVV" height="30" />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary">ยกเลิก</button>
          <button type="submit" className="btn btn-info text-white">ยืนยัน</button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardPage;
