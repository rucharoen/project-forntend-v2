import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import formatPrice from "../../../utils/formatPrice";
import SearchBox from "../../../components/search/SearchBox";
import AccommodationService from "../../../services/api/accommodation/accommodation.service";
import TypeService from "../../../services/api/accommodation/type.service";
import GetRoomAvailability from "../../../components/common/GetRoomAvailability";
import "../../../css/SearchPage.css";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const defaultFilters = {
  priceRange: [0, 10000],
  breakfast: false,
  freeCancel: false,
  highRating: false,
  selectedTypes: [],
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || 1;

  const checkInDate = checkIn ? dayjs(checkIn).toDate() : null;
  const checkOutDate = checkOut ? dayjs(checkOut).toDate() : null;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalResults, setOriginalResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [filters, setFilters] = useState(defaultFilters);

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  useEffect(() => {
    document.title = `Barali Beach Resort`;
    TypeService.getAll().then((res) => setTypes(res?.data || []));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = destination
      ? await AccommodationService.getSearch(
          destination,
          checkIn,
          checkOut,
          guests
        )
      : await AccommodationService.getAll();
    const results = res?.data || [];
    setOriginalResults(results);
    setFilteredResults(results);
    setLoading(false);
  }, [destination, checkIn, checkOut, guests]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      GetRoomAvailability(checkInDate, checkOutDate).then(setAvailabilityData);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const { priceRange, breakfast, freeCancel, highRating, selectedTypes } =
      filters;
    setFilteredResults(
      originalResults.filter((acc) => {
        const price = acc.price_per_night || 0;
        return (
          price >= priceRange[0] &&
          price <= priceRange[1] &&
          (!breakfast || acc.breakfastIncluded) &&
          (!freeCancel || acc.freeCancellation) &&
          (!highRating || acc.rating >= 8) &&
          (selectedTypes.length === 0 || selectedTypes.includes(acc.type?.name))
        );
      })
    );
  }, [filters, originalResults]);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const handleTypeChange = useCallback((type) => {
    setFilters((prev) => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter((t) => t !== type)
        : [...prev.selectedTypes, type],
    }));
  }, []);

  const matchesSearchTerm = useCallback(
    (acc) => {
      if (!destination) return true;
      const term = destination.toLowerCase();
      return [acc.name, acc.city, acc.province, acc.type?.name].some((field) =>
        field?.toLowerCase().includes(term)
      );
    },
    [destination]
  );

  const getDiscountedPrice = useCallback((acc) => {
    return acc.discount > 0
      ? Math.round(acc.price_per_night * (1 - acc.discount / 100))
      : acc.price_per_night;
  }, []);

  const visibleResults = useMemo(
    () => filteredResults.filter(matchesSearchTerm),
    [filteredResults, matchesSearchTerm]
  );

  const openImageModal = (acc) => {
    const images = [
      acc.image_name
        ? `${BASE_URL}/uploads/accommodations/${acc.image_name}`
        : "https://picsum.photos/id/57/400/300",
      "https://picsum.photos/id/58/400/300",
      "https://picsum.photos/id/59/400/300",
    ];
    setModalImages(images);
    setShowImageModal(true);
  };

  return (
    <div className="search-page">
      <SearchBox resetFilter={resetFilters} />

      <div className="result-count">พบ {visibleResults.length} รายการ</div>
      <div className="room-box">
        <div className="room-grid">
          {visibleResults.map((acc) => (
            <div className="room-card" key={acc.id}>
              <div className="room-left">
                <h5 className="room-name">{acc.name}</h5>
                <img
                  src={
                    acc.image_name
                      ? `${BASE_URL}/uploads/accommodations/${acc.image_name}`
                      : "https://picsum.photos/id/57/400/300"
                  }
                  className="room-main-img"
                  alt={acc.name}
                />
                <div className="room-sub-images">
                  {[102, 103].map((id, i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/id/${id}/400/300`}
                      alt=""
                      className="room-sub-img"
                    />
                  ))}
                </div>
                <div className="room-meta">
                  <div>
                    <i className="bi bi-tv me-2"></i>
                    {acc.bed_type || "เตียงแฝด หรือ เตียงใหญ่"}
                  </div>
                  <div>
                    <i className="bi bi-aspect-ratio me-2"></i>
                    {acc.room_size || "47 ตร.ม. 50.59 ตร.ฟุต"}
                  </div>
                </div>
                <div className="room-detail-link-wrapper">
                  <button
                    className="room-detail-link"
                    onClick={() => openImageModal(acc)}
                  >
                    คลิกดูรายละเอียดห้องและรูปเพิ่มเติม
                  </button>
                </div>
              </div>

              <div className="room-right">
                <div className="room-title">รายละเอียดห้องพัก</div>
                {[1, 2].map((option, idx) => {
                  const isDiscounted = idx === 0;
                  const finalPrice = isDiscounted
                    ? getDiscountedPrice(acc)
                    : acc.price_per_night;

                  return (
                    <div className="room-option" key={idx}>
                      <div className="room-amenities">
                        <ul className="amenities-list">
                          {(acc.amenities ?? "")
                            .split(",")
                            .filter(Boolean)
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ul>
                      </div>

                      <hr className="vertical-divider"></hr>

                      <div className="room-pricing">
                        {isDiscounted && (
                          <div className="discount">
                            <span className="text-gray">ประหยัด </span>
                            <span className="text-red">{acc.discount}%</span>
                          </div>
                        )}
                        <div className="rating">
                          {isDiscounted ? "★★★★★" : "★★★★☆"}{" "}
                          <small>({acc.rating})</small>
                        </div>
                        {isDiscounted && (
                          <div className="price-strike">
                            {acc.price_per_night.toLocaleString()} บาท
                          </div>
                        )}
                        <div
                          className={`price ${
                            isDiscounted ? "text-success" : "text-dark"
                          }`}
                        >
                          {finalPrice.toLocaleString()} TBH/คืน
                        </div>
                        <div className="price-note">รวมภาษีและค่าธรรมเนียม</div>
                        <button
                          onClick={() =>
                            navigate({
                              pathname: "/book",
                              search: createSearchParams({
                                id: acc.id,
                                checkIn,
                                checkOut,
                              }).toString(),
                            })
                          }
                          className="btn-book"
                        >
                          จองเลยตอนนี้
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {showImageModal && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowImageModal(false)}
            >
              &times;
            </button>
            <div className="modal-images">
              {modalImages.map((src, i) => (
                <img key={i} src={src} alt={`รูป ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
