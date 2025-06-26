import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import th from "date-fns/locale/th";
import TypeService from "../../services/api/accommodation/type.service";
import "../../css/SearchBox.css";
import {
  IconCalendarDown,
  IconCalendarUp,
  IconUser,
  IconDoor,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";

registerLocale("th", th);

const SearchBox = ({
  resetFilter,
  destination = "",
  checkIn = null,
  checkOut = null,
  guests = 1,
}) => {
  const navigate = useNavigate();
  const today = new Date();

  const [checkInDate, setCheckInDate] = useState(checkIn ? new Date(checkIn) : null);
  const [checkOutDate, setCheckOutDate] = useState(checkOut ? new Date(checkOut) : null);
  const [destinationState, setDestination] = useState(destination);

  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(guests);
  const [childrenCount, setChildrenCount] = useState(0);

  const [dateError, setDateError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const [guestPopupVisible, setGuestPopupVisible] = useState(false);
  const [guestPopupPos, setGuestPopupPos] = useState({ top: 0, left: 0 });

  const dateButtonRef = useRef(null);
  const guestButtonRef = useRef(null);

  useEffect(() => {
    TypeService.getAll()
      .then((res) => setTypes(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setCheckInDate(checkIn ? new Date(checkIn) : null);
    setCheckOutDate(checkOut ? new Date(checkOut) : null);
    setDestination(destination);
    setAdultsCount(guests);
  }, [checkIn, checkOut, destination, guests]);

  useEffect(() => {
    const closeCalendar = (e) => {
      if (!dateButtonRef.current?.contains(e.target) && !e.target.closest(".calendar-popover")) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", closeCalendar);
    return () => document.removeEventListener("mousedown", closeCalendar);
  }, []);

  useEffect(() => {
    const closeGuestPopup = (e) => {
      if (!e.target.closest(".guest-selector") && !e.target.closest(".guest-popup")) {
        setGuestPopupVisible(false);
      }
    };
    document.addEventListener("click", closeGuestPopup);
    return () => document.removeEventListener("click", closeGuestPopup);
  }, []);

  const toggleCalendar = () => {
    if (!showCalendar && dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setCalendarPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setShowCalendar((prev) => !prev);
    setDateError(false);
  };

  const toggleGuestPopup = (e) => {
    e.stopPropagation();
    if (!guestPopupVisible && guestButtonRef.current) {
      const rect = guestButtonRef.current.getBoundingClientRect();
      setGuestPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setGuestPopupVisible((prev) => !prev);
  };

  const changeCount = (key, delta) => {
    if (key === "rooms") setRoomsCount((prev) => Math.min(5, Math.max(1, prev + delta)));
    if (key === "adults")
      setAdultsCount((prev) => {
        const newVal = Math.max(1, prev + delta);
        return newVal + childrenCount <= 4 ? newVal : prev;
      });
    if (key === "children")
      setChildrenCount((prev) => {
        const newVal = Math.max(0, prev + delta);
        return newVal + adultsCount <= 4 ? newVal : prev;
      });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) return setDateError(true);

    setLoading(true);

    const params = new URLSearchParams({
      destination: destinationState,
      guests: roomsCount + adultsCount + childrenCount,
      checkIn: dayjs(checkInDate).format("YYYY-MM-DD"),
      checkOut: dayjs(checkOutDate).format("YYYY-MM-DD"),
    });

    await new Promise((r) => setTimeout(r, 1000));
    navigate(`/search-results?${params}`);
    setLoading(false);
  };

  return (
    <div className={`searchbox-container${dateError ? " error" : ""}`}>
      <form onSubmit={handleSearch}>
        {dateError && <div className="date-error">กรุณากรอกข้อมูลวันที่ต้องการเข้าพัก</div>}

        <div className="searchbox-row">
          <div className="searchbox-col date">
            <div className="agoda-date-container">
              <button type="button" className="agoda-date-button" onClick={toggleCalendar} ref={dateButtonRef}>
                <IconCalendarUp stroke={2} size={32} />
                <span className="calendar-text">{checkInDate ? dayjs(checkInDate).format("DD/MM/YYYY") : "  วันเช็คอิน"}</span>
              </button>
              <hr />
              <button type="button" className="agoda-date-button" onClick={toggleCalendar}>
                <IconCalendarDown stroke={2} size={32} />
                <span className="calendar-text">{checkOutDate ? dayjs(checkOutDate).format("DD/MM/YYYY") : "วันเช็คเอาท์"}</span>
              </button>
            </div>
            {showCalendar && createPortal(
              <div className="calendar-popover" style={calendarPos}>
                <div className="calendar-wrapper">
                  <div>
                    <label>เช็คอิน</label>
                    <DatePicker inline locale="th" selected={checkInDate} onChange={(d) => setCheckInDate(d)} minDate={today} dateFormat="dd/MM/yyyy" />
                  </div>
                  <div>
                    <label>เช็คเอาท์</label>
                    <DatePicker inline locale="th" selected={checkOutDate} onChange={(d) => setCheckOutDate(d)} minDate={checkInDate || today} dateFormat="dd/MM/yyyy" />
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>

          <div className="searchbox-col type">
            <div className="select-with-icon">
              <IconDoor className="select-icon" stroke={2} size={32} />
              <select
                value={destinationState}
                onChange={(e) => setDestination(e.target.value)}
                className="select-input has-icon"
              >
                <option value="">ประเภทห้อง: ทั้งหมด</option>
                {types.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="searchbox-col guests" style={{ position: "relative" }}>
            <div className="guest-selector" onClick={toggleGuestPopup} ref={guestButtonRef}>
              <IconUser stroke={2} size={32} />
              <span>{`${roomsCount} ห้อง, ${adultsCount} ผู้ใหญ่${childrenCount > 0 ? `, ${childrenCount} เด็ก` : ``}`}</span>
            </div>
            {guestPopupVisible && createPortal(
              <div className="guest-popup" style={guestPopupPos}>
                {[{ label: "ห้อง", key: "rooms", val: roomsCount }, { label: "ผู้ใหญ่", key: "adults", val: adultsCount }, { label: "เด็ก", key: "children", val: childrenCount }].map(({ label, key, val }) => (
                  <div key={key} className="guest-row">
                    <span>{label}</span>
                    <div className="counter">
                      <button onClick={(e) => { e.stopPropagation(); changeCount(key, -1); }}>-</button>
                      <span>{val}</span>
                      <button onClick={(e) => { e.stopPropagation(); changeCount(key, 1); }}>+</button>
                    </div>
                  </div>
                ))}
              </div>,
              document.body
            )}
          </div>

          <div className="searchbox-col button">
            <button className="search-button" type="submit" disabled={loading}>
              {loading ? "กำลังค้นหา" : "ค้นหา"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
