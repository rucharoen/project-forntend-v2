import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import SearchBox from "../../../components/search/SearchBox";
import AccommodationService from "../../../services/api/accommodation/accommodation.service";
import TypeService from "../../../services/api/accommodation/type.service";
import GetRoomAvailability from "../../../components/common/GetRoomAvailability";
import AuthService from "../../../services/auth/auth.service";
import "../../../css/SearchPage.css";
import RoomDetailModal from "../search/RoomDetailModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const defaultFilters = {
  priceRange: [0, 10000],
  breakfast: false,
  freeCancel: false,
  highRating: false,
  selectedTypes: [],
};

const getImageUrl = (imageName) =>
  imageName
    ? `${BASE_URL}/uploads/accommodations/${imageName}`
    : "https://picsum.photos/id/57/400/300";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    destination = "",
    checkIn = "",
    checkOut = "",
    guests = 1,
  } = Object.fromEntries([...searchParams]);

  const checkInDate = checkIn ? dayjs(checkIn).toDate() : null;
  const checkOutDate = checkOut ? dayjs(checkOut).toDate() : null;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalResults, setOriginalResults] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [filters, setFilters] = useState(defaultFilters);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [selectedAccommodation, setSelectedAccommodation] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);

  useEffect(() => {
    document.title = `Barali Beach Resort`;

    TypeService.getAll()
      .then((res) => setTypes(res?.data || []))
      .catch((err) => console.error("Error loading types", err));

    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) JSON.parse(storedCart);
    } catch {
      localStorage.removeItem("cart");
    }

    try {
      const storedSelected = localStorage.getItem("selectedAccommodation");
      if (storedSelected) setSelectedAccommodation(JSON.parse(storedSelected));
    } catch {
      localStorage.removeItem("selectedAccommodation");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = destination
        ? await AccommodationService.getSearch(destination, checkIn, checkOut, guests)
        : await AccommodationService.getAll();
      setOriginalResults(res?.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [destination, checkIn, checkOut, guests]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
  if (checkInDate && checkOutDate) {
    GetRoomAvailability(checkInDate, checkOutDate).then(setAvailabilityData);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const filteredResultsWithPromo = useMemo(() => {
    return originalResults
      .filter((acc) => !destination || String(acc.type?.name) === String(destination))
      .map((acc) => {
        const matchedPromo = promotions.find(
          (promo) =>
            promo.accommodation_id === acc.id &&
            new Date(promo.start_date) <= new Date() &&
            new Date() <= new Date(promo.end_date)
        );
        const discountPercent = matchedPromo?.discount_percentage || 0;
        const discountedPrice =
          discountPercent > 0
            ? Math.round(acc.price_per_night * (1 - discountPercent / 100))
            : acc.price_per_night;

        return {
          ...acc,
          promo: matchedPromo,
          discountPercent,
          discountedPrice,
        };
      });
  }, [originalResults, promotions, destination]);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const updateRoomQuantity = useCallback((id, delta) => {
    setRoomQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  }, []);

  const handleAddToBooking = useCallback(
    (acc) => {
      if (selectedAccommodation.length >= 9) {
        alert("คุณสามารถเลือกห้องพักได้ไม่เกิน 9 ห้องเท่านั้น");
        return;
      }
      if (!selectedAccommodation.some((a) => a.id === acc.id)) {
        const newSelection = [...selectedAccommodation, acc];
        setSelectedAccommodation(newSelection);
        localStorage.setItem("selectedAccommodation", JSON.stringify(newSelection));
        window.dispatchEvent(new Event("accommodationChanged"));
      }
    },
    [selectedAccommodation]
  );

  const handleBooking = useCallback(
    (acc) => {
      const isLoggedIn = AuthService.getCurrentUser();
      const bookingData = {
        id: acc.id,
        name: acc.name,
        image: getImageUrl(acc.image_name),
        price: acc.discountedPrice,
        checkIn,
        checkOut,
      };

      if (!isLoggedIn) {
        navigate({
          pathname: "/login",
          search: `?redirect=/book&${createSearchParams({
            id: acc.id,
            checkIn,
            checkOut,
          }).toString()}`,
        });
        return;
      }
      navigate("/book", { state: bookingData });
    },
    [checkIn, checkOut, navigate]
  );

  const openImageModal = useCallback((acc) => {
    setSelectedRoomDetail({
      name: acc.name,
      images: [
        getImageUrl(acc.image_name),
        "https://picsum.photos/id/58/400/300",
        "https://picsum.photos/id/59/400/300",
      ],
      facilities: (acc.amenities?.split(",") || []).map((a) => a.trim()),
    });
    setShowImageModal(true);
  }, []);

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="search-page">
      <SearchBox
  resetFilter={resetFilters}
  destination={destination}
  checkIn={checkIn}
  checkOut={checkOut}
  guests={parseInt(guests) || 1}  // เผื่อเป็น string ให้เป็น number
/>
      <div className="result-count">พบ {filteredResultsWithPromo.length} รายการ</div>

      <div className="room-box">
        <div className="room-grid">
          {filteredResultsWithPromo.map((acc) => (
            <div className="room-card" key={acc.id}>
              <div className="room-left">
                <h5 className="room-name">{acc.name}</h5>
                <img src={getImageUrl(acc.image_name)} className="room-main-img" alt={acc.name} />
                <div className="room-sub-images">
                  {[102, 103].map((id) => (
                    <img key={id} src={`https://picsum.photos/id/${id}/400/300`} alt="" className="room-sub-img" />
                  ))}
                </div>
                <div className="room-meta">
                  <div><i className="bi bi-tv me-2"></i>{acc.bed_type || "เตียงแฝด หรือ เตียงใหญ่"}</div>
                  <div><i className="bi bi-aspect-ratio me-2"></i>{acc.room_size || "47 ตร.ม. 50.59 ตร.ฟุต"}</div>
                </div>
                <div className="room-detail-link-wrapper">
                  <button className="room-detail-link" onClick={() => openImageModal(acc)}>คลิกดูรายละเอียดห้องและรูปเพิ่มเติม</button>
                </div>
              </div>

              <div className="room-right">
                <div className="room-title">รายละเอียดห้องพัก</div>
                <div className="room-option">
                  <div className="room-amenities">
                    <ul className="amenities-list">
                      {(acc.amenities?.split(",") || []).filter(Boolean).map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <hr className="vertical-divider" />

                  <div className="room-pricing">
                    {acc.discountPercent > 0 && (
                      <>
                        <div className="discount">
                          <span className="text-gray">ประหยัด </span>
                          <span className="text-red">{acc.discountPercent}%</span>
                        </div>
                        <div className="price-strike">{acc.price_per_night.toLocaleString()} บาท</div>
                      </>
                    )}
                    <div className="rating">
                      {acc.discountPercent > 0 ? "★★★★★" : "★★★★☆"} <small>({acc.rating})</small>
                    </div>
                    <div className="price text-success">{acc.discountedPrice.toLocaleString()} THB/คืน</div>
                    <div className="price-note">รวมภาษีและค่าธรรมเนียม</div>

                    <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                      <div className="room-quantity d-flex align-items-center">
                        <button onClick={() => updateRoomQuantity(acc.id, -1)} className="btn btn-sm btn-outline-secondary" style={{ minWidth: "32px", height: "32px" }}>−</button>
                        <span className="mx-2">{roomQuantities[acc.id] || 1}</span>
                        <button onClick={() => updateRoomQuantity(acc.id, 1)} className="btn btn-sm btn-outline-secondary" style={{ minWidth: "32px", height: "32px" }}>+</button>
                      </div>
                      {selectedAccommodation.some((a) => a.id === acc.id) ? (
                        <button className="btn btn-secondary btn-sm" disabled style={{ minWidth: "110px", height: "32px" }}>เพิ่มแล้ว</button>
                      ) : (
                        <button className="btn btn-sm" onClick={() => handleAddToBooking(acc)} style={{ minWidth: "110px", height: "32px", fontSize: "13px", fontWeight: 600, border: "1px solid rgba(114, 181, 77, 1)", color: "#5B873AE0", backgroundColor: "white" }}>เพิ่มในรถเข็น</button>
                      )}
                      <button onClick={() => handleBooking(acc)} className="btn btn-sm" style={{ backgroundColor: "rgba(114, 181, 77, 1)", color: "#fff", fontSize: "13px", fontWeight: 600, minWidth: "110px", height: "32px" }}>จองเลยตอนนี้</button>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>

      {showImageModal && selectedRoomDetail && (
        <RoomDetailModal
          show={showImageModal}
          onHide={() => {
            setShowImageModal(false);
            setSelectedRoomDetail(null);
          }}
          room={selectedRoomDetail}
        />
      )}
    </div>
  );
};

export default SearchPage;


