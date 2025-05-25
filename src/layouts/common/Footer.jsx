import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="text-light py-4" style={{ backgroundColor: '#343a40' }}>
      <Container>
        <Row>
          <Col md={3}>
            <h5>เมนูหลัก</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">หน้าหลัก</a></li>
              <li><a href="/about" className="text-light">เกี่ยวกับเรา</a></li>
              <li><a href="/contact" className="text-light">ติดต่อเรา</a></li>
              <li><a href="/faq" className="text-light">คำถามที่พบบ่อย</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>ห้องพัก</h5>
            <ul className="list-unstyled">
              <li><a href="/rooms/deluxe" className="text-light">ห้องดีลักซ์</a></li>
              <li><a href="/rooms/suite" className="text-light">ห้องสวีท</a></li>
              <li><a href="/rooms/family" className="text-light">ห้องครอบครัว</a></li>
              <li><a href="/rooms/villa" className="text-light">วิลล่า</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>จุดหมายและกิจกรรม</h5>
            <ul className="list-unstyled">
              <li><a href="/destinations/beach" className="text-light">ชายหาด</a></li>
              <li><a href="/activities/snorkeling" className="text-light">ดำน้ำตื้น</a></li>
              <li><a href="/activities/hiking" className="text-light">เดินป่า</a></li>
              <li><a href="/activities/spa" className="text-light">สปา</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>อีเวนต์ในรีสอร์ท</h5>
            <ul className="list-unstyled">
              <li><a href="/events/wedding" className="text-light">งานแต่งงาน</a></li>
              <li><a href="/events/conference" className="text-light">สัมมนา</a></li>
              <li><a href="/events/party" className="text-light">ปาร์ตี้</a></li>
              <li><a href="/events/music-night" className="text-light">ค่ำคืนดนตรี</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-light" />
        <div className="text-center text-secondary">
          &copy; {new Date().getFullYear()} Barali Resort. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
