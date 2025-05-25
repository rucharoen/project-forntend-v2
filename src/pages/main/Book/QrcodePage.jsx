import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';

const QrcodePage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First delay before showing modal
    const showModalTimer = setTimeout(() => {
      setShowModal(true);

      // Then delay 4 seconds before navigating
      const redirectTimer = setTimeout(() => {
        setShowModal(false);
        navigate('/receipt');
      }, 4000);

      // Cleanup inner timer
      return () => clearTimeout(redirectTimer);

    }, 2000); // Delay before showing modal (e.g., 2 seconds)

    // Cleanup outer timer
    return () => clearTimeout(showModalTimer);
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      {/* QR Code Image */}
      <Image
        style={{ width: 300 }}
        src="https://th.bing.com/th/id/R.dcf4b6e228aef80dd1a58f4c76f07128?rik=Qj2LybacmBALtA&riu=http%3a%2f%2fpngimg.com%2fuploads%2fqr_code%2fqr_code_PNG25.png&ehk=eKH2pdoegouCUxO1rt6BJXt4avVYywmyOS8biIPp5zc%3d&risl=&pid=ImgRaw&r=0"
        alt="QR Code"
        fluid
      />

      {/* Modal */}
      <Modal show={showModal} centered>
        <Modal.Header>
          <Modal.Title>Booking Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Scan the QR code if needed. You will be redirected to the receipt page shortly...
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QrcodePage;
