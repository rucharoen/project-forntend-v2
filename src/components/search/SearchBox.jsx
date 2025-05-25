import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputGroup, FormControl, Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import formatToBE from '../../utils/FormatToBE';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import th from 'date-fns/locale/th';
import TypeService from '../../services/api/accommodation/type.service';

registerLocale('th', th);

const SearchBox = ({ resetFilter }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState(1);

  const [types, setTypes] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const today = new Date();

  useEffect(() => {
    const initialDestination = searchParams.get('destination') || '';
    const initialGuests = parseInt(searchParams.get('guests')) || 1;
    const initialCheckIn = searchParams.get('checkIn');
    const initialCheckOut = searchParams.get('checkOut');

    setDestination(initialDestination);
    setGuests(initialGuests);

    if (initialCheckIn) {
      setCheckInDate(dayjs(initialCheckIn).toDate());
    } else {
      setCheckInDate(dayjs().add(1, 'day').toDate());
    }

    if (initialCheckOut) {
      setCheckOutDate(dayjs(initialCheckOut).toDate());
    } else {
      setCheckOutDate(dayjs().add(2, 'day').toDate());
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await TypeService.getAll();
        setTypes(response.data);
      } catch (error) {
        console.error("Failed to load types:", error);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container-type')) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      destination,
      guests,
      checkIn: dayjs(checkInDate).format('YYYY-MM-DD'),
      checkOut: dayjs(checkOutDate).format('YYYY-MM-DD'),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate(`/search-results?${params.toString()}`);
    setLoading(false);
  };

  const handleCheckInDateChange = (date) => {
    setCheckInDate(date);
    if (!checkOutDate || dayjs(checkOutDate).isSame(date) || dayjs(checkOutDate).isBefore(date)) {
      const nextDate = dayjs(date).add(1, 'day').toDate();
      setCheckOutDate(nextDate);
    }
  };

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date);
  };

  const handleTypeSelect = (typeName) => {
    setSelectedType(typeName);
    setDestination(typeName);
    setShowTypeDropdown(false);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setSelectedType('');
  };

  const CheckInDateInput = ({ value, onClick, placeholder, disabled }) => (
    <InputGroup className="custom-datepicker" onClick={onClick}>
      <InputGroup.Text className="bg-white border-end-0">
        <i className="bi bi-calendar-event text-primary"></i>
      </InputGroup.Text>
      <FormControl
        placeholder={placeholder}
        value={value}
        readOnly
        disabled={disabled}
        className="py-3 fs-6 border-start-0 shadow-sm"
      />
    </InputGroup>
  );

  const CheckOutDateInput = ({ value, onClick, placeholder, disabled }) => (
    <InputGroup className="custom-datepicker" onClick={onClick}>
      <InputGroup.Text className="bg-white border-end-0">
        <i className="bi bi-calendar-event text-primary"></i>
      </InputGroup.Text>
      <FormControl
        placeholder={placeholder}
        value={value}
        readOnly
        disabled={disabled}
        className="py-3 fs-6 border-start-0 shadow-sm"
      />
    </InputGroup>
  );

  return (
    <div className="search-container bg-white p-4 rounded-4 shadow-lg mb-4 mt-4">
      <Form onSubmit={handleSearch}>
        <Row className="align-items-end g-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="position-relative dropdown-container-type">
              <Form.Label className="mb-2 fw-semibold text-secondary d-flex align-items-center gap-2">
                ประเภทห้องพัก
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="ค้นหาประเภท ชื่อห้องพัก เมือง หรือจังหวัด"
                  value={destination}
                  onChange={handleDestinationChange}
                  onClick={() => setShowTypeDropdown(true)}
                  className="py-3 fs-6 border-start-0"
                  autoComplete="off"
                />
              </InputGroup>

              {showTypeDropdown && types.length > 0 && (
                <div
                  className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm"
                  style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}
                >
                  {types.map((type, idx) => (
                    <div
                      key={idx}
                      className={`p-2 border-bottom hover-bg-light ${selectedType === type.name ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTypeSelect(type.name)}
                    >
                      <i className="bi bi-arrow-right-short me-2 text-primary"></i>
                      {type.name}
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <Form.Group>
              <Form.Label className="mb-2 fw-semibold text-secondary">เช็คอิน</Form.Label>
              <DatePicker
                selected={checkInDate}
                onChange={handleCheckInDateChange}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={today}
                dateFormat="dd/MM/yyyy"
                placeholderText="เลือกวันที่"
                locale="th"
                customInput={CheckInDateInput({ placeholder: formatToBE(checkInDate) })}
                popperPlacement="bottom-start"
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <Form.Group>
              <Form.Label className="mb-2 fw-semibold text-secondary">เช็คเอาท์</Form.Label>
              <DatePicker
                selected={checkOutDate}
                onChange={handleCheckOutDateChange}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={dayjs(checkInDate).add(1, 'day').toDate()}
                dateFormat="dd/MM/yyyy"
                placeholderText="เลือกวันที่"
                locale="th"
                disabled={!checkInDate}
                customInput={CheckOutDateInput({ placeholder: formatToBE(checkOutDate), disabled: !checkInDate })}
                popperPlacement="bottom-start"
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={2}>
            <Form.Group>
              <Form.Label className="mb-2 fw-semibold text-secondary">ผู้เข้าพัก</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </InputGroup.Text>
                <Form.Select
                  className="py-3 fs-6 border-start-0"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  <option value={1}>1 ผู้ใหญ่</option>
                  <option value={2}>2 ผู้ใหญ่</option>
                  <option value={3}>3 ผู้ใหญ่</option>
                  <option value={4}>4 ผู้ใหญ่</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={2} className="d-flex align-items-end">
            <Button
              type="submit"
              variant="primary"
              className="w-100 d-flex align-items-center justify-content-center gap-2 py-3 fs-6 rounded-3 fw-bold"
              disabled={loading}
              onClick={resetFilter}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-search"></i>
              )}
              <span>ค้นหา</span>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchBox;
