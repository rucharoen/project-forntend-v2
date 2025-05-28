import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import th from "date-fns/locale/th";
import TypeService from "../../services/api/accommodation/type.service";
import "../../css/SearchBox.css";
import { IconCalendarDown, IconCalendarUp, IconUser, IconDoor } from "@tabler/icons-react";
import { createPortal } from "react-dom";

registerLocale("th", th);

const SearchBox = ({ resetFilter }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [guestPopupVisible, setGuestPopupVisible] = useState(false);
  const [guestPopupPos, setGuestPopupPos] = useState({ top: 0, left: 0 });
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const dateButtonRef = useRef(null);
  const guestButtonRef = useRef(null);
  const today = new Date();

  // ✅ โหลดค่าจาก URL params
  useEffect(() => {
    const initType = searchParams.get("destination") || "";
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    const guestsParam = parseInt(searchParams.get("guests")) || null;

    setDestination(initType);
    setSelectedType(initType);

    if (checkInParam) {
      const checkIn = dayjs(checkInParam, "YYYY-MM-DD").toDate();
      setCheckInDate(checkIn);
    }

    if (checkOutParam) {
      const checkOut = dayjs(checkOutParam, "YYYY-MM-DD").toDate();
      setCheckOutDate(checkOut);
    }

    if (guestsParam) {
      const baseRooms = 1;
      const baseAdults = Math.max(1, guestsParam - baseRooms);
      setRoomsCount(baseRooms);
      setAdultsCount(baseAdults);
      setChildrenCount(0); // ไม่มีแยก children ใน URL
    }
  }, [searchParams]);

  // โหลดประเภทห้อง
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await TypeService.getAll();
        setTypes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  // ปิดปฏิทินเมื่อคลิกรอบนอก
  useEffect(() => {
    const handler = (e) => {
      if (
        dateButtonRef.current &&
        !dateButtonRef.current.contains(e.target) &&
        !e.target.closest('.calendar-popover')
      ) setShowCalendar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ปิด popup ผู้เข้าพักเมื่อคลิกรอบนอก
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.guest-selector') && !e.target.closest('.guest-popup')) {
        setGuestPopupVisible(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const toggleCalendar = () => {
    if (!showCalendar && dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setCalendarPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    }
    setShowCalendar(prev => !prev);
    setDateError(false);
  };

  const handleCheckInDate = (date) => {
    setCheckInDate(date);
    if (checkOutDate && dayjs(date).isAfter(dayjs(checkOutDate))) {
      setCheckOutDate(date);
    }
  };
  const handleCheckOutDate = (date) => setCheckOutDate(date);

  const handleTypeChange = e => {
    setSelectedType(e.target.value);
    setDestination(e.target.value);
  };

  const toggleGuestPopup = e => {
    e.stopPropagation();
    if (!guestPopupVisible && guestButtonRef.current) {
      const rect = guestButtonRef.current.getBoundingClientRect();
      setGuestPopupPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    }
    setGuestPopupVisible(prev => !prev);
  };

  const changeCount = (key, delta) => {
    if (key === 'rooms') setRoomsCount(prev => Math.max(1, prev + delta));
    if (key === 'adults') setAdultsCount(prev => Math.max(1, prev + delta));
    if (key === 'children') setChildrenCount(prev => Math.max(0, prev + delta));
  };

  const handleSearch = async e => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setDateError(true);
      return;
    }
    setLoading(true);
    const totalGuests = roomsCount + adultsCount + childrenCount;
    const params = new URLSearchParams({
      destination,
      guests: totalGuests,
      checkIn: dayjs(checkInDate).format('YYYY-MM-DD'),
      checkOut: dayjs(checkOutDate).format('YYYY-MM-DD')
    });
    await new Promise(r => setTimeout(r, 1000));
    navigate(`/search-results?${params}`);
    setLoading(false);
  };

  return (
    <div className={`searchbox-container${dateError ? ' error' : ''}`}>
      <form onSubmit={handleSearch}>
        {dateError && <div className="date-error">กรุณากรอกข้อมูลวันที่ต้องการเข้าพัก</div>}

        <div className="searchbox-row">
          <div className="searchbox-col date">
            <div className="agoda-date-container">
              <button type="button" className="agoda-date-button" onClick={toggleCalendar} ref={dateButtonRef}>
                <IconCalendarUp stroke={2} size={32} /><span className="calendar-text">{checkInDate ? dayjs(checkInDate).format('DD/MM/YYYY') : '  วันเช็คอิน'}</span>
              </button>
              <div>|</div>
              <button type="button" className="agoda-date-button" onClick={toggleCalendar}>
                <IconCalendarDown stroke={2} size={32} /><span className="calendar-text">{checkOutDate ? dayjs(checkOutDate).format('DD/MM/YYYY') : 'วันเช็คเอาท์'}</span>
              </button>
            </div>
            {showCalendar && createPortal(
              <div className="calendar-popover" style={{ top: calendarPos.top, left: calendarPos.left }}>
                <div className="calendar-wrapper">
                  <div><label>เช็คอิน</label><DatePicker inline locale="th" selected={checkInDate} onChange={handleCheckInDate} minDate={today} dateFormat="dd/MM/yyyy" /></div>
                  <div><label>เช็คเอาท์</label><DatePicker inline locale="th" selected={checkOutDate} onChange={handleCheckOutDate} minDate={checkInDate || today} dateFormat="dd/MM/yyyy" /></div>
                </div>
              </div>, document.body)}
          </div>

          <div className="searchbox-col type">
            <div className="select-with-icon">
              <IconDoor className="select-icon" stroke={2} size={32} />
              <select value={selectedType} onChange={handleTypeChange} className="select-input has-icon">
                <option value="">ประเภทห้อง: ทั้งหมด</option>
                {types.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="searchbox-col guests" style={{ position: 'relative' }}>
            <div className="guest-selector" onClick={toggleGuestPopup} ref={guestButtonRef}>
              <IconUser stroke={2} size={32} /><span>{`${roomsCount} ห้อง, ${adultsCount} ผู้ใหญ่${childrenCount > 0 ? `, ${childrenCount} เด็ก` : ``}`}</span>
            </div>
            {guestPopupVisible && createPortal(
              <div className="guest-popup" style={{ top: guestPopupPos.top, left: guestPopupPos.left }}>
                {[{ label: 'ห้อง', key: 'rooms', val: roomsCount }, { label: 'ผู้ใหญ่', key: 'adults', val: adultsCount }, { label: 'เด็ก', key: 'children', val: childrenCount }].map(({ label, key, val }) =>
                  <div key={key} className="guest-row"><span>{label}</span><div className="counter"><button onClick={e => { e.stopPropagation(); changeCount(key, -1) }}>-</button><span>{val}</span><button onClick={e => { e.stopPropagation(); changeCount(key, 1) }}>+</button></div></div>
                )}
              </div>, document.body)}
          </div>

          <div className="searchbox-col button">
            <button className="search-button" type="submit" disabled={loading}>{loading ? 'กำลังค้นหา' : 'ค้นหา'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
