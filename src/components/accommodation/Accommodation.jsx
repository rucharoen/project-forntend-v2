import React, { useEffect, useState } from "react";
import AccommodationService from "../../services/api/accommodation/accommodation.service";
import AccommodationCard from "./AccommodationCard";
import { Spinner } from "react-bootstrap";

const Accommodation = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccommodations();
    fetchPromotions();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const res = await AccommodationService.getAll();
      setAccommodations(res?.data || []);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPromotions = async () => {
    try {
      const res = await AccommodationService.getPromotion();
      setPromotions(res?.data || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  return (
    <div className="row">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {accommodations.length > 0 ? (
            accommodations
              .slice(0, 3)
              .map((acc) => (
                <AccommodationCard key={acc.id} accommodation={acc} promotions={promotions} />
              ))
          ) : (
            <div className="text-center col-12">
              <p className="text-danger">ไม่สามารถโหลดข้อมูลห้องพักได้</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Accommodation;
