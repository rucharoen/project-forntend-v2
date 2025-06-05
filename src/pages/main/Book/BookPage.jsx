import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import FormatToBE from '../../../utils/FormatToBE';
import AccommodationService from "../../../services/api/accommodation/accommodation.service";

const BookPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isCredit, setIsCredit] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [step, setStep] = React.useState(1);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const createBooking = async () => {
    try {
      await AccommodationService.createBooking(checkIn, checkOut);
      setStep(2);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // ฟังก์ชันช่วย render ขั้นตอน
  const renderStepIndicator = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        {[1, 2].map((num) => (
          <div
            key={num}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              lineHeight: '40px',
              textAlign: 'center',
              margin: '0 10px',
              backgroundColor: step === num ? '#0d6efd' : '#ccc',
              color: step === num ? 'white' : '#666',
              fontWeight: 'bold',
              userSelect: 'none',
              boxShadow: step === num ? '0 0 8px rgba(13,110,253,0.7)' : 'none',
            }}
          >
            {num}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      {user && (
        <div className="mb-3">
          👋 สวัสดีคุณ <strong>{user.name} {user.lastname}</strong>
        </div>
      )}

      {/* แสดง Step Indicator */}
      {renderStepIndicator()}

      {step === 1 && (
        <>
          <div className="mb-2" style={{ color: '#888', fontSize: '1em' }}>
            <span className="me-3">เช็คอิน: <b>{FormatToBE(checkIn) || 'ไม่ระบุ'}</b></span>
            <span className="me-3">เช็คเอาท์: <b>{FormatToBE(checkOut) || 'ไม่ระบุ'}</b></span>
          </div>

          <Button variant="primary" onClick={createBooking}>
            Booking Now
          </Button>
        </>
      )}

      {step === 2 && (
  <>
    <h4>ขั้นตอนที่ 2: เลือกวิธีชำระเงิน</h4>

    <div className="mb-3 d-flex gap-3">
      <Button
        variant={isCredit ? 'outline-secondary' : 'primary'}
        onClick={() => setIsCredit(false)}
        style={{ flex: 1 }}
      >
        ชำระผ่าน QR Code
      </Button>

      <Button
        variant={isCredit ? 'primary' : 'outline-secondary'}
        onClick={() => setIsCredit(true)}
        style={{ flex: 1 }}
      >
        ชำระผ่านบัตรเครดิต
      </Button>
    </div>

    <Button
      variant="success"
      onClick={() => navigate(isCredit ? '/credit-card' : '/qr-code')}
    >
      ดำเนินการชำระเงิน
    </Button>
  </>
)}

    </div>
  );
};

export default BookPage;
