// AccommodationCard.jsx
import React from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TypeDetailModal from './RoomDetail';
import TypeService from "../../services/api/accommodation/type.service";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RoomTypeCard = ({ accommodation }) => {

   const [modalShow, setModalShow] = React.useState(false);
   const [typeDetail, setTypeDetail] = React.useState(0);
    const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.name}`;

    const getTypeDetail = async (id) => {
        setModalShow(true)
        try {
                // setLoading(true);
                const result = await TypeService.getById(id);
                setTypeDetail(result.data[0]);
            } catch (error) {
                console.error("Error fetching popular accommodations:", error);
            } finally {
                // setLoading(false);
            }
    }
// const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;
    return (
        
        <div className="col-lg-6 px-2 py-2">
            <div className="border rounded p-2 shadow-sm h-100">
                <TypeDetailModal
                    show={modalShow}
                    detail={typeDetail}
                    onHide={() => setModalShow(false)}
                />
                <Row>
                    {/* รูปภาพที่พัก */}
                    <Col md={5}>
                        <img src={fullImageUrl} alt={accommodation.name} className="img-fluid rounded" />
                    </Col>

                    {/* ข้อมูลที่พัก */}
                    <Col md={7}>
                        <h5>
                            {accommodation.name}
                        </h5>
                        {/* ปุ่ม */}
                        <div className="mt-3 d-flex gap-2">
                            <Button variant="outline-secondary"
                            onClick={() => {getTypeDetail(accommodation.id)}}
                            >
                                <i className="bi bi-book me-2"></i>รายละเอียดห้องพัก
                            </Button>
                        
                        </div>
                    </Col>
                </Row>
               
            </div>
        </div>
    );
};

export default RoomTypeCard;