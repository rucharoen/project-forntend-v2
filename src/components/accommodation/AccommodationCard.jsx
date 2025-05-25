// AccommodationCard.jsx
import { useNavigate, createSearchParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AccommodationCard = ({ accommodation, availabilityRooms }) => {
    const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;

    const navigate = useNavigate();
    // original_price และ discount (%) มีอยู่ใน accommodation
    const originalPrice = accommodation.price_per_night;
    const discountPercent = accommodation.discount;

    // คำนวณราคาหลังหักส่วนลด
    // ตรวจสอบให้แน่ใจว่าเป็นตัวเลขก่อนคำนวณและใช้ toLocaleString()
    const discountedPrice = (originalPrice && typeof originalPrice === 'number' && discountPercent && typeof discountPercent === 'number')
        ? Math.round(originalPrice * (1 - discountPercent / 100))
        : (typeof accommodation.price_per_night === 'number' ? accommodation.price_per_night : 0); // fallback to 0 or handle error

    const handleRedirect = (id) => {
        navigate({
        pathname: '/book',
        search: createSearchParams({ id: id }).toString()
        });
    };
    return (
        <div className="col-lg-6 px-2 py-2">
            <div className="border rounded p-2 shadow-sm h-100">
                <Row>
                    {/* รูปภาพที่พัก */}
                    <Col md={5}>
                        <img src={fullImageUrl} alt={accommodation.name} className="img-fluid rounded" />
                    </Col>

                    {/* ข้อมูลที่พัก */}
                    <Col md={7}>
                        <h5>
                            {accommodation.name}
                            <small className="text-muted"> ({accommodation.type.name})</small>
                        </h5>
                        <p className="mb-1">ห้องว่าง : {availabilityRooms} ห้อง</p>

                        <ul className="list-unstyled mb-2">
                            <li>📐 ขนาดห้อง {accommodation.room_size} ตารางเมตร</li>
                            <li>🌄 วิว : {accommodation.room_view}</li>
                            <li>🛏 {accommodation.bed_type}</li>
                        </ul>

                        {/* ราคาหลังส่วนลด */}
                        <div className="d-flex align-items-baseline mb-2">
                            {originalPrice && discountPercent && (
                                <>
                                    <span className="text-decoration-line-through text-secondary me-2">
                                        {/* ตรวจสอบว่าเป็น number ก่อนเรียก toLocaleString */}
                                        {typeof originalPrice === 'number' ? originalPrice.toLocaleString() : ''}
                                    </span>
                                    <span className="text-danger fw-bold me-3">
                                        -{discountPercent}%
                                    </span>
                                </>
                            )}
                            <span
                                className={`h5 fw-bold ${discountPercent ? "text-danger" : "text-success"
                                }`}
                            >
                                {/* ตรวจสอบว่าเป็น number ก่อนเรียก toLocaleString */}
                                {typeof discountedPrice === 'number' ? discountedPrice.toLocaleString() : ''} บาท
                            </span>
                        </div>

                        <small className="text-muted">รวมค่าธรรมเนียมและภาษีแล้ว</small>

                        {/* ปุ่ม */}
                        <div className="mt-3 d-flex gap-2">
                            <Button variant="outline-secondary">
                                <i className="bi bi-book me-2"></i>รายละเอียดห้องพัก
                            </Button>
                            <Button variant="primary" onClick={() => handleRedirect(accommodation.id)}>
                                <i className="bi bi-hand-index-thumb me-2"></i>จองเลย
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AccommodationCard;