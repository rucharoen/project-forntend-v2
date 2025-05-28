import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

const QrcodePage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const paymentMethod = location.state?.payment;

  useEffect(() => {
    // ตั้ง timer ให้แสดง modal หลัง 2 วินาที
    const showModalTimer = setTimeout(() => {
      setShowModal(true);

      // ตั้ง timer ให้เปลี่ยนหน้าไป receipt หลัง 4 วินาที
      const redirectTimer = setTimeout(() => {
        setShowModal(false);
        navigate("/receipt", { state: { paymentMethod } });
      }, 4000);

      

    }, 2000);

    let redirectTimer;

    // ล้าง timer ทั้งสองอันเมื่อ component unmount หรือ dependency เปลี่ยน
    return () => {
      clearTimeout(showModalTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, paymentMethod]);

  return (
    <div className="container text-center mt-5">
      <h3>สแกน QR เพื่อชำระเงิน</h3>
      <Image
        style={{ width: 300 }}
        src="https://th.bing.com/th/id/R.dcf4b6e228aef80dd1a58f4c76f07128?rik=Qj2LybacmBALtA&riu=http%3a%2f%2fpngimg.com%2fuploads%2fqr_code%2fqr_code_PNG25.png&ehk=eKH2pdoegouCUxO1rt6BJXt4avVYywmyOS8biIPp5zc%3d&risl=&pid=ImgRaw&r=0"
        alt="QR Code"
        fluid
        className="my-4"
      />

      <Modal show={showModal} centered>
        <Modal.Header>
          <Modal.Title>การจองเสร็จสมบูรณ์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ระบบจะนำคุณไปยังหน้าหลักฐานการจอง (Receipt) ภายในไม่กี่วินาที...
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QrcodePage;
