import React, { useEffect, useState, useRef } from "react";
import AccommodationService from "../../services/api/accommodation/accommodation.service";
import PromotionCard from "./PromotionCard";
import { Spinner, Button } from "react-bootstrap";
import GetRoomAvailability from "../common/GetRoomAvailability";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState({});
  const [showLeftButton, setShowLeftButton] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkInDate = dayjs().add(1, 'day').toDate();
    const checkOutDate = dayjs().add(2, 'day').toDate();

    const fetchData = async () => {
      if (checkInDate && checkOutDate) {
        const result = await GetRoomAvailability(checkInDate, checkOutDate);
        setAvailabilityData(result);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await AccommodationService.getPromotion();
      setPromotions(res?.data || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 420; // กว้างแต่ละ card + margin
    if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollEvent = () => {
    const container = scrollRef.current;
    setShowLeftButton(container.scrollLeft > 0);
  };

  return (
  <div className="position-relative" style={{ paddingInline: "2.5rem" }}>
    {/* ปุ่มซ้าย */}
    {showLeftButton && (
      <Button
        variant="light"
        className="position-absolute start-0 top-50 translate-middle-y z-3"
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          pointerEvents: "auto"
        }}
        onClick={() => handleScroll("left")}
      >
        ◀
      </Button>
    )}

    {/* ปุ่มขวา */}
    {!loading && promotions.length > 0 && (
      <Button
        variant="light"
        className="position-absolute end-0 top-50 translate-middle-y z-3"
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          pointerEvents: "auto"
        }}
        onClick={() => handleScroll("right")}
      >
        ▶
      </Button>
    )}

    {/* Container ที่มีช่องว่างซ้าย-ขวาให้ปุ่ม */}
    <div
      className="d-flex flex-nowrap overflow-auto"
      ref={scrollRef}
      onScroll={handleScrollEvent}
      style={{
        scrollBehavior: "smooth",
        paddingInline: "1rem", // เว้นซ้าย-ขวา
        gap: "16px" // เว้นระยะระหว่างการ์ด
      }}
    >
      {loading ? (
        <div className="text-center w-100 my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : promotions.length > 0 ? (
        promotions.map((promotion) => (
          <div key={promotion.id} style={{ minWidth: "411px" }}>
            <PromotionCard
              accommodation={promotion}
              availabilityRooms={availabilityData[promotion.id] || 0}
            />
          </div>
        ))
      ) : (
        <div className="text-center w-100">
          <p className="text-danger">ไม่สามารถโหลดข้อมูลโปรโมชั่นได้</p>
        </div>
      )}
    </div>
  </div>
);

};

export default Promotion;
