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

  useEffect(() => {
    document.title = `Barali Beach Resort`;
    TypeService.getAll().then((res) => setTypes(res?.data || []));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = destination
      ? await AccommodationService.getSearch(destination, checkIn, checkOut, guests)
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
    const { priceRange, breakfast, freeCancel, highRating, selectedTypes } = filters;
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

  return (
    <div className="container my-4">
      <SearchBox resetFilter={resetFilters} />

      <div className="text-end text-secondary mb-3">
        พบ {visibleResults.length} รายการ
      </div>

      <div className="row gx-4">
        {visibleResults.map((acc) => (
          <div className="col-12 mb-4" key={acc.id}>
            <div className="card-custom p-3 shadow-sm">
              <div className="row">
                <div className="col-md-4 p-3 room-left">
                  <h5 className="fw-bold text-dark mb-3">{acc.name}</h5>
                  <img
                    src={
                      acc.image_name
                        ? `${BASE_URL}/uploads/accommodations/${acc.image_name}`
                        : "https://picsum.photos/id/57/400/300"
                    }
                    className="img-fluid rounded mb-2 room-main-img"
                    alt={acc.name}
                  />
                  <div className="row g-2 mb-2">
                    {[102, 103].map((id, i) => (
                      <img
                        key={i}
                        src="https://picsum.photos/id/57/400/300"
                        alt=""
                        className="img-fluid rounded col-6"
                      />
                    ))}
                  </div>
                  <div className="text-muted small mb-1">
                    <i className="bi bi-tv me-2"></i>{acc.bed_type || "เตียงแฝด หรือ เตียงใหญ่"}
                  </div>
                  <div className="text-muted small mb-1">
                    <i className="bi bi-aspect-ratio me-2"></i>{acc.room_size || "47 ตร.ม. 50.59 ตร.ฟุต"}
                  </div>
                  <div className="mt-2">
                    <a
                      href="#"
                      className="text-decoration-underline text-orange room-detail-link"
                    >
                      คลิกดูรายละเอียดห้องและรูปเพิ่มเติม
                    </a>
                  </div>
                </div>

                <div className="col-md-8 p-3 room-right">
                  <div className="room-title">
                    รายละเอียดห้องพัก
                  </div>

                  {[1, 2].map((option, idx) => {
                    const isDiscounted = idx === 0;
                    const finalPrice = isDiscounted
                      ? getDiscountedPrice(acc)
                      : acc.price_per_night;

                    return (
                      <div className="card-option mb-3 p-3 shadow-sm" key={idx}>
                        <div className="row">
                          <div className="col-md-7">
                            <ul className="list-unstyled mb-0 amenities-list">
                              {(acc.amenities ?? "")
                                .split(",")
                                .filter(Boolean)
                                .map((item, index) => (
                                  <li key={index}>
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {item.trim()}
                                  </li>
                                ))}
                            </ul>
                          </div>
                          <div className="col-md-5 text-end d-flex flex-column justify-content-between">
                            <div>
                              {isDiscounted && (
                                <div className="text-danger fw-bold">ประหยัด {acc.discount}%</div>
                              )}
                              <div className="text-warning mb-2">
                                {isDiscounted ? "★★★★★" : "★★★★☆"} <small>({acc.rating})</small>
                              </div>
                              {isDiscounted && (
                                <div className="text-decoration-line-through text-muted">
                                  {acc.price_per_night.toLocaleString()} บาท
                                </div>
                              )}
                              <h4 className={isDiscounted ? "text-success" : "text-dark"}>
                                {finalPrice.toLocaleString()} บาท/คืน
                              </h4>
                              <div className="text-muted price-note">
                                รวมภาษีและค่าธรรมเนียม
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                navigate({
                                  pathname: "/book",
                                  search: createSearchParams({ id: acc.id, checkIn, checkOut }).toString(),
                                })
                              }
                              className="btn btn-book mt-2 rounded-pill"
                            >
                              จองเลยตอนนี้
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;